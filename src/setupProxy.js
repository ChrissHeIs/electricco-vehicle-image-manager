// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // The path you want to proxy (this can be any path, adjust it to fit your API request)
    createProxyMiddleware({
      target: 'https://api.carsxe.com', // The base URL of the API you want to proxy to
      changeOrigin: true,               // To handle CORS
      secure: false,                    // Set to false if the target API is over HTTP instead of HTTPS
      pathRewrite: {
        '^/api': '',                    // This will remove '/api' from the request before forwarding it
      },
    })
  );
};
