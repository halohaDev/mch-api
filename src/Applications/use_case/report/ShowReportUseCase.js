class ShowReportUseCase {
  constructor({ reportRepository, jorongRepository, userRepository }) {
    this._reportRepository = reportRepository;
    this._jorongRepository = jorongRepository;
    this._userRepository = userRepository;
  }

  async execute(queryParams) {
    const result = await this._reportRepository.showReport(queryParams);

    const jorongIds = result?.data?.map((report) => report.jorongId);
    const requesterIds = result?.data?.map((report) => report.requestedBy);
    const approverIds = result?.data?.map((report) => report.approvedBy);
    const userIds = [...new Set([...requesterIds, ...approverIds])];

    const jorongs = await this._jorongRepository.getJorongsByIds(jorongIds);
    const users = await this._userRepository.getUsersByIds(userIds);
    const reportObjectives = (await this._reportRepository.getReportObjectiveByYear(queryParams.year)) || [];

    result.data = result.data.map((report) => {
      const jorong = jorongs.find((jorong) => jorong.id === report.jorongId) || { id: 0, name: "Puskesmas" };
      const requestedby = users.find((user) => user.id === report.requestedBy);
      const approvedBy = users.find((user) => user.id === report.approvedBy);
      const reportObjective = reportObjectives.find((reportObjective) => reportObjective.jorongId === report.jorongId) || {};

      const {
        anteNatalTarget,
        postNatalTarget,
        deliveryTarget,
        anteNatalHighRiskTarget,
        babyTarget,
        balitaTarget,
        neoRestiTarget,
        deliveredBabyAliveTarget,
        praSekolahTarget,
      } = reportObjective;

      return {
        ...report,
        jorong,
        requestedBy: requestedby,
        approvedBy: approvedBy,
        anteNatalTarget,
        postNatalTarget,
        deliveryTarget,
        anteNatalHighRiskTarget,
        babyTarget,
        balitaTarget,
        neoRestiTarget,
        deliveredBabyAliveTarget,
        praSekolahTarget,
      };
    });

    return result;
  }
}

module.exports = ShowReportUseCase;
