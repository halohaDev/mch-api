const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const UpdateStatusReport = require("../../../Domains/report/entities/UpdateStatusReport");

class UpdateReportStatusUseCase {
  constructor({ reportRepository }) {
    this._reportRepository = reportRepository;
  }

  async execute(id, payload, userRole) {
    const updateStatusReport = new UpdateStatusReport(payload);

    const report = await this._reportRepository.findReportById(id);

    if (userRole === "midwife") this.#verifyMidwifePermission({ ...updateStatusReport });
    if (userRole === "coordinator") this.#verifyCoordinatorPermission({ status: updateStatusReport.status, reportType: report.reportType });

    const newPayload = {
      id,
      ...updateStatusReport,
    };

    await this._reportRepository.updateReportStatusAndNote(newPayload);
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
