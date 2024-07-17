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

    const anteNatalCares = await this._reportRepository.getAnteNatalAggregateReport(jorongId, start, end);
    const postNatalCares = await this._reportRepository.getPostNatalAggregateReport(jorongId, start, end);
    const complications = await this._reportRepository.getComplicationAggregateReport(jorongId, start, end);
    const riskFactors = await this._reportRepository.getRiskFactorAggregateReport(jorongId, start, end);

    return anteNatalCares + postNatalCares + complications + riskFactors;
  }

  async #getStartEndDates(month, year) {
    const start = await this._dateHelper.new(`${year}-${month}-01 00:00:00`);
    const end = await this._dateHelper.new(start).endOf("month").endOf("day");

    return { start, end };
  }
}
