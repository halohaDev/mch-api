class CalculatePwsReportUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(useCasePayload) {
    const { month, year, requestedBy } = useCasePayload;

    const reports = await this._reportRepository.showReport({
      month,
      year,
      reportType: "jorong_monthly",
      status: "approved",
      perPage: 1000,
    });

    const reportObjectives = await this._reportRepository.getReportObjectiveByYear(year);

    const pwsIbu = this.#calculatePwsIbu(reports.data, reportObjectives);

    await this._reportRepository.addReport({
      reportType: "pws_ibu",
      data: pwsIbu,
      month,
      year,
      status: "draft",
      requestedBy: requestedBy,
    });
  }

  #calculatePwsIbu(reports, reportObjectives) {
    const calculationResult = {
      totalC1: 0,
      totalPreviousMonthC1: 0,
      totalKumulatifC1: 0,
      totalAbsoluteC1: 0,
      totalC4: 0,
      totalPreviousMonthC4: 0,
      totalKumulatifC4: 0,
      totalAbsoluteC4: 0,
      totalC6: 0,
      totalPreviousMonthC6: 0,
      totalKumulatifC6: 0,
      totalAbsoluteC6: 0,
      totalRisk: 0,
      totalPreviousMonthRisk: 0,
      totalKumulatifRisk: 0,
      totalAbsoluteRisk: 0,
      totalHighRisk: 0,
      totalPreviousMonthHighRisk: 0,
      totalKumulatifHighRisk: 0,
      totalAbsoluteHighRisk: 0,
      totalDelivery: 0,
      totalPreviousMonthDelivery: 0,
      totalKumulatifDelivery: 0,
      totalAbsoluteDelivery: 0,
      totalDukunDelivery: 0,
      totalPreviousMonthDukunDelivery: 0,
      totalKumulatifDukunDelivery: 0,
      totalAbsoluteDukunDelivery: 0,
      totalDeliveryComplication: 0,
      totalPreviousMonthDeliveryComplication: 0,
      totalKumulatifDeliveryComplication: 0,
      totalAbsoluteDeliveryComplication: 0,
      totalPnc1: 0,
      totalPreviousMonthPnc1: 0,
      totalKumulatifPnc1: 0,
      totalAbsolutePnc1: 0,
      totalPnc2: 0,
      totalPreviousMonthPnc2: 0,
      totalKumulatifPnc2: 0,
      totalAbsolutePnc2: 0,
      totalPnc3: 0,
      totalPreviousMonthPnc3: 0,
      totalKumulatifPnc3: 0,
      totalAbsolutePnc3: 0,
      totalPnc4: 0,
      totalPreviousMonthPnc4: 0,
      totalKumulatifPnc4: 0,
      totalAbsolutePnc4: 0,
    };

    const totalReportObjectives = {
      anteNatalTarget: reportObjectives.map((reportObjective) => reportObjective.anteNatalTarget).reduce((a, b) => a + b, 0),
      postNatalTarget: reportObjectives.map((reportObjective) => reportObjective.postNatalTarget).reduce((a, b) => a + b, 0),
      deliveryTarget: reportObjectives.map((reportObjective) => reportObjective.deliveryTarget).reduce((a, b) => a + b, 0),
      anteNatalHighRiskTarget: reportObjectives
        .map((reportObjective) => reportObjective.anteNatalHighRiskTarget)
        .reduce((a, b) => a + b, 0),
      babyTarget: reportObjectives.map((reportObjective) => reportObjective.babyTarget).reduce((a, b) => a + b, 0),
    };

    reports.forEach((report) => {
      calculationResult.totalC1 += report?.aggregatedData?.c1 || 0;
      calculationResult.totalPreviousMonthC1 += report?.aggregatedData?.previousMonthC1 || 0;
      calculationResult.totalKumulatifC1 += report?.aggregatedData?.kumulatifC1 || 0;
      calculationResult.totalAbsoluteC1 += report?.aggregatedData?.kumulatifC1 / totalReportObjectives.anteNatalTarget || 0;
      calculationResult.totalC4 += report?.aggregatedData?.c4 || 0;
      calculationResult.totalPreviousMonthC4 += report?.aggregatedData?.previousMonthC4 || 0;
      calculationResult.totalKumulatifC4 += report?.aggregatedData?.kumulatifC4 || 0;
      calculationResult.totalAbsoluteC4 += report?.aggregatedData?.kumulatifC4 / totalReportObjectives.anteNatalTarget || 0;
      calculationResult.totalC6 += report?.aggregatedData?.c6 || 0;
      calculationResult.totalPreviousMonthC6 += report?.aggregatedData?.previousMonthC6 || 0;
      calculationResult.totalKumulatifC6 += report?.aggregatedData?.kumulatifC6 || 0;
      calculationResult.totalAbsoluteC6 += report?.aggregatedData?.kumulatifC6 / totalReportObjectives.anteNatalTarget || 0;
      calculationResult.totalRisk += report?.aggregatedData?.risk || 0;
      calculationResult.totalPreviousMonthRisk += report?.aggregatedData?.previousMonthRisk || 0;
      calculationResult.totalKumulatifRisk += report?.aggregatedData?.kumulatifRisk || 0;
      calculationResult.totalAbsoluteRisk += report?.aggregatedData?.kumulatifRisk / totalReportObjectives.anteNatalHighRiskTarget || 0;
      calculationResult.totalHighRisk += report?.aggregatedData?.highRisk || 0;
      calculationResult.totalPreviousMonthHighRisk += report?.aggregatedData?.previousMonthHighRisk || 0;
      calculationResult.totalKumulatifHighRisk += report?.aggregatedData?.kumulatifHighRisk || 0;
      calculationResult.totalAbsoluteHighRisk +=
        report?.aggregatedData?.kumulatifHighRisk / totalReportObjectives.anteNatalHighRiskTarget || 0;
      calculationResult.totalDelivery += report?.aggregatedData?.delivery || 0;
      calculationResult.totalPreviousMonthDelivery += report?.aggregatedData?.previousMonthDelivery || 0;
      calculationResult.totalKumulatifDelivery += report?.aggregatedData?.kumulatifDelivery || 0;
      calculationResult.totalAbsoluteDelivery += report?.aggregatedData?.kumulatifDelivery / totalReportObjectives.babyTarget || 0;
      calculationResult.totalDukunDelivery += report?.aggregatedData?.dukunDelivery || 0;
      calculationResult.totalPreviousMonthDukunDelivery += report?.aggregatedData?.previousMonthDukunDelivery || 0;
      calculationResult.totalKumulatifDukunDelivery += report?.aggregatedData?.kumulatifDukunDelivery || 0;
      calculationResult.totalAbsoluteDukunDelivery +=
        report?.aggregatedData?.kumulatifDukunDelivery / totalReportObjectives.deliveryTarget || 0;
      calculationResult.totalDeliveryComplication += report?.aggregatedData?.deliveryComplication || 0;
      calculationResult.totalPreviousMonthDeliveryComplication += report?.aggregatedData?.previousMonthDeliveryComplication || 0;
      calculationResult.totalKumulatifDeliveryComplication += report?.aggregatedData?.kumulatifDeliveryComplication || 0;
      calculationResult.totalAbsoluteDeliveryComplication +=
        report?.aggregatedData?.kumulatifDeliveryComplication / totalReportObjectives.deliveryTarget || 0;
      calculationResult.totalPnc1 += report?.aggregatedData?.pnc1 || 0;
      calculationResult.totalPreviousMonthPnc1 += report?.aggregatedData?.previousMonthPnc1 || 0;
      calculationResult.totalKumulatifPnc1 += report?.aggregatedData?.kumulatifPnc1 || 0;
      calculationResult.totalAbsolutePnc1 += report?.aggregatedData?.kumulatifPnc1 / totalReportObjectives.postNatalTarget || 0;
      calculationResult.totalPnc2 += report?.aggregatedData?.pnc2 || 0;
      calculationResult.totalPreviousMonthPnc2 += report?.aggregatedData?.previousMonthPnc2 || 0;
      calculationResult.totalKumulatifPnc2 += report?.aggregatedData?.kumulatifPnc2 || 0;
      calculationResult.totalAbsolutePnc2 += report?.aggregatedData?.kumulatifPnc2 / totalReportObjectives.postNatalTarget || 0;
      calculationResult.totalPnc3 += report?.aggregatedData?.pnc3 || 0;
      calculationResult.totalPreviousMonthPnc3 += report?.aggregatedData?.previousMonthPnc3 || 0;
      calculationResult.totalKumulatifPnc3 += report?.aggregatedData?.kumulatifPnc3 || 0;
      calculationResult.totalAbsolutePnc3 += report?.aggregatedData?.kumulatifPnc3 / totalReportObjectives.postNatalTarget || 0;
      calculationResult.totalPnc4 += report?.aggregatedData?.pnc4 || 0;
      calculationResult.totalPreviousMonthPnc4 += report?.aggregatedData?.previousMonthPnc4 || 0;
      calculationResult.totalKumulatifPnc4 += report?.aggregatedData?.kumulatifPnc4 || 0;
      calculationResult.totalAbsolutePnc4 += report?.aggregatedData?.kumulatifPnc4 / totalReportObjectives.postNatalTarget || 0;
    });

    return calculationResult;
  }
}

module.exports = CalculatePwsReportUseCase;
