const Sentry = require("@sentry/node");

module.exports = Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "production",
  tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE || 1,
});
