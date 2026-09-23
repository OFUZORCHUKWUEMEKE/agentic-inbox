/* Everything the film says, in one file. Change the story here; the
   scenes read from it and lay it out. Keep the counts the same (three
   tool calls, five thread rows, three stack cards) or adjust the frame
   maths in the scene that renders them. */

/** The one line the opening shot says out loud. */
export const ARRIVAL_TITLE = "Mail arrives on your own domain.";

export const MAILBOX = "thomas@feedback.cloudflare.com";
export const OWNER = "Thomas Gauvin";

/** The email that arrives in ArrivalScene and is answered in DraftScene. */
export const INBOUND = {
  from: "john@appsinprogress.com",
  name: "John Murphy",
  subject: "Requesting access to Cloudflare Email Service",
  preview: "Hi, my name is John Murphy and I'd like to request access to",
  body: [
    "Hi,",
    "My name is John Murphy and I would like to request access to the Cloudflare Email Service private beta. I'm excited about the product and would love to try it out.",
    "Thanks,",
    "John Murphy",
  ],
  time: "9:37 AM",
};

/** The inbox behind it. Row 0 is INBOUND, arriving live on camera. */
export const THREADS = [
  { from: "john, thomas", subject: INBOUND.subject, count: 2, unread: true },
  { from: "nadia, thomas", subject: "Re: onboarding for the beta", count: 2, unread: false },
  { from: "elena, thomas", subject: "Domain verification stuck", count: 3, unread: true },
  { from: "hassan, thomas", subject: "Invoice for March", count: 2, unread: false },
  { from: "kwame, thomas", subject: "Routing rule not firing", count: 4, unread: true },
  { from: "amara, thomas", subject: "Re: SPF and DKIM setup", count: 2, unread: false },
  { from: "wei, thomas", subject: "Attachment size limits", count: 2, unread: false },
];

export const FOLDERS = [
  { label: "Inbox", count: 52, active: true },
  { label: "Sent", count: null, active: false },
  { label: "Drafts", count: 718, active: false },
  { label: "Archive", count: null, active: false },
  { label: "Trash", count: null, active: false },
];

/** The agent's run, in the order the panel streams it. Names are the
    real tools from workers/agent/index.ts - keep them honest. */
export const TOOL_CALLS = [
  {
    name: "get_thread",
    arg: "thread_id: 4f19c2",
    result: "2 messages · john@appsinprogress.com",
  },
  {
    name: "search_emails",
    arg: 'query: "private beta access"',
    result: "11 prior threads · 9 approved",
  },
  {
    name: "draft_reply",
    arg: "tone: from your last 9 replies",
    result: "Draft saved — not sent",
  },
];

/** The reply the agent writes, typed out in DraftScene. */
export const DRAFT = {
  to: INBOUND.from,
  body: "Hey John,\n\nThanks for reaching out. What's your Cloudflare account ID? I'll get you enabled as soon as I have it.\n\nThomas",
};

/** Every tool the agent is given, verbatim from
    workers/agent/index.ts. There is deliberately no send_* among
    them - ConfirmScene is built on that absence, so if a send tool is
    ever added to the agent, this list and that scene both change. */
export const TOOLS = [
  "list_emails",
  "get_email",
  "get_thread",
  "search_emails",
  "draft_email",
  "draft_reply",
  "mark_email_read",
  "move_email",
  "discard_draft",
];

/** The beat that carries the product's actual promise. */
export const CONFIRM = {
  kicker: "Nine tools",
  line: "Sending isn't one of them.",
  sub: "Every send is yours to press.",
};

/** StackScene. Three claims, each true of the repository. */
export const STACK = [
  {
    title: "Durable Object per mailbox",
    body: "SQLite storage, isolated. One mailbox can't read another.",
  },
  {
    title: "Your Cloudflare account",
    body: "Email Routing in, Email Service out, R2 for attachments.",
  },
  {
    title: "Workers AI",
    body: "The agent runs on your worker. No third party sees the mail.",
  },
];

export const OUTRO = {
  wordmark: "Agentic Inbox",
  tagline: "Your inbox, your account, your agent.",
  caption: "Self-hosted on Cloudflare Workers · Apache 2.0",
  url: "github.com/cloudflare/agentic-inbox",
};

export const TEASER_OUTRO = {
  caption: "Self-hosted · Coming soon",
  url: "github.com/cloudflare/agentic-inbox",
};
