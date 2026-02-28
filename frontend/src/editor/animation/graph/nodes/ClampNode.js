export default class ClampNode {
  constructor({ id = crypto.randomUUID(), min = 0, max = 1 } = {}) {
    this.id = id;
    this.type = 'clamp';
    this.config = { min, max };
    this.inputs = { v: null };
  }

  compute(context, getInput) {
    const v = getInput(this.inputs.v, context) ?? 0;
    return { value: Math.max(this.config.min, Math.min(this.config.max, v)) };
  }
}
