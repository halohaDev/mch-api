const CalculateAncReportUseCase = require("../../../../Applications/use_case/report/CalculateAncReportUseCase");
const ShowReportUseCase = require("../../../../Applications/use_case/report/ShowReportUseCase");

class ReportHandler {
  constructor(container) {
    this._container = container;

    this.calculateReportHandler = this.calculateReportHandler.bind(this);
    this.getReportHandler = this.getReportHandler.bind(this);
  }

  async calculateReportHandler(request, h) {
    const calculateAncReportUseCase = this._container.getInstance(
      CalculateAncReportUseCase.name
    );

    const { reportType } = request.params;
    let report;
    if (reportType === "anc") {
      const ancReport = await calculateAncReportUseCase.execute(request.query);
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
}

module.exports = ReportHandler;
