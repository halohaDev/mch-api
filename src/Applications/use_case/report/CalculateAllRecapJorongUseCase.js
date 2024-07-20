class CalculateAllRecapJorongUseCase {
  constructor({ placementRepository, reportRepository, calculateMonthlyJorongReport, dateHelper }) {
    this._placementRepository = placementRepository;
    this._reportRepository = reportRepository;
    this._calculateMonthlyJorongReport = calculateMonthlyJorongReport;
    this._dateHelper = dateHelper;
  }

  async execute(useCasePayload) {
    const { specificDate, midwifeId } = useCasePayload;

    const { data: placements } = await this._placementRepository.getAllPlacements({ midwifeId });
    const jorongIds = placements.map((placement) => placement.jorongId);
    const uniqueJorongIds = [...new Set(jorongIds)];

    const targetDate = specificDate ? specificDate : new Date();

    const objectDate = await this._dateHelper.new(targetDate);
    const month = objectDate.format("M");
    const year = objectDate.format("YYYY");

    const processedReport = await this._reportRepository.getOnProcessRecapJorong(month, year);
    const proccessedJorongId = processedReport.map((report) => report.jorongId);

    const unprocessedJorongIds = uniqueJorongIds.filter((jorongId) => !proccessedJorongId.includes(jorongId));
    const calculationResults = [];

    for (const jorongId of unprocessedJorongIds) {
      const calculation = await this._calculateMonthlyJorongReport.execute({ jorongId, month, year });

      calculationResults.push({
        jorongId,
        result: calculation,
      });
    }

    for (const result of calculationResults) {
      const requestedBy = placements.find((placement) => placement.jorongId === result.jorongId).midwifeId;
      await this._reportRepository.addReport({
        jorongId: result.jorongId,
        reportType: "jorong_monthly",
        data: result.result,
        month: parseInt(month),
        year: parseInt(year),
        status: "draft",
        requestedBy,
      });
    }
  }
}

module.exports = CalculateAllRecapJorongUseCase;
