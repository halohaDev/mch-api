const PlacementRepository = require("../../Domains/placements/PlacementRepository");
const showedPlacement = require("../../Domains/placements/entities/ShowedPlacement");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const PlacementQuery = require("../queries/PlacementQuery");

class PlacementRepositoryPostgres extends PlacementRepository {
  constructor(pool, snakeToCamelObject) {
    super();
    this._pool = pool;
    this._snakeToCamelObject = snakeToCamelObject;
    this._placementQuery = new PlacementQuery({ pool });
  }

  async addPlacement({ midwifeId, jorongId, placementDate }) {
    const query = {
      text: "INSERT INTO placements(midwife_id, jorong_id, placement_date) VALUES($1, $2, $3) RETURNING midwife_id, jorong_id, placement_date",
      values: [midwifeId, jorongId, placementDate],
    };

    const { rows } = await this._pool.query(query);
    return rows[0];
  }

  async findPlacementByIds(midwifeId, jorongId) {
    const query = {
      text: "SELECT midwife_id, jorong_id FROM placements WHERE midwife_id = $1 AND jorong_id = $2",
      values: [midwifeId, jorongId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError("placement tidak ditemukan");
    }

    return rows[0];
  }

  async getPlacementByMidwifeId(userIds) {
    // convert to array
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }

    const query = {
      text: `SELECT  p.jorong_id, p.midwife_id, j.name AS jorong_name, p.placement_date, n.name AS nagari_name
        FROM placements p 
        LEFT JOIN jorong j ON j.id = p.jorong_id 
        LEFT JOIN nagari n ON n.id = j.nagari_id 
        WHERE p.midwife_id = ANY($1)`,
      values: [userIds],
    };

    const { rows } = await this._pool.query(query);

    const modifiedRows = this._snakeToCamelObject(rows);
    return modifiedRows.map((row) => new showedPlacement(row));
  }

  async getAllPlacements({ queryParams }) {
    const result = this._placementQuery.wheres(queryParams).paginate();
    result.data = this._snakeToCamelObject(result.data);

    return result;
  }
}

module.exports = PlacementRepositoryPostgres;
