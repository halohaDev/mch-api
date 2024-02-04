const ReportType = require("../../../Commons/constants/ReportType");
const AddAnteNatalCareReport = require("../../../Domains/report/entities/AddAnteNatalCareReport");
const UnprocessableError = require("../../../Commons/exceptions/UnprocessableError");

class AddReportUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(useCasePayload) {
    const reportType = useCasePayload.reportType;

    const ancTypes = [
      ReportType.ANC_JORONG_MONTHLY,
      ReportType.ANC_JORONG_YEARLY,
      ReportType.ANC_PUSKESMAS_MONTHLY,
      ReportType.ANC_PUSKESMAS_YEARLY,
    ];

    if (ancTypes.includes(reportType)) {
      const report = new AddAnteNatalCareReport(useCasePayload);
      return this._reportRepository.addReport(report);
    }

    if (!report) {
      throw new UnprocessableError("Report type not found");
    }
  }
}

module.exports = AddReportUseCase;
