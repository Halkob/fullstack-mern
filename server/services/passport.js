const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleID: profile.id})
            .then((existingUser) => {
                if (existingUser){
                    //käyttäjä löytyy
                  done(null, existingUser); 
                } else{
                    //tallennetaan uusi käyttäjä tietokantaan
                    new User({ googleID: profile.id })
                    .save()
                    .then(user => done(null, user));
                }
            });  
    })
);