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
      const currentMonthResult = await this._calculateMonthlyJorongReport.execute({ jorongId, month, year });

      calculationResults.push({
        jorongId,
        currentMonthResult,
      });
    }

    const previousMonth = parseInt(month) - 1;
    const { data: previousMonthReport } = await this._reportRepository.showReport({
      reportType: "jorong_monthly",
      month: previousMonth,
      year,
    });

    for (const result of calculationResults) {
      const previousMonthResult =
        previousMonthReport.find((report) => {
          report.jorongId === result.jorongId && report.year === result.year;
        })?.aggregatedData || {};

      const kumulatifResult = this.#calculateKumulatif(result.currentMonthResult, previousMonthResult);
      result.result = kumulatifResult;
    }

    for (const result of calculationResults) {
      const requestedBy = placements.find((placement) => placement.jorongId === result.jorongId).midwifeId;
      await this._reportRepository.addReport({
        jorongId: result.jorongId,
        reportType: "jorong_monthly",
        data: result.result,
        month: parseInt(month),
        year: parseInt(year),
        status: "review",
        requestedBy,
      });
    }
  }

  #calculateKumulatif(currentMonthResult, previousMonthReport) {
    const kumulatifResult = {
      kumulatifC1: (currentMonthResult.c1 || 0) + (previousMonthReport.kumulatifC1 || 0),
      kumulatifC2: (currentMonthResult.c2 || 0) + (previousMonthReport.kumulatifC2 || 0),
      kumulatifC3: (currentMonthResult.c3 || 0) + (previousMonthReport.kumulatifC3 || 0),
      kumulatifC4: (currentMonthResult.c4 || 0) + (previousMonthReport.kumulatifC4 || 0),
      kumulatifC5: (currentMonthResult.c5 || 0) + (previousMonthReport.kumulatifC5 || 0),
      kumulatifC6: (currentMonthResult.c6 || 0) + (previousMonthReport.kumulatifC6 || 0),
      kumulatifTotalAnc: (currentMonthResult.totalAnc || 0) + (previousMonthReport.kumulatifTotalAnc || 0),
      kumulatifTotalPnc: (currentMonthResult.totalPnc || 0) + (previousMonthReport.kumulatifTotalPnc || 0),
      kumulatifPnc1: (currentMonthResult.pnc1 || 0) + (previousMonthReport.kumulatifPnc1 || 0),
      kumulatifPnc2: (currentMonthResult.pnc2 || 0) + (previousMonthReport.kumulatifPnc2 || 0),
      kumulatifPnc3: (currentMonthResult.pnc3 || 0) + (previousMonthReport.kumulatifPnc3 || 0),
      kumulatifPnc4: (currentMonthResult.pnc4 || 0) + (previousMonthReport.kumulatifPnc4 || 0),
      kumulatifAncComplication: (currentMonthResult.ancComplication || 0) + (previousMonthReport.kumulatifAncComplication || 0),
      kumulatifPncComplication: (currentMonthResult.pncComplication || 0) + (previousMonthReport.kumulatifPncComplication || 0),
      kumulatifAncDeath: (currentMonthResult.ancDeath || 0) + (previousMonthReport.kumulatifAncDeath || 0),
      kumulatifPncDeath: (currentMonthResult.pncDeath || 0) + (previousMonthReport.kumulatifPncDeath || 0),
      kumulatifDukunDelivery: (currentMonthResult.dukunDelivery || 0) + (previousMonthReport.kumulatifDukunDelivery || 0),
      kumulatifHighRiskDelivery: (currentMonthResult.highRiskDelivery || 0) + (previousMonthReport.kumulatifHighRiskDelivery || 0),
      kumulatifRiskDelivery: (currentMonthResult.riskDelivery || 0) + (previousMonthReport.kumulatifRiskDelivery || 0),
      kumulatifDelivery: (currentMonthResult.delivery || 0) + (previousMonthReport.kumulatifDelivery || 0),
      kumulatifRisk: (currentMonthResult.risk || 0) + (previousMonthReport.kumulatifRisk || 0),
      kumulatifHighRisk: (currentMonthResult.highRisk || 0) + (previousMonthReport.kumulatifHighRisk || 0),
    };

    const previousMonthResult = {
      previousMonthC1: previousMonthReport.c1 || 0,
      previousMonthC2: previousMonthReport.c2 || 0,
      previousMonthC3: previousMonthReport.c3 || 0,
      previousMonthC4: previousMonthReport.c4 || 0,
      previousMonthC5: previousMonthReport.c5 || 0,
      previousMonthC6: previousMonthReport.c6 || 0,
      previousMonthTotalAnc: previousMonthReport.totalAnc || 0,
      previousMonthTotalPnc: previousMonthReport.totalPnc || 0,
      previousMonthPnc1: previousMonthReport.pnc1 || 0,
      previousMonthPnc2: previousMonthReport.pnc2 || 0,
      previousMonthPnc3: previousMonthReport.pnc3 || 0,
      previousMonthPnc4: previousMonthReport.pnc4 || 0,
      previousMonthAncComplication: previousMonthReport.ancComplication || 0,
      previousMonthPncComplication: previousMonthReport.pncComplication || 0,
      previousMonthAncDeath: previousMonthReport.ancDeath || 0,
      previousMonthPncDeath: previousMonthReport.pncDeath || 0,
      previousMonthDukunDelivery: previousMonthReport.dukunDelivery || 0,
      previousMonthHighRiskDelivery: previousMonthReport.highRiskDelivery || 0,
      previousMonthRiskDelivery: previousMonthReport.riskDelivery || 0,
      previousMonthDelivery: previousMonthReport.delivery || 0,
      previousMonthRisk: previousMonthReport.risk || 0,
      previousMonthHighRisk: previousMonthReport.highRisk || 0,
    };

    return {
      ...currentMonthResult,
      ...kumulatifResult,
      ...previousMonthResult,
    };
  }
}

module.exports = CalculateAllRecapJorongUseCase;
