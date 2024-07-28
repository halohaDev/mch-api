const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const ChildCareTableTestHelper = require("../../../../tests/ChildCaresTableTestHelper");
const ChildrenTableTestHelper = require("../../../../tests/ChildrenTableTestHelper");
const JorongTableTestHelper = require("../../../../tests/JorongTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const MaternalTableTestHelper = require("../../../../tests/MaternalTableTestHelper");
const { authenticateUser } = require("../../../../tests/AuthTestHelper");

describe("HTTP server - childs", () => {
  let token;

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ChildCareTableTestHelper.cleanTable();
    await ChildrenTableTestHelper.cleanTable();
    await JorongTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await MaternalTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    token = await authenticateUser("user-123", "midwife");

    await UsersTableTestHelper.addUser({ id: "midwife-123" });
    await JorongTableTestHelper.addJorong({ id: "jorong-123" });
    await UsersTableTestHelper.addUser({ id: "mother-123" });
    await MaternalTableTestHelper.addMaternal({ id: "maternal-123", userId: "mother-123" });
    await ChildrenTableTestHelper.addChild({ id: "child-123" });
  });

  describe("when GET /childs", () => {
    it("should response 200 and return child list", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/v1/childs",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data).toHaveLength(1);
    });
  });
});
