class WebhookNotifier {
  async notify(url, payload) {
    if (!url) return { skipped: true };
    return { skipped: false, url, payload };
  }
}

module.exports = new WebhookNotifier();
