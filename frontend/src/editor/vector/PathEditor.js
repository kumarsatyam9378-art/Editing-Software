export default class PathEditor {
  constructor(nodes = []) {
    this.nodes = nodes;
    this.selectedAnchor = null;
  }

  selectAnchor(index) {
    this.selectedAnchor = index;
  }

  moveAnchor(index, dx, dy) {
    const node = this.nodes[index];
    if (!node) return;
    if (node.args.length >= 2) {
      node.args[0] += dx;
      node.args[1] += dy;
    }
  }

  addNode(node) {
    this.nodes.push(node);
  }

  toPathString() {
    return this.nodes.map((node) => `${node.command} ${node.args.join(' ')}`.trim()).join(' ');
  }
}
