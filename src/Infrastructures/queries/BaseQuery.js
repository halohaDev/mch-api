class BaseQuery {
  constructor({ pool }) {
    this._pool = pool;
    this.tableName =
      this.constructor.name.replace(/Query$/, "").toLowerCase() + "s";
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
  }

  wheres(params) {
    const whereSQL = [];
    const values = [];

    if (params) {
      // get each value from params
      Object.keys(params).forEach((param) => {
        // get the query and the value
        const [query, value] = this[
          `getBy${param.charAt(0).toUpperCase() + param.slice(1)}`
        ](params[param]);

        // push the query to whereSQL
        whereSQL.push(query);

        // push the value to values
        values.push(value);
      });

      const sql = " WHERE " + whereSQL.join(" AND ").replace(/AND\s*$/, "");
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

    const results = await this._pool.query(query);

    return {
      data: results.rows,
      meta: this.paginationMeta,
    };
  }

  async fetchTotalData() {
    const sql = `SELECT COUNT(*) FROM ${this.tableName} ${this.joinsSQL} ${this._finalObject.where}`;

    const query = {
      text: sql,
      values: this._finalObject.values,
    };

    const results = await this._pool.query(query);
    const totalData = parseInt(results.rows[0].count);

    this.paginationMeta.totalPages = Math.ceil(
      totalData / this.paginationMeta.perPage
    );

    this.paginationMeta.size = totalData;

    return this;
  }

  finalizeSQL() {
    this.finalSQL = `SELECT ${this._finalObject.select} FROM ${this.tableName} ${this.joinsSQL} ${this._finalObject.where} ${this._finalObject.paginate}`;
  }
}

module.exports = BaseQuery;
