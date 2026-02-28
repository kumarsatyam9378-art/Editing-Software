export default class CycleDetector {
  static hasCycle(graph) {
    const visiting = new Set();
    const visited = new Set();

    const visit = (nodeId) => {
      if (visiting.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      visiting.add(nodeId);

      const node = graph.nodes.get(nodeId);
      if (node) {
        Object.values(node.inputs || {}).forEach((conn) => {
          if (conn?.nodeId && visit(conn.nodeId)) throw new Error('Animation graph cycle detected');
        });
      }

      visiting.delete(nodeId);
      visited.add(nodeId);
      return false;
    };

    try {
      [...graph.nodes.keys()].forEach((id) => visit(id));
      return false;
    } catch {
      return true;
    }
  }
}
