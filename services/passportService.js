const passport = require('passport'); //passport lib
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// using a single argument to mongoose will fetch the collection
const UserCollection = mongoose.model('users');

// This is a function that is used to take the id of the doc for the user
// in the UserCollection table in the database so that we can set the cookie
// in the headers. This will be used to identify if a user is already logged in
passport.serializeUser((user, done) => {
    console.log('serializeUser: ',user.id)
    done(null, user.id);
});
// This is a function that grabs the token we stuffed into the cookie 
// we pass the token to this function which converts it to the UserCollection
// document id. We can then match that up to the user in our DB.
passport.deserializeUser((id, done) => {
    // cookieToken is actually our doc id once it has been deserializeUser
    // We can search through our collection to find that id
    UserCollection.findById(id)
    console.log('deserializeUserId: ',id)
    // we use the .then function to make sure the user is returned
    // we store that information in the user var
    // we then use the callback (cb) function to end the call returning the 
    // user information in the variable user
    .then(user => {
        console.log('deserializeUser: ',user)
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'] || keys.googleClientID,
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    },
    function(accessToken, refreshToken, profile, cb){
        //console.log('accessToken:', accessToken);
        //console.log('refreshToken:', refreshToken);
        //console.log('profile:', profile);
        
        // Look through the UserCollection, find one instance (doc) with a googleId equal to the profile.id
        UserCollection.findOne({
           googleId: profile.id 
        })
        // use a js promise (.then) which will return the user if found.
        // if no user is found then existingUser will equal null
        .then((existingUser) => {
            if(existingUser){
                // we already have a user in the db
                // use the passport callback function to progress the auth flow 
                cb(null,existingUser);
            }else{
                // lets add the new user
                // add a new collection object and load in the profile id from the google auth
                new UserCollection({
                    googleId: profile.id
                }).save() //.save() actually persists the data in the database
                // as the request is async we need to use the .then call to ensure the record was entered into the collection
                // once it has been returned we can call the cb function to tell passport to continue on with the authentication flow
                // store the returned value in the promise user.
                .then(user => 
                    cb(null,user)
                );
            }
        })        
    }
));
