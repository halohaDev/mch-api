class ShowReportUseCase {
  constructor({ reportRepository, jorongRepository, userRepository }) {
    this._reportRepository = reportRepository;
    this._jorongRepository = jorongRepository;
    this._userRepository = userRepository;
  }

  async execute(queryParams) {
    const result = await this._reportRepository.showReport(queryParams);

    const jorongIds = result?.data?.map((report) => report.jorongId);
    const userIds = result?.data?.map((report) => report.requestedBy);

    const jorongs = await this._jorongRepository.getJorongsByIds(jorongIds);
    const users = await this._userRepository.getUsersByIds(userIds);

    result.data = result.data.map((report) => {
      const jorong = jorongs.find((jorong) => jorong.id === report.jorongId);
      const user = users.find((user) => user.id === report.requestedBy);

      return {
        ...report,
        jorong,
        requestedBy: user,
      };
    });

    return result;
  }
}

module.exports = ShowReportUseCase;
