export default class HistoryStack {
  constructor(limit = 300) {
    this.limit = limit;
    this.undoStack = [];
    this.redoStack = [];
  }

  pushDiff(diff) {
    this.undoStack.push(diff);
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack = [];
  }

  undo(applyInverse) {
    const diff = this.undoStack.pop();
    if (!diff) return false;
    applyInverse(diff);
    this.redoStack.push(diff);
    return true;
  }

  redo(applyForward) {
    const diff = this.redoStack.pop();
    if (!diff) return false;
    applyForward(diff);
    this.undoStack.push(diff);
    return true;
  }
}
