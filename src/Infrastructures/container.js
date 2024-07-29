/* istanbul ignore file */

const { createContainer } = require("instances-container");

// external
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const jwt = require("@hapi/jwt");
const pool = require("./database/postgres/pool");
const moment = require("moment-timezone");

// service
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const AuthRepositoryPostgres = require("./repository/AuthRepositoryPostgres");
const NagariRepositoryPostgres = require("./repository/NagariRepositoryPostgres");
const JorongRepositoryPostgres = require("./repository/JorongRepositoryPostgres");
const PlacementRepositoryPostgres = require("./repository/PlacementRepositoryPostgres");
const MaternalRepositoryPostgres = require("./repository/MaternalRepositoryPostgres");
const AnteNatalCareRepositoryPostgres = require("./repository/AnteNatalCareRepositoryPostgres");
const MaternalHistoryRepositoryPostgres = require("./repository/MaternalHistoryRepositoryPostgres");
const ReportRepositoryPostgres = require("./repository/ReportRepositoryPostgres");
const MaternalServiceRepositoryPostgres = require("./repository/MaternalServiceRepositoryPostgres");
const PostNatalCareRepositoryPostgres = require("./repository/PostNatalCareRepositoryPostgres");
const ChildRepositoryPostgres = require("./repository/ChildRepositoryPostgres");
const MaternalComplicationRepositoryPostgres = require("./repository/MaternalComplicationRepositoryPostgres");
const ChildCareRepositoryPostgres = require("./repository/ChildCareRepositoryPostgres");
const Moment = require("./utils/Moment");

// external
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const JsonWebToken = require("./security/JsonWebToken");

// helper
const { snakeToCamelObject } = require("../Commons/helper");

// interface
const UserRepository = require("../Domains/users/UserRepository");
const AuthRepository = require("../Domains/auth/AuthRepository");
const NagariRepository = require("../Domains/nagari/NagariRepository");
const JorongRepository = require("../Domains/jorong/JorongRepository");
const PlacementRepository = require("../Domains/placements/PlacementRepository");
const MaternalRepository = require("../Domains/maternal/MaternalRepository");
const AnteNatalCareRepository = require("../Domains/ante_natal/AnteNatalCareRepository");
const MaternalHistoryRepository = require("../Domains/maternal/MaternalHistoryRepository");
const ReportRepository = require("../Domains/report/ReportRepository");
const MaternalServiceRepository = require("../Domains/maternal/MaternalServiceRepository");
const PostNatalCareRepository = require("../Domains/post_natal/PostNatalCareRepository");
const ChildRepository = require("../Domains/child/ChildRepository");
const MaternalComplicationRepository = require("../Domains/complication/MaternalComplicationRepository");
const ChildCareRepository = require("../Domains/child_care/ChildCareRepository");

// user case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const PasswordHash = require("../Applications/security/PasswordHash");
const AuthTokenManager = require("../Applications/security/AuthTokenManager");
const AuthUseCase = require("../Applications/use_case/AuthUseCase");
const NagariUseCase = require("../Applications/use_case/NagariUseCase");
const JorongUseCase = require("../Applications/use_case/JorongUseCase");
const PlacementUseCase = require("../Applications/use_case/PlacementUseCase");
const ShowAllUserUseCase = require("../Applications/use_case/ShowAllUserUseCase");
const MaternalUseCase = require("../Applications/use_case/MaternalUseCase");
const AddAnteNatalCareUseCase = require("../Applications/use_case/ante_natal/AddAnteNatalCareUseCase");
const ShowAnteNatalCareUseCase = require("../Applications/use_case/ante_natal/ShowAnteNatalCareUseCase");
const CalculateAncMonthlyJorongReportUseCase = require("../Applications/use_case/report/CalculateAncMonthlyJorongReportUseCase");
const ShowReportUseCase = require("../Applications/use_case/report/ShowReportUseCase");
const AddReportUseCase = require("../Applications/use_case/report/AddReportUseCase");
const CalculateAncMonthlyPuskesmasReportUseCase = require("../Applications/use_case/report/CalculateAncMonthlyPuskesmasReportUseCase");
const UpdateReportStatusUseCase = require("../Applications/use_case/report/UpdateReportStatusUseCase");
const UpdateUserUseCase = require("../Applications/use_case/UpdateUserUseCase");
const DatabaseManager = require("../Applications/DatabaseManager");
const PostgreManager = require("./database/postgres/PostgreManager");
const MaternalServiceUseCase = require("../Applications/use_case/MaternalServiceUseCase");
const AddPostNatalCareUseCase = require("../Applications/use_case/post_natal/AddPostNatalCareUseCase");
const AddMaternalComplicationUseCase = require("../Applications/use_case/AddMaternalComplicationUseCase");
const MaternalHistoryUseCase = require("../Applications/use_case/MaternalHistoryUseCase");
const DateHelper = require("../Applications/utils/DateHelper");
const CalculateMonthlyJorongReport = require("../Applications/use_case/report/CalculateMonthlyJorongReport");
const CalculateAllRecapJorongUseCase = require("../Applications/use_case/report/CalculateAllRecapJorongUseCase");
const ShowReportByIdUseCase = require("../Applications/use_case/report/ShowReportByIdUseCase");
const CalculatePwsReportUseCase = require("../Applications/use_case/report/CalculatePwsReportUseCase");
const ChildCareUseCase = require("../Applications/use_case/ChildCareUseCase");
const ChildUseCase = require("../Applications/use_case/ChildUseCase");

