class calculateMonthlyJorongReport {
  constructor({
    jorongRepository,
    anteNatalCareRepository,
    postNatalCareRepository,
    complicationRepository,
    maternalHistoryRepository,
    reportRepository,
    dateHelper,
  }) {
    this._jorongRepository = jorongRepository;
    this._anteNatalCareRepository = anteNatalCareRepository;
    this._postNatalCareRepository = postNatalCareRepository;
    this._complicationRepository = complicationRepository;
    this._maternalHistoryRepository = maternalHistoryRepository;
    this._reportRepository = reportRepository;
    this._dateHelper = dateHelper;
  }

  async execute(useCasePayload) {
    const { month, year, jorongId } = useCasePayload;

    const { start, end } = await this.#getStartEndDates(month, year);

    await this._jorongRepository.getJorongById(jorongId);

    const anteNatalCares = await this._reportRepository.getAnteNatalAggregateReport({ jorongId, startDate: start, endDate: end });
    const postNatalCares = await this._reportRepository.getPostNatalAggregateReport({ jorongId, startDate: start, endDate: end });
    const complications = await this._reportRepository.getMaternalComplicationAggregateReport({ jorongId, startDate: start, endDate: end });
    const riskFactors = await this._reportRepository.getRiskFactorAggregateReport({ jorongId, startDate: start, endDate: end });
    const deliveries = await this._reportRepository.getDeliveryAggregateReport({ jorongId, startDate: start, endDate: end });

    return {
      ...anteNatalCares,
      ...postNatalCares,
      ...complications,
      ...riskFactors,
      ...deliveries,
    };
  }

  async #getStartEndDates(month, year) {
    if (month == undefined || year == undefined || month == null || year == null) {
      const currentMonth = await this._dateHelper.new();
      const previousMonth = await this._dateHelper.addMonths(currentMonth, -1);
      const start = await this._dateHelper.getFirstDayOfMonth(previousMonth);
      const end = await this._dateHelper.getLastDayOfMonth(previousMonth);

      return { start, end };
    }

    const queryDate = await this._dateHelper.new(`${year}-${month}-01`);
    const start = await this._dateHelper.getFirstDayOfMonth(queryDate);
    const end = await this._dateHelper.getLastDayOfMonth(start);

    return { start, end };
  }
}

module.exports = calculateMonthlyJorongReport;
