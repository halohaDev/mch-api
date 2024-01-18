import * as Sentry from "@sentry/node";

module.exports = Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE || 0.5,
});
