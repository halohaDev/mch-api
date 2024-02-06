const UpdateStatusReport = require("../../../Domains/report/entities/UpdateStatusReport");

class UpdateReportStatusUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(id, payload) {
    const updateStatusReport = new UpdateStatusReport(payload);

    const newPayload = {
      id,
      ...updateStatusReport,
    };

    await this._reportRepository.updateReportStatusAndNote(newPayload);
  }
}

module.exports = UpdateReportStatusUseCase;
