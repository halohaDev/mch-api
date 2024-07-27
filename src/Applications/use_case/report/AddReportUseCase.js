const NewReport = require("../../../Domains/report/entities/AddReport");

class AddReportUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(useCasePayload) {
    const newReport = new NewReport(useCasePayload);

    return await this._reportRepository.addReport(newReport);
  }
}

module.exports = AddReportUseCase;