const container = createContainer();

// repository
container.register([
  {
    key: PostNatalCareRepository.name,
    Class: PostNatalCareRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },
  {
    key: MaternalServiceRepository.name,
    Class: MaternalServiceRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },
  {
    key: DatabaseManager.name,
    Class: PostgreManager,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: ReportRepository.name,
    Class: ReportRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },

  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },

  {
    key: AuthRepository.name,
    Class: AuthRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },

  {
    key: AuthTokenManager.name,
    Class: JsonWebToken,
    parameter: {
      dependencies: [
        {
          concrete: jwt.token,
        },
      ],
    },
  },
  {
    key: NagariRepository.name,
    Class: NagariRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: JorongRepository.name,
    Class: JorongRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PlacementRepository.name,
    Class: PlacementRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },
  {
    key: MaternalRepository.name,
    Class: MaternalRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },
  {
    key: AnteNatalCareRepository.name,
    Class: AnteNatalCareRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: moment,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },
  {
    key: MaternalHistoryRepository.name,
    Class: MaternalHistoryRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },

  {
    key: ChildRepository.name,
    Class: ChildRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },

  {
    key: MaternalComplicationRepository.name,
    Class: MaternalComplicationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },

  {
    key: DateHelper.name,
    Class: Moment,
    parameter: {
      dependencies: [
        {
          concrete: moment,
        },
      ],
    },
  },

  {
    key: ChildCareRepository.name,
    Class: ChildCareRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: snakeToCamelObject,
        },
      ],
    },
  },
]);

