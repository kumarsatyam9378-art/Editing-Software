class IntervalNode {
  constructor(interval) {
    this.interval = interval;
    this.max = interval.endFrame;
    this.left = null;
    this.right = null;
  }
}

export default class IntervalTree {
  constructor() {
    this.root = null;
  }

  insert(interval) {
    this.root = this.#insert(this.root, interval);
  }

  #insert(node, interval) {
    if (!node) return new IntervalNode(interval);
    if (interval.startFrame < node.interval.startFrame) node.left = this.#insert(node.left, interval);
    else node.right = this.#insert(node.right, interval);
    node.max = Math.max(node.max, interval.endFrame, node.left?.max || -Infinity, node.right?.max || -Infinity);
    return node;
  }

  remove(intervalId) {
    this.root = this.#remove(this.root, intervalId);
  }

  #remove(node, id) {
    if (!node) return null;
    if (node.interval.id === id) {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let successor = node.right;
      while (successor.left) successor = successor.left;
      node.interval = successor.interval;
      node.right = this.#remove(node.right, successor.interval.id);
    } else {
      node.left = this.#remove(node.left, id);
      node.right = this.#remove(node.right, id);
    }
    node.max = Math.max(node.interval.endFrame, node.left?.max || -Infinity, node.right?.max || -Infinity);
    return node;
  }

  searchOverlapping(range) {
    const result = [];
    this.#search(this.root, range, result);
    return result;
  }

  #search(node, range, out) {
    if (!node) return;
    const overlap = node.interval.startFrame < range.endFrame && range.startFrame < node.interval.endFrame;
    if (overlap) out.push(node.interval);
    if (node.left && node.left.max >= range.startFrame) this.#search(node.left, range, out);
    if (node.right && node.interval.startFrame <= range.endFrame) this.#search(node.right, range, out);
  }

  clear() {
    this.root = null;
  }
}
