const CalculateAncMonthlyJorongReportUseCase = require("../../../../Applications/use_case/report/CalculateAncMonthlyJorongReportUseCase");
const ShowReportUseCase = require("../../../../Applications/use_case/report/ShowReportUseCase");
const AddReportUseCase = require("../../../../Applications/use_case/report/AddReportUseCase");

class ReportHandler {
  constructor(container) {
    this._container = container;

    this.calculateReportHandler = this.calculateReportHandler.bind(this);
    this.getReportHandler = this.getReportHandler.bind(this);
    this.addReportHandler = this.addReportHandler.bind(this);
  }

  async calculateReportHandler(request, h) {
    const calculateMonthlyJorongAnc = this._container.getInstance(
      CalculateAncMonthlyJorongReportUseCase.name
    );

    const { reportType } = request.params;
    let report;

    if (reportType === "anc") {
      const ancReport = await calculateMonthlyJorongAnc.execute(request.query);
      report = ancReport;
    }

    const response = h.response({
      status: "success",
      data: report[0],
    });

    response.code(200);
    return response;
  }

  async getReportHandler(request, h) {
    const report = await this._container
      .getInstance(ShowReportUseCase.name)
      .execute(request.query);

    const response = h.response({
      status: "success",
      data: report,
    });

    response.code(200);
    return response;
  }

  async addReportHandler(request, h) {
    const report = await this._container
      .getInstance(AddReportUseCase.name)
      .execute(request.payload);

    const response = h.response({
      status: "success",
      data: report,
    });

    response.code(201);
    return response;
  }
}

module.exports = ReportHandler;