// use case
container.register([
  {
    key: ShowReportByIdUseCase.name,
    Class: ShowReportByIdUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "jorongRepository",
          internal: JorongRepository.name,
        },
      ],
    },
  },
  {
    key: MaternalHistoryUseCase.name,
    Class: MaternalHistoryUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "maternalHistoryRepository",
          internal: MaternalHistoryRepository.name,
        },
        {
          name: "maternalRepository",
          internal: MaternalRepository.name,
        },
      ],
    },
  },
  // Maternal Service Use Case
  {
    key: MaternalServiceUseCase.name,
    Class: MaternalServiceUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "maternalHistoryRepository",
          internal: MaternalHistoryRepository.name,
        },
        {
          name: "maternalServiceRepository",
          internal: MaternalServiceRepository.name,
        },
        {
          name: "databaseManager",
          internal: DatabaseManager.name,
        },
        {
          name: "maternalRepository",
          internal: MaternalRepository.name,
        },
        {
          name: "childRepository",
          internal: ChildRepository.name,
        },
      ],
    },
  },
  {
    key: UpdateUserUseCase.name,
    Class: UpdateUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
      ],
    },
  },
  {
    key: UpdateReportStatusUseCase.name,
    Class: UpdateReportStatusUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
        {
          name: "calculatePwsReportUseCase",
          internal: CalculatePwsReportUseCase.name,
        },
      ],
    },
  },
  {
    key: CalculateAncMonthlyPuskesmasReportUseCase.name,
    Class: CalculateAncMonthlyPuskesmasReportUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
      ],
    },
  },
  {
    key: AddReportUseCase.name,
    Class: AddReportUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
      ],
    },
  },
  {
    key: ShowReportUseCase.name,
    Class: ShowReportUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
        {
          name: "jorongRepository",
          internal: JorongRepository.name,
        },
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
      ],
    },
  },
  {
    key: CalculateAncMonthlyJorongReportUseCase.name,
    Class: CalculateAncMonthlyJorongReportUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
      ],
    },
  },
  {
    key: ShowAnteNatalCareUseCase.name,
    Class: ShowAnteNatalCareUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "anteNatalCareRepository",
          internal: AnteNatalCareRepository.name,
        },
      ],
    },
  },
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },

  {
    key: AuthUseCase.name,
    Class: AuthUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authRepository",
          internal: AuthRepository.name,
        },
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
        {
          name: "tokenManager",
          internal: AuthTokenManager.name,
        },
        {
          name: "placementRepository",
          internal: PlacementRepository.name,
        },
      ],
    },
  },

  {
    key: NagariUseCase.name,
    Class: NagariUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "nagariRepository",
          internal: NagariRepository.name,
        },
      ],
    },
  },
  {
    key: JorongUseCase.name,
    Class: JorongUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "jorongRepository",
          internal: JorongRepository.name,
        },
        {
          name: "nagariRepository",
          internal: NagariRepository.name,
        },
      ],
    },
  },
  {
    key: PlacementUseCase.name,
    Class: PlacementUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "placementRepository",
          internal: PlacementRepository.name,
        },
        {
          name: "jorongRepository",
          internal: JorongRepository.name,
        },
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
      ],
    },
  },
  {
    key: ShowAllUserUseCase.name,
    Class: ShowAllUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "placementRepository",
          internal: PlacementRepository.name,
        },
      ],
    },
  },
  {
    key: MaternalUseCase.name,
    Class: MaternalUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "maternalRepository",
          internal: MaternalRepository.name,
        },
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "randomGenerator",
          concrete: nanoid,
        },
        {
          name: "databaseManager",
          internal: DatabaseManager.name,
        },
      ],
    },
  },
  {
    key: AddAnteNatalCareUseCase.name,
    Class: AddAnteNatalCareUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "anteNatalCareRepository",
          internal: AnteNatalCareRepository.name,
        },
        {
          name: "maternalHistoryRepository",
          internal: MaternalHistoryRepository.name,
        },
        {
          name: "databaseManager",
          internal: DatabaseManager.name,
        },
        {
          name: "maternalRepository",
          internal: MaternalRepository.name,
        },
        {
          name: "childRepository",
          internal: ChildRepository.name,
        },
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "dateHelper",
          internal: DateHelper.name,
        },
      ],
    },
  },
  // AddPostNatalCareUseCase
  {
    key: AddPostNatalCareUseCase.name,
    Class: AddPostNatalCareUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "postNatalCareRepository",
          internal: PostNatalCareRepository.name,
        },
        {
          name: "maternalHistoryRepository",
          internal: MaternalHistoryRepository.name,
        },
        {
          name: "jorongRepository",
          internal: JorongRepository.name,
        },
      ],
    },
  },
  {
    key: AddMaternalComplicationUseCase.name,
    Class: AddMaternalComplicationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "maternalComplicationRepository",
          internal: MaternalComplicationRepository.name,
        },
        {
          name: "maternalHistoryRepository",
          internal: MaternalHistoryRepository.name,
        },
      ],
    },
  },
  {
    key: CalculateMonthlyJorongReport.name,
    Class: CalculateMonthlyJorongReport,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "jorongRepository",
          internal: JorongRepository.name,
        },
        {
          name: "anteNatalCareRepository",
          internal: AnteNatalCareRepository.name,
        },
        {
          name: "postNatalCareRepository",
          internal: PostNatalCareRepository.name,
        },
        {
          name: "maternalComplicationRepository",
          internal: MaternalComplicationRepository.name,
        },
        {
          name: "maternalHistoryRepository",
          internal: MaternalHistoryRepository.name,
        },
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
        {
          name: "dateHelper",
          internal: DateHelper.name,
        },
      ],
    },
  },
  {
    key: CalculateAllRecapJorongUseCase.name,
    Class: CalculateAllRecapJorongUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "placementRepository",
          internal: PlacementRepository.name,
        },
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
        {
          name: "calculateMonthlyJorongReport",
          internal: CalculateMonthlyJorongReport.name,
        },
        {
          name: "dateHelper",
          internal: DateHelper.name,
        },
      ],
    },
  },
  {
    key: CalculatePwsReportUseCase.name,
    Class: CalculatePwsReportUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "reportRepository",
          internal: ReportRepository.name,
        },
      ],
    },
  },

  {
    key: ChildCareUseCase.name,
    Class: ChildCareUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "childCareRepository",
          internal: ChildCareRepository.name,
        },
        {
          name: "childRepository",
          internal: ChildRepository.name,
        },
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "jorongRepository",
          internal: JorongRepository.name,
        },
      ],
    },
  },

  {
    key: ChildUseCase.name,
    Class: ChildUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "childRepository",
          internal: ChildRepository.name,
        },
        {
          name: "maternalRepository",
          internal: MaternalRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
