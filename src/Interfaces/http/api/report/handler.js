const CalculateAncReportUseCase = require("../../../use_cases/report/CalculateAncReportUseCase");

class ReportHandler {
  constructor(container) {
    this._container = container;

    this.calculateReportHandler = this.calculateReportHandler.bind(this);
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
      data: {
        report,
      },
    });

    response.code(200);
    return response;
  }
}
