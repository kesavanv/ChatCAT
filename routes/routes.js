module.exports = function (express, app, passport, config, rooms) {
    var router = express.Router();

    router.get('/', function (req, res, next) {
        var title = 'Welcome to ' + config.appName;
        res.render('index', {title: title, appName: config.appName});
    });

    function securePages(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }
    }

    router.get('/auth/facebook', passport.authenticate('facebook'));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/chatrooms',
        failureRedirect: '/'
    }));

    router.get('/chatrooms', securePages, function (req, res, next) {
        var title = config.appName + ' - Chatrooms';
        var data = {
            title: title,
            appName: config.appName,
            user:req.user,
            config: config
        };
        res.render('chatrooms', data);
    });

    router.get('/room/:id', securePages, function (req, res, next) {
        var title = config.appName + ' - ' + room_name;
        var room_name = findTitle(req.params.id);
        var data = {
            title: title,
            appName: config.appName,
            user: req.user,
            room_number: req.params.id,
            room_name: room_name,
            config: config
        };
        res.render('room', data);
    });

    function findTitle (room_id) {
        var title;
        rooms.forEach(function (thisRoom) {
            if (thisRoom.room_number == room_id) {
                title = thisRoom.room_name;
            }
        });
        return title;
    }

    router.get('/logout', function (req, res, next) {
        req.logout();
        res.redirect('/');
    });

    app.use('/', router);
    
};