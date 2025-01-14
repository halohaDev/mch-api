class BaseQuery {
  constructor({ pool }) {
    this._pool = pool;
    this.tableName = this.constructor.name.replace(/Query$/, "").toLowerCase() + "s";
    this._finalObject = {
      select: "*",
      where: "",
      values: [],
      paginate: "",
      joins: "",
      order: "",
      currentIndex: 0,
    };

    this.paginationMeta = {
      size: 0,
      perPage: 0,
      currentPage: 0,
      totalPages: 0,
    };

    this.finalSQL = "";

    this._sortDirection = "ASC";
    this._sortColumn = "created_at";
    this._perPage = 100;
    this._page = 1;
  }

  async paginate({ page = this._page, perPage = this._perPage } = {}) {
    const limit = parseInt(perPage);
    const offset = (parseInt(page) - 1) * perPage;
    this.paginationMeta.currentPage = page;
    this.paginationMeta.perPage = perPage;

    await this.fetchTotalData();

    const sql = `LIMIT ${limit} OFFSET ${offset}`;
    this._finalObject.paginate = sql;

    this.finalizeSQL();

    const values = this._finalObject.values;

    this._finalObject = {
      select: "*",
      where: "",
      values: [],
      paginate: "",
      joins: "",
      order: "",
      currentIndex: 0,
    };

    const query = {
      text: this.finalSQL,
      values: values,
    };

    const results = await this._pool.query(query);

    this._page = 1;
    this._perPage = 100;

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
      const methodName = `getBy${param.charAt(0).toUpperCase() + param.slice(1)}`;

      if (typeof this[methodName] !== "function") {
        return;
      }

      const result = this[methodName](params[param]);

      if (param === "page" || param === "perPage") {
        return;
      }

      const [query, value] = result;

      if (!query) {
        return;
      }

      if (query.indexOf("?") !== -1) {
        const paramizeQuery = query.replace(/\?/g, `$${++this._finalObject.currentIndex}`);
        whereSQL.push(paramizeQuery);
        values.push(value);
      } else {
        whereSQL.push(query);
      }
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

      this._finalObject.select = selectedColumns.join(", ").replace(/,\s*$/, "");
    }

    this.finalizeSQL();

    return this;
  }

  orders(params) {
    if (!params || typeof params !== "object") {
      return this;
    }

    // /api/v1/endpoint?orderBy=column1:asc,column2:desc
    const orderParams = Object.keys(params).find((param) => param === "orderBy");
    if (!orderParams) {
      return this;
    }

    const arrayParams = params[orderParams].split(",");

    if (arrayParams.length === 0) {
      return this;
    }

    const orders = [];
    arrayParams.forEach((param) => {
      const [column, direction] = param.split(":");

      if (column && direction) {
        const methodName = `orderBy${column.charAt(0).toUpperCase() + column.slice(1)}`;

        if (typeof this[methodName] !== "function") {
          return;
        }

        const result = this[methodName](direction);

        const [orderClause, orderDirection] = result;

        if (["ASC", "DESC"].includes(direction.toUpperCase()) || direction == "") {
          orders.push(`${orderClause} ${orderDirection}`);
        } else {
          orders.push(`${orderClause} ASC`);
        }
      }
    });

    if (orders.length === 0) {
      return this;
    }

    const sql = " ORDER BY " + orders.join(", ").replace(/,\s*$/, "");
    this._finalObject.order = sql;
    this.finalizeSQL();

    return this;
  }

  async fetchTotalData() {
    let parts = [`SELECT COUNT(*)`, `FROM ${this.tableName}`];

    if (this._finalObject.joins) parts.push(this._finalObject.joins);
    if (this._finalObject.where) parts.push(this._finalObject.where);

    const sql = parts.join(" ").replace(/\s+/g, " ").trim();

    const query = {
      text: sql,
      values: this._finalObject.values,
    };

    const results = await this._pool.query(query);
    const totalData = parseInt(results.rows[0].count);

    this.paginationMeta.totalPages = Math.ceil(totalData / this.paginationMeta.perPage);

    this.paginationMeta.size = totalData;

    return this;
  }

  finalizeSQL() {
    let parts = [`SELECT ${this._finalObject.select}`, `FROM ${this.tableName}`];

    if (this._finalObject.joins) parts.push(this._finalObject.joins);
    if (this._finalObject.where) parts.push(this._finalObject.where);
    if (this._finalObject.order) parts.push(this._finalObject.order);
    if (this._finalObject.paginate) parts.push(this._finalObject.paginate);

    const sql = parts.join(" ").replace(/\s+/g, " ").trim();

    this.finalSQL = sql;
  }

  getByPerPage(perPage) {
    this._perPage = parseInt(perPage);
  }

  getByPage(page) {
    this._page = parseInt(page);
  }
}

module.exports = BaseQuery;
