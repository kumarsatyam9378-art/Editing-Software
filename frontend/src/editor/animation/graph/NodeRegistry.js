export default class NodeRegistry {
  constructor() {
    this.factories = new Map();
  }

  register(type, factory) {
    this.factories.set(type, factory);
  }

  create(type, config = {}) {
    const factory = this.factories.get(type);
    if (!factory) throw new Error(`Unknown node type: ${type}`);
    return factory(config);
  }

  has(type) {
    return this.factories.has(type);
  }
}
