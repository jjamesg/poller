var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Poll = require('../models/pollmodel');
var bodyParser = require('body-parser');
var ObjectId = require('mongoose').Types.ObjectId;


var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { user : req.user, view: 'main' });
});

router.get('/user', function (req, res) {
    if(!req.user) res.send('');
    else res.send(req.user.username);
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        console.log(req.body.username)
        if (err) {
            return res.send(null);
        }

        passport.authenticate('local')(req, res, function () {
            res.send(true);
        });
    });
});

router.get('/login/:x?', function(req, res) {
    var error = req.params.x? 'Invalid username/password' : '';
    res.render('login', { user : req.user, error : error });
});

//router.post('/login', passport.authenticate('local', {successRedirect: '/'}));

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log(err, user, info);
        if(err) return next(err);
        if(!user) return res.send(null);
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send(user)
        });
    })(req, res, next)
});

/*router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log(err, user, info)
        if (err) { return next(err); }
        if (!user) { console.log('no user') }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/users/' + user.username);
        });
    })(req, res, next);
});*/


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res) {
    res.status(200).send("pong!");
});

router.post('/poll', function(req, res) {
    var votesArray = new Array(req.body['answers[]'].length+1)
            .join('0')
            .split('')
            .map(parseFloat);
            
    var poll = new Poll({question: req.body.question,
                         answers: req.body['answers[]'],
                         votes: votesArray,
                         user: req.body.user
    });
    
    poll.save(function(err) { if(err) console.log('poll did not save') });

    res.send(poll._id);
});

router.get('/poll/*', function(req, res) {
    res.render('index', { user : req.user, view: 'poll' });
})

router.get('/getpoll/:id', function(req, res) {
    Poll.findOne({ _id: ObjectId(req.params.id) }, function(err, poll) {
        if(err) console.error(err);
        res.send(poll);
    });
});

router.post('/vote', function(req, res) {
    Poll.update(
        { _id: ObjectId(req.body.pollId) }, 
        { $set: { votes: req.body['votes[]'] } },
        { multi: false },
        function() {
            res.end();
        }
    );
});

router.get('/mypolls', function(req, res) {
    res.render('index', { user : req.user, view: 'mypolls' });
})

router.get('/mypolls/search', function(req, res) {
    console.log('searching')
    if(!req.user) 0
    else {
        Poll.
            find( { user: req.user.username} ).
            select({ _id: 1, question: 1, votes: 1}).
            exec(function(err, doc) {
                if(err) console.log(err)
                res.send(doc)
            })
    }
})

router.post('/delete', function(req, res) {
    Poll.
        find( { _id: ObjectId(req.body.id) }).
        remove().
        exec(function(err, doc){
            if(err) console.error(err)
                res.send(doc)
            })
});

module.exports = router;
