export default class NoiseNode {
  constructor({ id = crypto.randomUUID(), amplitude = 1, frequency = 0.05 } = {}) {
    this.id = id;
    this.type = 'noise';
    this.config = { amplitude, frequency };
    this.inputs = { t: null };
  }

  compute(context, getInput) {
    const t = getInput(this.inputs.t, context) ?? context.frame;
    const n = Math.sin(t * this.config.frequency * 12.9898) * 43758.5453;
    return { value: (n - Math.floor(n)) * this.config.amplitude };
  }
}
