export default class SpringNode {
  constructor({ id = crypto.randomUUID(), stiffness = 180, damping = 20, mass = 1 } = {}) {
    this.id = id;
    this.type = 'spring';
    this.config = { stiffness, damping, mass };
    this.inputs = { target: null };
    this.state = { position: 0, velocity: 0 };
    this.lastFrame = null;
  }

  compute(context, getInput) {
    const target = getInput(this.inputs.target, context) ?? 0;
    const dtFrames = this.lastFrame == null ? 1 : Math.max(1, context.frame - this.lastFrame);
    const dt = dtFrames / context.fps;
    const force = -this.config.stiffness * (this.state.position - target) - this.config.damping * this.state.velocity;
    const accel = force / this.config.mass;
    this.state.velocity += accel * dt;
    this.state.position += this.state.velocity * dt;
    this.lastFrame = context.frame;
    return { value: this.state.position };
  }
}
