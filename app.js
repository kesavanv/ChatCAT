var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session);

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    app.use(session({secret: config.sessionSecret}));
} else {
    app.use(session({
        secret: config.sessionSecret,
        store: new ConnectMongo({
            url: config.dbURL,
            stringify: true
        })
    }));
}


require('./routes/routes.js')(express, app);

app.listen(3000, function () {
    console.log('ChatCAT working on Port 3000');
    console.log('Mode: ', env);
});