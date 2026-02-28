import NodeRegistry from './graph/NodeRegistry';
import CycleDetector from './graph/CycleDetector';
import DependencyResolver from './graph/DependencyResolver';
import CacheSystem from './graph/CacheSystem';
import GraphSerializer from './graph/GraphSerializer';
import ConstantNode from './graph/nodes/ConstantNode';
import TimeNode from './graph/nodes/TimeNode';
import AddNode from './graph/nodes/AddNode';
import MultiplyNode from './graph/nodes/MultiplyNode';
import NoiseNode from './graph/nodes/NoiseNode';
import SpringNode from './graph/nodes/SpringNode';
import ClampNode from './graph/nodes/ClampNode';
import OutputNode from './graph/nodes/OutputNode';

export default class AnimationGraphEngine {
  constructor() {
    this.registry = new NodeRegistry();
    this.cache = new CacheSystem();
    this.nodes = new Map();
    this.#registerDefaults();
  }

  #registerDefaults() {
    this.registry.register('constant', (cfg) => new ConstantNode(cfg));
    this.registry.register('time', (cfg) => new TimeNode(cfg));
    this.registry.register('add', (cfg) => new AddNode(cfg));
    this.registry.register('multiply', (cfg) => new MultiplyNode(cfg));
    this.registry.register('noise', (cfg) => new NoiseNode(cfg));
    this.registry.register('spring', (cfg) => new SpringNode(cfg));
    this.registry.register('clamp', (cfg) => new ClampNode(cfg));
    this.registry.register('output', (cfg) => new OutputNode(cfg));
  }

  addNode(type, config = {}) {
    const node = this.registry.create(type, config);
    this.nodes.set(node.id, node);
    return node;
  }

  connect(targetNodeId, inputName, sourceNodeId, outputName = 'value') {
    const target = this.nodes.get(targetNodeId);
    if (!target) throw new Error('Target node not found');
    target.inputs[inputName] = { nodeId: sourceNodeId, outputName };
  }

  evaluate(frame, fps = 30) {
    const graph = { nodes: this.nodes };
    if (CycleDetector.hasCycle(graph)) {
      throw new Error('Animation graph cycle detected');
    }

    const order = DependencyResolver.topologicalSort(graph);
    const outputs = {};

    const getInput = (connection, context) => {
      if (!connection?.nodeId) return null;
      const nodeOutput = outputs[connection.nodeId] ?? this.cache.get(connection.nodeId, context.frame);
      if (!nodeOutput) return null;
      return nodeOutput[connection.outputName || 'value'];
    };

    order.forEach((id) => {
      const node = this.nodes.get(id);
      const context = { frame, fps };
      const result = node.compute(context, getInput);
      outputs[id] = result;
      this.cache.set(id, frame, result);
    });

    const evaluated = {};
    Object.values(outputs).forEach((out) => {
      if (out?.property) evaluated[out.property] = out.value;
    });

    return evaluated;
  }

  serialize() {
    return GraphSerializer.serialize({ nodes: this.nodes });
  }

  deserialize(raw) {
    const graph = GraphSerializer.deserialize(raw, this.registry);
    this.nodes = graph.nodes;
    this.cache.clear();
  }
}
