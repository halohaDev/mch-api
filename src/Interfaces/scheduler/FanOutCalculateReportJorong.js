const SchedulerBase = require("./SchedulerBase");
const CalculateAllRecapJorongUseCase = require("../../Applications/use_case/report/CalculateAllRecapJorongUseCase");

class FanOutCalculateReportJorong extends SchedulerBase {
  constructor(container) {
    super(container);
  }

  async perform() {
    try {
      const calculateAllRecapJorongUseCase = this._container.getInstance(CalculateAllRecapJorongUseCase.name);
      console.log("calculated");
      await calculateAllRecapJorongUseCase.execute({});
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = FanOutCalculateReportJorong;
