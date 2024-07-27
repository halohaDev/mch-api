class ShowReportByIdUseCase {
  constructor({ reportRepository, userRepository, jorongRepository }) {
    this._reportRepository = reportRepository;
    this._userRepository = userRepository;
    this._jorongRepository = jorongRepository;
  }

  async execute(id) {
    const report = await this._reportRepository.findReportById(id);

    const requestedBy = await this._userRepository.getUserById(report.requestedBy);
    const jorong = await this._jorongRepository.getJorongById(report.jorongId);

    if (report.approvedBy) {
      const approvedBy = await this._userRepository.getUserById(report.approvedBy);
    }

    return {
      ...report,
      requestedBy: {
        id: requestedBy.id,
        name: requestedBy.name,
      },
      jorong: {
        id: jorong.id,
        name: jorong.name,
      },
      approvedBy: report.approvedBy
        ? {
            id: approvedBy.id,
            name: approvedBy.name,
          }
        : null,
    };
  }
}

module.exports = ShowReportByIdUseCase;
