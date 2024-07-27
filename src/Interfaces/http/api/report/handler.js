const CalculateAncMonthlyJorongReportUseCase = require("../../../../Applications/use_case/report/CalculateAncMonthlyJorongReportUseCase");
const CalculateAncMonthlyPuskesmasReportUseCase = require("../../../../Applications/use_case/report/CalculateAncMonthlyPuskesmasReportUseCase");
const ShowReportUseCase = require("../../../../Applications/use_case/report/ShowReportUseCase");
const AddReportUseCase = require("../../../../Applications/use_case/report/AddReportUseCase");
const UpdateReportStatusUseCase = require("../../../../Applications/use_case/report/UpdateReportStatusUseCase");
const CalculateMonthlyJorongReport = require("../../../../Applications/use_case/report/CalculateMonthlyJorongReport");
const ShowReportByIdUseCase = require("../../../../Applications/use_case/report/ShowReportByIdUseCase");

class ReportHandler {
  constructor(container) {
    this._container = container;

    this.calculateReportHandler = this.calculateReportHandler.bind(this);
    this.getReportHandler = this.getReportHandler.bind(this);
    this.addReportHandler = this.addReportHandler.bind(this);
    this.updateReportHandler = this.updateReportHandler.bind(this);
    this.calculateReportJorongMonthly = this.calculateReportJorongMonthly.bind(this);
    this.getReportByIdHandler = this.getReportByIdHandler.bind(this);
  }

  async calculateReportHandler(request, h) {
    // create key value hash that can be acceessed by the reportType
    const calculatorTypes = {
      "anc-monthly-jorong": CalculateAncMonthlyJorongReportUseCase.name,
      "anc-monthly-puskesmas": CalculateAncMonthlyPuskesmasReportUseCase.name,
    };

    const { reportType } = request.params;
    const calculatorUseCaseName = calculatorTypes[reportType];

    const calculatorUseCase = this._container.getInstance(calculatorUseCaseName);

    const report = await calculatorUseCase.execute(request.query);

    const response = h.response({
      status: "success",
      data: report[0],
    });

    response.code(200);
    return response;
  }

  async getReportByIdHandler(request, h) {
    const report = await this._container.getInstance(ShowReportByIdUseCase.name).execute(request.params.id);

    const response = h.response({
      status: "success",
      data: report,
    });

    response.code(200);
    return response;
  }

  async getReportHandler(request, h) {
    const report = await this._container.getInstance(ShowReportUseCase.name).execute(request.query);

    const response = h.response({
      status: "success",
      data: report.data,
      meta: report.meta,
    });

    response.code(200);
    return response;
  }

  async addReportHandler(request, h) {
    const report = await this._container.getInstance(AddReportUseCase.name).execute(request.payload);

    const response = h.response({
      status: "success",
      data: report,
    });

    response.code(201);
    return response;
  }

  async updateReportHandler(request, h) {
    const { role, id } = request.auth.credentials;

    const report = await this._container.getInstance(UpdateReportStatusUseCase.name).execute(request.params.id, request.payload, role, id);

    const response = h.response({
      status: "success",
      data: report,
    });

    response.code(200);
    return response;
  }

  async calculateReportJorongMonthly(request, h) {
    const { jorongId } = request.params;
    const { month, year } = request.query;

    const report = await this._container.getInstance(CalculateMonthlyJorongReport.name).execute({ jorongId, month, year });

    const response = h.response({
      status: "success",
      data: report,
    });

    response.code(200);
    return response;
  }
}

module.exports = ReportHandler;
