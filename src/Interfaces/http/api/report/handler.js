const CalculateAncMonthlyJorongReportUseCase = require("../../../../Applications/use_case/report/CalculateAncMonthlyJorongReportUseCase");
const CalculateAncMonthlyPuskesmasReportUseCase = require("../../../../Applications/use_case/report/CalculateAncMonthlyPuskesmasReportUseCase");
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
    // create key value hash that can be acceessed by the reportType
    const calculatorTypes = {
      "anc-monthly-jorong": CalculateAncMonthlyJorongReportUseCase.name,
      "anc-monthly-puskesmas": CalculateAncMonthlyPuskesmasReportUseCase.name,
    };

    const { reportType } = request.params;
    const calculatorUseCaseName = calculatorTypes[reportType];

    const calculatorUseCase = this._container.getInstance(
      calculatorUseCaseName
    );

    const report = await calculatorUseCase.execute(request.query);

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
