class ShowReportUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(queryParams) {
    const reports = await this._reportRepository.showReport(queryParams);
    return reports;
  }
}

module.exports = ShowReportUseCase;
