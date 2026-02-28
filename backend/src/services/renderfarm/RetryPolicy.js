class RetryPolicy {
  constructor(maxAttempts = 3) {
    this.maxAttempts = maxAttempts;
  }

  shouldRetry(job) {
    return (job.attempts || 0) < this.maxAttempts;
  }

  next(job) {
    return { ...job, attempts: (job.attempts || 0) + 1 };
  }
}

module.exports = new RetryPolicy(3);
