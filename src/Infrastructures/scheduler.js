const cron = require("node-cron");

const tasks = [
  {
    name: "",
    cron: "* * * * *",
    fn: () => {
      console.log("test");
    },
  },
];

const scheduled = async () => {
  tasks.forEach((task) => {
    cron.schedule(task.cron, task.fn, { name: task.name });
  });
};

module.exports = { scheduled };
