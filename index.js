const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); // we want to use cookies
const passport = require('passport');
const keys = require('./config/keys');
// import the models file so it gets executed.
// This creates our users collection and scheama
require('./models/user.js'); 
require('./services/passportService.js');//Make sure the passportServices file is executed

mongoose.connect(keys.mongoURI);

const app = express()
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys:[keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());



// authRoutes.js returns a function... which we are calling straight 
// away with (app)
require('./routes/authRoutes')(app)

// pass an environment variable through to our application
const PORT = process.env.PORT || 5000
// listen on port 5000
app.listen(PORT);
// start the app with node index.js
// navigate to localhost:5000 in your browser
// http://localhost:5000/auth/google/callback