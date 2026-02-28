export default class OutputNode {
  constructor({ id = crypto.randomUUID(), property = 'opacity' } = {}) {
    this.id = id;
    this.type = 'output';
    this.config = { property };
    this.inputs = { value: null };
  }

  compute(context, getInput) {
    const value = getInput(this.inputs.value, context) ?? 0;
    return { property: this.config.property, value };
  }
}
