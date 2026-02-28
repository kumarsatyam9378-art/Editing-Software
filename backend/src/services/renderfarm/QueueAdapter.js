class QueueAdapter {
  constructor() {
    this.queue = [];
  }

  push(job) {
    this.queue.push(job);
    return job;
  }

  pop() {
    return this.queue.shift() || null;
  }

  length() {
    return this.queue.length;
  }
}

module.exports = new QueueAdapter();
