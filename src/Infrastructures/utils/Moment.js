const DateHelper = require("../../Applications/utils/DateHelper");

class Moment extends DateHelper {
  constructor(moment) {
    super();
    this._moment = moment;
  }

  async getCurrentDate() {
    return this._moment().toISOString();
  }

  async getDiffFromNow(date) {
    return this._moment(date).fromNow();
  }

  async getDiffInDays(date) {
    return this._moment().diff(date, "days");
  }

  async getDiffInYears(date) {
    return this._moment().diff(date, "years");
  }

  async addDays(date, days) {
    return this._moment(date).add(days, "days").toISOString();
  }

  async addMinutes(date, minutes) {
    return this._moment(date).add(minutes, "minutes").toISOString();
  }

  async addYears(date, years) {
    return this._moment(date).add(years, "years").toISOString();
  }

  async addMonths(date, months) {
    return this._moment(date).add(months, "months").toISOString();
  }

  async new(date) {
    return this._moment(date);
  }
}

module.exports = Moment;
