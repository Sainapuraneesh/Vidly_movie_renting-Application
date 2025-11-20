//lec-216
const helmet = required('helmet');//returns mw function
const compression = require('compression');//returns mw function

module.exports = function (app) {
    app.use(helmet());
    app.use(compression()); //call these mw functions (bcoz these mw functions help after deployment in production environment)
}