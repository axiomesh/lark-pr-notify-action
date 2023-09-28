// !!! to use env file, first rename it to .env.js

// the users who is responsible to the pr, e.g. "Alice|132XXXX,Bob|133XXXX"
process.env.NOTIFY_ACTION_USERS = "";
// the reviewers of the pr, e.g. "132XXXX, 178XXXX"
process.env.NOTIFY_ACTION_REVIEWERS = "";
// the robot webhook url
process.env.NOTIFY_ACTION_WEBHOOK = "";
// the pr url, usually you don't need it, it's only used for mock, e.g. "https://github.com"
process.env.NOTIFY_ACTION_GITHUB_URL = "";
// the pr submittor, usually you don't need it, it's only used for mock, e.g. "Alice"
process.env.NOTIFY_ACTION_ACTOR = ""