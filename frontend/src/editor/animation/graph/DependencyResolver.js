export default class DependencyResolver {
  static topologicalSort(graph) {
    const indegree = new Map();
    const edges = new Map();

    graph.nodes.forEach((node, id) => {
      indegree.set(id, 0);
      edges.set(id, []);
    });

    graph.nodes.forEach((node, id) => {
      Object.values(node.inputs || {}).forEach((conn) => {
        if (!conn?.nodeId || !graph.nodes.has(conn.nodeId)) return;
        edges.get(conn.nodeId).push(id);
        indegree.set(id, (indegree.get(id) || 0) + 1);
      });
    });

    const queue = [...indegree.entries()].filter(([, d]) => d === 0).map(([id]) => id);
    const order = [];

    while (queue.length) {
      const id = queue.shift();
      order.push(id);
      edges.get(id).forEach((next) => {
        indegree.set(next, indegree.get(next) - 1);
        if (indegree.get(next) === 0) queue.push(next);
      });
    }

    if (order.length !== graph.nodes.size) {
      throw new Error('Animation graph has unresolved dependencies/cycle');
    }

    return order;
  }
}
