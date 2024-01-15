const ReportRepository = require("../ReportRepository");

describe("ReportRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const reportRepository = new ReportRepository();

    await expect(reportRepository.addReport({})).rejects.toThrowError(
      "REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(reportRepository.findReportById("")).rejects.toThrowError(
      "REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(reportRepository.showReport("")).rejects.toThrowError(
      "REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(reportRepository.updateReport("")).rejects.toThrowError(
      "REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
