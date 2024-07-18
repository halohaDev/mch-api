const ReportRepository = require("../ReportRepository");

describe("ReportRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const reportRepository = new ReportRepository();

    await expect(reportRepository.addReport({})).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(reportRepository.findReportById("")).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(reportRepository.showReport("")).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(reportRepository.updateReportStatusAndNote("")).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(reportRepository.calculateAnteNatalCareJorongMonthlyReport({})).rejects.toThrowError(
      "REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(reportRepository.calculateAnteNatalCarePuskesmasMonthlyReport({})).rejects.toThrowError(
      "REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(reportRepository.calculateLbJorongMonthlyReport({})).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(reportRepository.calculateLbPuskesmasMonthlyReport({})).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(reportRepository.calculateMonthlyJorongRecap("")).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(reportRepository.calculateMonthlyPuskesmasRecap("")).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(reportRepository.getAnteNatalAggregateReport("", "", "")).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(reportRepository.getPostNatalAggregateReport("", "", "")).rejects.toThrowError("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(reportRepository.getMaternalComplicationAggregateReport("", "", "")).rejects.toThrowError(
      "REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(reportRepository.getRiskFactorAggregateReport("", "", "")).rejects.toThrowError(
      "REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
