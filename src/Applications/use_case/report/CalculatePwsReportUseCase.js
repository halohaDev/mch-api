class CalculatePwsReportUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(useCasePayload) {
    const { month, year } = useCasePayload;

    const reports = await this._reportRepository.showReport({ month, year, reportType: "jorong_monthly", status: "approved" });

    const pwsIbu = this.#calculatePwsIbu(reports);

    await this._reportRepository.addReport({
      reportType: "pws_ibu",
      data: pwsIbu,
      month,
      year,
    });
  }

  #calculatePwsIbu(reports) {
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

    reports.forEach((report) => {
      calculationResult.totalC1 += report?.totalC1 || 0;
      calculationResult.totalPreviousMonthC1 += report?.totalPreviousMonthC1 || 0;
      calculationResult.totalKumulatifC1 += report?.totalKumulatifC1 || 0;
      calculationResult.totalAbsoluteC1 += report?.totalAbsoluteC1 || 0;
      calculationResult.totalC4 += report?.totalC4 || 0;
      calculationResult.totalPreviousMonthC4 += report?.totalPreviousMonthC4 || 0;
      calculationResult.totalKumulatifC4 += report?.totalKumulatifC4 || 0;
      calculationResult.totalAbsoluteC4 += report?.totalAbsoluteC4 || 0;
      calculationResult.totalC6 += report?.totalC6 || 0;
      calculationResult.totalPreviousMonthC6 += report?.totalPreviousMonthC6 || 0;
      calculationResult.totalKumulatifC6 += report?.totalKumulatifC6 || 0;
      calculationResult.totalAbsoluteC6 += report?.totalAbsoluteC6 || 0;
      calculationResult.totalRisk += report?.totalRisk || 0;
      calculationResult.totalPreviousMonthRisk += report?.totalPreviousMonthRisk || 0;
      calculationResult.totalKumulatifRisk += report?.totalKumulatifRisk || 0;
      calculationResult.totalAbsoluteRisk += report?.totalAbsoluteRisk || 0;
      calculationResult.totalHighRisk += report?.totalHighRisk || 0;
      calculationResult.totalPreviousMonthHighRisk += report?.totalPreviousMonthHighRisk || 0;
      calculationResult.totalKumulatifHighRisk += report?.totalKumulatifHighRisk || 0;
      calculationResult.totalAbsoluteHighRisk += report?.totalAbsoluteHighRisk || 0;
      calculationResult.totalDelivery += report?.totalDelivery || 0;
      calculationResult.totalPreviousMonthDelivery += report?.totalPreviousMonthDelivery || 0;
      calculationResult.totalKumulatifDelivery += report?.totalKumulatifDelivery || 0;
      calculationResult.totalAbsoluteDelivery += report?.totalAbsoluteDelivery || 0;
      calculationResult.totalDeliveryComplication += report?.totalDeliveryComplication || 0;
      calculationResult.totalPreviousMonthDeliveryComplication += report?.totalPreviousMonthDeliveryComplication || 0;
      calculationResult.totalKumulatifDeliveryComplication += report?.totalKumulatifDeliveryComplication || 0;
      calculationResult.totalAbsoluteDeliveryComplication += report?.totalAbsoluteDeliveryComplication || 0;
      calculationResult.totalPnc1 += report?.totalPnc1 || 0;
      calculationResult.totalPreviousMonthPnc1 += report?.totalPreviousMonthPnc1 || 0;
      calculationResult.totalKumulatifPnc1 += report?.totalKumulatifPnc1 || 0;
      calculationResult.totalAbsolutePnc1 += report?.totalAbsolutePnc1 || 0;
      calculationResult.totalPnc2 += report?.totalPnc2 || 0;
      calculationResult.totalPreviousMonthPnc2 += report?.totalPreviousMonthPnc2 || 0;
      calculationResult.totalKumulatifPnc2 += report?.totalKumulatifPnc2 || 0;
      calculationResult.totalAbsolutePnc2 += report?.totalAbsolutePnc2 || 0;
      calculationResult.totalPnc3 += report?.totalPnc3 || 0;
      calculationResult.totalPreviousMonthPnc3 += report?.totalPreviousMonthPnc3 || 0;
      calculationResult.totalKumulatifPnc3 += report?.totalKumulatifPnc3 || 0;
      calculationResult.totalAbsolutePnc3 += report?.totalAbsolutePnc3 || 0;
      calculationResult.totalPnc4 += report?.totalPnc4 || 0;
      calculationResult.totalPreviousMonthPnc4 += report?.totalPreviousMonthPnc4 || 0;
      calculationResult.totalKumulatifPnc4 += report?.totalKumulatifPnc4 || 0;
      calculationResult.totalAbsolutePnc4 += report?.totalAbsolutePnc4 || 0;
    });
  }
}

module.exports = CalculatePwsReportUseCase;
