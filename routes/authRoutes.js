const passport = require('passport') //import the passport npm module
module.exports = app => {

    // if a user comes in on this route, redirect them to passport
    // passport can then try to authenticate the user using the 
    // strategy called google. Tell google we want the users
    // profile and email 
    app.get(
        '/auth/google', 
        passport.authenticate('google', 
        { 
            scope: ['profile', 'email'] 
        })
    );

    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'), 
        (req, res) => {
            // Successful authentication, redirect home.
            //res.redirect('/');
        }
    );

    app.get('/api/current_user', (req, res) => {
        //console.log('REQUEST: ',req)
        //console.log(req.user)
        res.send(req.user);
    });
};