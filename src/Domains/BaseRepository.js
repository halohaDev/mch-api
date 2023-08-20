class BaseRepository {
  async paginate({ perPage = 10, direction = 'ASC', directionColumn = 'id', page = 1, targetTable = '', pool }) {
    const query = await this.getPaginatedQuery({ perPage, direction, directionColumn, page, targetTable })
    const paginateResult = await this.paginateResult(pool, query)
    const totalData = await this.totalData(targetTable)

    const results = await this.formatResult(paginateResult, totalData, page, perPage)

    return results
  }

  async getPaginatedQuery({ perPage = 10, direction = 'ASC', directionColumn = 'id', page = 1, targetTable = '' }) {
    if (targetTable === '') {
      return []
    }

    if (perPage < 1) {
      perPage = 1
    }

    if (page < 1) {
      page = 1
    }

    if (direction !== 'ASC' && direction !== 'DESC') {
      direction = 'ASC'
    }

    const offset = (page - 1) * perPage
    
    const query = {
      text: `SELECT * FROM ${targetTable} ORDER BY ${directionColumn} ${direction} LIMIT ${perPage} OFFSET ${offset}`,
    }

    return query;
  }

  async paginateResult(pool, query) {
    if (query === []) {
      return []
    }

    if (pool === undefined || pool === null) {
      return Error('pool is undefined or null')
    }

    const results = await pool.query(query)
    
    return results.rows
  }

  async formatResult(paginateResult, totalData, page, perPage) {
    totalData = parseInt(totalData)

    if (totalData < 0) {
      totalData = 0
    }

    const totalPage = Math.ceil(totalData / perPage)

    if (totalPage < 1) {
      totalPage = 1
    }

    if (paginateResult === []) {
      return {
        data: [],
        meta: {
          size: 0,
          totalData: totalData,
          totalPage: totalPage,
          perPage: perPage,
          currentPage: page,
        }
      }
    }

    return {
      data: paginateResult,
      meta: {
        size: paginateResult.length,
        totalData: totalData,
        totalPage: totalPage,
        perPage: perPage,
        currentPage: page,
      }
    }
  }

  async totalData(targetTable) {
    const query = {
      text: `SELECT COUNT(*) FROM ${targetTable}`,
    }

    const result = await this._pool.query(query)

    return result.rows[0].count
  }
}

module.exports = BaseRepository;