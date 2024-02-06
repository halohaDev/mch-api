class CalculateAncMonthlyJorongReportUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(useCasePayload) {
    const { jorongId, month, year } = useCasePayload;

    const { startDate, endDate } = this._getStartAndEndDate(month, year);

    const reports =
      await this._reportRepository.calculateAnteNatalCareJorongMonthlyReport({
        jorongId,
        startDate,
        endDate,
      });

    return reports;
  }

  _getStartAndEndDate(month, year) {
    if (month && year) {
      // get first day of the month
      const startDate = new Date(year, month - 1, 1);

      // get last day of the month
      const endDate = new Date(year, month, 0);

      return { startDate, endDate };
    }

    if (year && !month) {
      // get first day of the year
      const startDate = new Date(year, 0, 1);
      // get last day of the year
      const endDate = new Date(year, 12, 0);

      return { startDate, endDate };
    }

    // default to start and end of current month
    const startDate = new Date();
    startDate.setDate(1);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    return { startDate, endDate };
  }
}

module.exports = CalculateAncMonthlyJorongReportUseCase;
