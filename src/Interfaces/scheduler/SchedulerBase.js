class SchedulerBase {
  constructor(container) {
    if (this.constructor === SchedulerBase) {
      throw new Error("Abstract class cannot be instantiated");
    }

    this._container = container;
  }

  async perform() {
    throw new Error("perform method must be implemented");
  }
}

module.exports = SchedulerBase;
