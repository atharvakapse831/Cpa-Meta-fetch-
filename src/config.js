const path = require('path');

module.exports = {
  PORT: process.env.PORT || 4000,
  TEMP_DIR: path.resolve(process.env.TEMP_DIR || './tmp'),
  SERVICE_SECRET: process.env.SERVICE_SECRET || null,

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  sociavault: {
    apiKey: process.env.SOCIAVAULT_API_KEY,
    baseUrl: process.env.SOCIAVAULT_BASE_URL || 'https://api.sociavault.com',
  },
};
