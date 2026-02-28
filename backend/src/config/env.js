const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hollywood_editor',
  jwtSecret: process.env.JWT_SECRET || 'replace-me',
  stripeSecret: process.env.STRIPE_SECRET || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  s3Endpoint: process.env.S3_ENDPOINT || '',
  s3Bucket: process.env.S3_BUCKET || 'hollywood-editor-assets'
};
