const { getUploadUrl } = require('../services/storageService');

async function requestUpload(req, res) {
  const { fileName } = req.body;
  const signed = await getUploadUrl(fileName);
  return res.json(signed);
}

module.exports = { requestUpload };
