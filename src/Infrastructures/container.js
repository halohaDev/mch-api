/* istanbul ignore file */

const { createContainer } = require("instances-container");

// external
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const jwt = require("@hapi/jwt");
const pool = require("./database/postgres/pool");
const moment = require("moment");

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

// external
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const JsonWebToken = require("./security/JsonWebToken");

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

const container = createContainer();

container.register([
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
      ],
    },
  },
]);

// use case
container.register([
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
      ],
    },
  },
]);

module.exports = container;
