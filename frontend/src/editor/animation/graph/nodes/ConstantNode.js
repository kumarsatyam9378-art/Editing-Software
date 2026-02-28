export default class ConstantNode {
  constructor({ id = crypto.randomUUID(), value = 0 } = {}) {
    this.id = id;
    this.type = 'constant';
    this.config = { value };
    this.inputs = {};
  }

  compute() {
    return { value: this.config.value };
  }
}
