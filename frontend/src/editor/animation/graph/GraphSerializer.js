export default class GraphSerializer {
  static serialize(graph) {
    return JSON.stringify({
      version: '1.0.0',
      nodes: [...graph.nodes.values()].map((node) => ({
        id: node.id,
        type: node.type,
        config: node.config,
        inputs: node.inputs
      }))
    });
  }

  static deserialize(raw, registry) {
    const parsed = JSON.parse(raw);
    const graph = { nodes: new Map() };
    (parsed.nodes || []).forEach((node) => {
      const instance = registry.create(node.type, { ...node.config, id: node.id });
      instance.inputs = node.inputs || {};
      graph.nodes.set(instance.id, instance);
    });
    return graph;
  }
}
