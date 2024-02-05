class UpdateReportStatusUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(useCasePayload) {
    await this._reportRepository.updateStatusReport(useCasePayload);
  }
}

module.exports = UpdateReportStatusUseCase;
