const productRoutes = require('./product_routes');

module.exports = function (app, url) {
    productRoutes(app, url);
    // additional routes can go here
};