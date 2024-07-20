const cron = require("node-cron");

// fanout
const FanOutCalculateReportJorong = require("../Interfaces/scheduler/FanOutCalculateReportJorong");

const scheduler = async (container, sentry) => {
  try {
    const tasks = [
      {
        cron: "0 0 1 * *",
        fn: async () => {
          await new FanOutCalculateReportJorong(container).perform();
        },
      },
    ];

    tasks.forEach((task) => {
      cron.schedule(task.cron, task.fn);
    });
  } catch (error) {
    console.log(error);
    sentry?.captureException(response);
  }
};

module.exports = scheduler;
