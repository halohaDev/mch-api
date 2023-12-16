class BaseQuery {
  constructor({ pool }) {
    this._pool = pool;
    this.tableName = this.constructor.name.toLowerCase() + "s";
    this._finalObject = {
      select: "*",
      where: "",
      values: [],
      paginate: "",
    };

    this.paginationMeta = {
      size: 0,
      perPage: 0,
      currentPage: 0,
      totalPages: 0,
    };

    this.finalSQL = "";
    this.joinsSQL = "";
    this.whereSQL = [];
    this.values = [];
  }

  wheres(params) {
    if (params) {
      params.forEach((param) => {
        const key =
          Object.keys(param)[0].charAt(0).toUpperCase() +
          Object.keys(param)[0].slice(1);
        const value = Object.values(param)[0];
        const currentResult = this[`getBy${key}`](value);

        this.whereSQL.push(currentResult[0]);
        this.values.push(currentResult[1]);
      });

      const sql =
        " WHERE " + this.whereSQL.join(" AND ").replace(/AND\s*$/, "");
      this._finalObject.where = sql;
      this._finalObject.values = this.values;

      this.finalizeSQL();

      return this;
    }
  }

  joins(params) {
    if (params) {
      if (!Array.isArray(params)) {
        params = [params];
      }

      params.forEach((param) => {
        const key = param.charAt(0).toUpperCase() + param.slice(1);
        this.joinsSQL += this[`joinBy${key}`]();
      });
    }

    this.finalizeSQL();

    return this;
  }

  selects(params) {
    if (params.length > 0) {
      selectedColumns = [];

      params.forEach((param) => {
        selectedColumns.push(param);
      });

      this._finalObject.select = selectedColumns
        .join(", ")
        .replace(/,\s*$/, "");
    }

    this.finalizeSQL();

    return this;
  }

  async paginate({ page = 1, perPage = 100 } = {}) {
    const limit = perPage;
    const offset = (page - 1) * perPage;

    this.paginationMeta.currentPage = page;
    this.paginationMeta.perPage = perPage;

    this.fetchTotalData();

    const sql = ` LIMIT ${limit} OFFSET ${offset}`;
    this._finalObject.paginate = sql;

    await this.finalizeSQL();

    const query = {
      text: this.finalSQL,
      values: this._finalObject.values,
    };

    const results = this._pool.query(query);

    return {
      data: results.rows,
      meta: this.paginationMeta,
    };
  }

  fetchTotalData = async () => {
    sql = `SELECT COUNT(*) FROM ${this.tableName} ${this.joinsSQL} ${this._finalObject.where}`;

    const query = {
      text: sql,
      values: this._finalObject.values,
    };

    const results = this._pool.query(query);
    const totalData = results.rows[0].count;

    this.paginationMeta.totalPages = Math.ceil(
      totalData / this.paginationMeta.perPage
    );

    return this;
  };

  finalizeSQL() {
    this.finalSQL = `SELECT ${this._finalObject.select} FROM ${this.tableName} ${this.joinsSQL} ${this._finalObject.where} ${this._finalObject.paginate}`;
  }
}

export default BaseClass;
