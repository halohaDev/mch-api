class ShowReportUseCase {
  constructor({ reportRepositoryPostgres }) {
    this._reportRepositoryPostgres = reportRepositoryPostgres;
  }

  async execute(queryParams) {
    const reports = await this._reportRepositoryPostgres.showReport(
      queryParams
    );

    return reports;
  }
}

module.exports = ShowReportUseCase;
