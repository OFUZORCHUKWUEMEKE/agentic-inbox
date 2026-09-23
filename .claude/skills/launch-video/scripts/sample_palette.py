#!/usr/bin/env python3
"""Read exact colours out of a PNG screenshot, using only the standard library.

These containers usually have no Pillow, no ImageMagick and no ffmpeg, so the
usual ways to inspect an image are not available. This decodes a PNG directly
and answers the only two questions a palette needs:

    sample_palette.py shot.png                    # what colours dominate?
    sample_palette.py shot.png 1200,340 60,650    # what colour is exactly here?

Coordinates are pixels in the real image. If you are reading them off a
displayed copy, pass --displayed WxH and they will be scaled for you, which
saves doing the arithmetic by hand and getting it wrong.

Why this matters: a brand's orange is not one value once it is a gradient
behind a drop shadow, and eyeballing a screenshot gets you a colour that is
close enough to look wrong next to the real product. Sample it.

Interlaced PNGs are rejected rather than silently mis-decoded.
"""

import argparse
import struct
import sys
import zlib
from collections import Counter


def load(path):
    data = open(path, "rb").read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        sys.exit(f"{path}: not a PNG")

    pos, idat, palette = 8, [], None
    width = height = depth = ctype = interlace = 0

    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos : pos + 4])
        kind = data[pos + 4 : pos + 8]
        chunk = data[pos + 8 : pos + 8 + length]
        if kind == b"IHDR":
            width, height, depth, ctype, _, _, interlace = struct.unpack(
                ">IIBBBBB", chunk[:13]
            )
        elif kind == b"PLTE":
            palette = chunk
        elif kind == b"IDAT":
            idat.append(chunk)
        elif kind == b"IEND":
            break
        pos += 12 + length

    if interlace:
        sys.exit(f"{path}: interlaced PNGs are not supported")
    if depth not in (8, 16):
        sys.exit(f"{path}: unsupported bit depth {depth}")

    raw = zlib.decompress(b"".join(idat))
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[ctype]
    bpp = max(1, channels * depth // 8)
    stride = (width * channels * depth + 7) // 8

    rows, prev, p = [], bytearray(stride), 0
    for _ in range(height):
        filt = raw[p]
        p += 1
        line = bytearray(raw[p : p + stride])
        p += stride
        # Undo the per-scanline filter (PNG spec section 6).
        for i in range(stride):
            a = line[i - bpp] if i >= bpp else 0
            b = prev[i]
            c = prev[i - bpp] if i >= bpp else 0
            if filt == 1:
                line[i] = (line[i] + a) & 255
            elif filt == 2:
                line[i] = (line[i] + b) & 255
            elif filt == 3:
                line[i] = (line[i] + (a + b) // 2) & 255
            elif filt == 4:
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pred = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pred) & 255
        rows.append(bytes(line))
        prev = line

    return {
        "w": width,
        "h": height,
        "depth": depth,
        "ctype": ctype,
        "channels": channels,
        "palette": palette,
        "rows": rows,
    }


def pixel(img, x, y):
    row = img["rows"][y]
    if img["ctype"] == 3:
        i = row[x]
        return tuple(img["palette"][i * 3 : i * 3 + 3])
    step = img["channels"] * img["depth"] // 8
    o = x * step
    if img["depth"] == 16:
        return (row[o], row[o + 2], row[o + 4])
    if img["ctype"] in (0, 4):
        return (row[o], row[o], row[o])
    return (row[o], row[o + 1], row[o + 2])


def hexof(rgb):
    return "#%02x%02x%02x" % rgb


def dominant(img, top, step):
    """Most common colours, and the most saturated ones.

    Flat UI is mostly white and near-white, so the raw top-N is all
    background. The saturated list is where the brand colours actually
    show up - the accent button, the unread dot, the one amber rule.
    """
    counts = Counter()
    for y in range(0, img["h"], step):
        for x in range(0, img["w"], step):
            counts[pixel(img, x, y)] += 1

    total = sum(counts.values())
    print(f"{img['w']}x{img['h']}  sampled every {step}px  ({total} samples)\n")

    print("most common:")
    for rgb, n in counts.most_common(top):
        print(f"  {hexof(rgb):9s} {100 * n / total:5.1f}%")

    def sat(rgb):
        return max(rgb) - min(rgb)

    vivid = [(rgb, n) for rgb, n in counts.items() if sat(rgb) > 60]
    vivid.sort(key=lambda t: -t[1])
    print("\nmost saturated (brand colours usually live here):")
    for rgb, n in vivid[:top]:
        print(f"  {hexof(rgb):9s} {100 * n / total:5.1f}%  sat {sat(rgb)}")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("image")
    ap.add_argument("points", nargs="*", help="x,y pairs to sample exactly")
    ap.add_argument("--displayed", help="WxH of the copy your coords came from")
    ap.add_argument("--top", type=int, default=10)
    ap.add_argument("--step", type=int, default=4, help="sampling stride")
    args = ap.parse_args()

    img = load(args.image)

    if not args.points:
        dominant(img, args.top, args.step)
        return

    sx = sy = 1.0
    if args.displayed:
        dw, dh = (int(v) for v in args.displayed.lower().split("x"))
        sx, sy = img["w"] / dw, img["h"] / dh
        print(f"scaling coords by {sx:.3f} x {sy:.3f}\n")

    for point in args.points:
        px, py = (int(v) for v in point.split(","))
        x = min(img["w"] - 1, int(px * sx))
        y = min(img["h"] - 1, int(py * sy))
        print(f"  {point:>12s} -> {hexof(pixel(img, x, y))}")


if __name__ == "__main__":
    main()
