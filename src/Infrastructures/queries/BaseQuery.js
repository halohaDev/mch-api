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
      joins: "",
      currentIndex: 0,
    };

    this.paginationMeta = {
      size: 0,
      perPage: 0,
      currentPage: 0,
      totalPages: 0,
    };

    this.finalSQL = "";

    this._perPage = 100;
    this._page = 1;
  }

  async paginate({ page = this._page, perPage = this._perPage } = {}) {
    const limit = parseInt(perPage);
    const offset = (parseInt(page) - 1) * perPage;

    this.paginationMeta.currentPage = page;
    this.paginationMeta.perPage = perPage;

    this.fetchTotalData();

    const sql = `LIMIT ${limit} OFFSET ${offset}`;
    this._finalObject.paginate = sql;

    this.finalizeSQL();

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

  wheres(params) {
    let whereSQL = [];
    let values = [];

    if (!params || typeof params !== "object") {
      return this;
    }

    Object.keys(params).forEach((param) => {
      this._finalObject.currentIndex += 1;
      const methodName = `getBy${
        param.charAt(0).toUpperCase() + param.slice(1)
      }`;

      if (typeof this[methodName] !== "function") {
        return;
      }

      const result = this[methodName](params[param]);

      if (param === "page" || param === "perPage") {
        return;
      }

      const [query, value] = result;
      const paramizeQuery = query.replace(
        /\?/g,
        `$${this._finalObject.currentIndex}`
      );

      whereSQL.push(paramizeQuery);
      values.push(value);
    });

    if (whereSQL.length === 0) {
      return this;
    }

    const sql = " WHERE " + whereSQL.join(" AND ").replace(/AND\s*$/, "");

    this._finalObject.where = sql;
    this._finalObject.values = values;

    this.finalizeSQL();

    return this;
  }

  joins(params) {
    if (params) {
      if (!Array.isArray(params)) {
        params = [params];
      }

      params.forEach((param) => {
        const key = param.charAt(0).toUpperCase() + param.slice(1);
        const query = this[`joinBy${key}`]();

        this._finalObject.joins += ` ${query} `;
      });
    }

    this.finalizeSQL();

    return this;
  }

  selects(params) {
    if (params.length > 0) {
      const selectedColumns = [];

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
    const sql = `SELECT ${this._finalObject.select} FROM ${this.tableName} ${this._finalObject.joins} ${this._finalObject.where} ${this._finalObject.paginate}`;

    this.finalSQL = sql.replace(/\s+/g, " ").trim();
  }

  getByPerPage(perPage) {
    this._perPage = parseInt(perPage);
  }

  getByPage(page) {
    this._page = parseInt(page);
  }
}

module.exports = BaseQuery;
