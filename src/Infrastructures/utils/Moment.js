const moment = require("moment");
const DateHelper = require("../../Applications/utils/DateHelper");

class Moment extends DateHelper {
  async getCurrentDate() {
    return moment();
  }

  async getDiffFromNow(date) {
    return moment(date).fromNow();
  }

  async getDiffInDays(date) {
    return moment().diff(date, "days");
  }

  async getDiffInYears(date) {
    return moment().diff(date, "years");
  }

  async addDays(date, days) {
    return moment(date).add(days, "days");
  }

  async addMinutes(date, minutes) {
    return moment(date).add(minutes, "minutes");
  }

  async addYears(date, years) {
    return moment(date).add(years, "years");
  }

  async addMonths(date, months) {
    return moment(date).add(months, "months");
  }
}

module.exports = Moment;
