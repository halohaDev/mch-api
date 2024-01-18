const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "production",
  tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE || 1,
});

module.exports = Sentry;
