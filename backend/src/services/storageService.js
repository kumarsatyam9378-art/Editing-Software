async function getUploadUrl(fileName) {
  return {
    uploadUrl: `https://example-s3.local/upload/${encodeURIComponent(fileName)}`,
    fileUrl: `https://example-s3.local/assets/${encodeURIComponent(fileName)}`
  };
}

module.exports = { getUploadUrl };
