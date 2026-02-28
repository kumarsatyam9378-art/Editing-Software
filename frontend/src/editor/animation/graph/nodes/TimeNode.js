export default class TimeNode {
  constructor({ id = crypto.randomUUID() } = {}) {
    this.id = id;
    this.type = 'time';
    this.config = {};
    this.inputs = {};
  }

  compute(context) {
    return { value: context.frame };
  }
}
