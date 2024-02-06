const ReportType = require("../../../Commons/constants/ReportType");
const AddAnteNatalCareReport = require("../../../Domains/report/entities/AddAnteNatalCareReport");
const UnprocessableError = require("../../../Commons/exceptions/UnprocessableError");

class AddReportUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(useCasePayload) {
    const reportType = useCasePayload.reportType;
    const report = this._getReportData(reportType, useCasePayload);

    if (report == null || report == undefined) {
      throw new UnprocessableError("Report type not found");
    }

    return await this._reportRepository.addReport(report);
  }

  _getReportData(reportType, useCasePayload) {
    if (reportType == undefined) {
      return null;
    }

    const reportData = {
      [ReportType.ANC_JORONG_MONTHLY]: new AddAnteNatalCareReport(
        useCasePayload
      ),
      [ReportType.ANC_JORONG_YEARLY]: new AddAnteNatalCareReport(
        useCasePayload
      ),
      [ReportType.ANC_PUSKESMAS_MONTHLY]: new AddAnteNatalCareReport(
        useCasePayload
      ),
      [ReportType.ANC_PUSKESMAS_YEARLY]: new AddAnteNatalCareReport(
        useCasePayload
      ),
    };

    if (reportData[reportType] == null) {
      return null;
    }

    return reportData[reportType];
  }
}

module.exports = AddReportUseCase;
