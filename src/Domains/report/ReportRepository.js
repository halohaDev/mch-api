class ReportRepository {
  async addReport() {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async findReportById() {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async showReport() {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async updateReportStatusAndNote() {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async calculateMonthlyJorongRecap(jorongId) {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getAnteNatalAggregateReport(jorongId, start, end) {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getPostNatalAggregateReport(jorongId, start, end) {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getMaternalComplicationAggregateReport(jorongId, start, end) {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getRiskFactorAggregateReport(jorongId, start, end) {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getDeliveryAggregateReport(jorongId, start, end) {
    throw new Error("REPORT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReportRepository;
