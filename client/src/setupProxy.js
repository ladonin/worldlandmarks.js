const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api/*',
        { target: 'http://10.0.3.15:80' }
    ));
}