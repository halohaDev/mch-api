const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const UpdateStatusReport = require("../../../Domains/report/entities/UpdateStatusReport");

class UpdateReportStatusUseCase {
  constructor({ reportRepository, calculatePwsReportUseCase }) {
    this._reportRepository = reportRepository;
    this._calculatePwsReportUseCase = calculatePwsReportUseCase;
  }

  async execute(id, payload, userRole, userId) {
    const updateStatusReport = new UpdateStatusReport(payload);

    const report = await this._reportRepository.findReportById(id);

    if (userRole === "midwife") this.#verifyMidwifePermission({ ...updateStatusReport });
    if (userRole === "coordinator") this.#verifyCoordinatorPermission({ status: updateStatusReport.status, reportType: report.reportType });

    const newPayload = {
      id,
      ...updateStatusReport,
    };

    let result = null;
    if (updateStatusReport.status === "approved") {
      newPayload.approvedAt = new Date().toISOString();
      newPayload.approvedBy = userId;

      result = await this._reportRepository.approveReport(newPayload);
    } else if (updateStatusReport.status === "revision") {
      newPayload.approvedAt = null;

      result = await this._reportRepository.reviseReport(newPayload);
    } else {
      result = await this._reportRepository.updateReportStatusAndNote(newPayload);
    }

    if (updateStatusReport.status === "approved" && report.reportType === "jorong_monthly") {
      await this._calculatePwsReportUseCase.execute({
        month: report.month,
        year: report.year,
        requestedBy: userId,
      });
    }

    return result;
  }

  #verifyMidwifePermission({ status }) {
    if (status === "approved") {
      throw new AuthorizationError("Anda tidak bisa menyetujui laporan");
    }

    if (status === "revision") {
      throw new AuthorizationError("Anda tidak bisa meminta revisi laporan");
    }
  }

  #verifyCoordinatorPermission({ status, reportType }) {
    if (status === "approved" && (reportType === "pws_ibu" || reportType === "pws_anak")) {
      throw new AuthorizationError("Anda tidak bisa menyetujui laporan PWS");
    }

    if (status === "revision" && (reportType === "pws_ibu" || reportType === "pws_anak")) {
      throw new AuthorizationError("Anda tidak bisa meminta revisi laporan PWS");
    }
  }
}

module.exports = UpdateReportStatusUseCase;
