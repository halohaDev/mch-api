class CalculateAncMonthlyPuskesmasReportUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(useCasePayload) {
    const { month, year } = useCasePayload;

    const reports =
      await this._reportRepository.calculateAnteNatalCarePuskesmasMonthlyReport(
        {
          month,
          year,
        }
      );

    return reports;
  }
}

module.exports = CalculateAncMonthlyPuskesmasReportUseCase;
