export default class AddNode {
  constructor({ id = crypto.randomUUID() } = {}) {
    this.id = id;
    this.type = 'add';
    this.config = {};
    this.inputs = { a: null, b: null };
  }

  compute(context, getInput) {
    const a = getInput(this.inputs.a, context) ?? 0;
    const b = getInput(this.inputs.b, context) ?? 0;
    return { value: a + b };
  }
}
