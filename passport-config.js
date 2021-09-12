const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {

            return done(null, false, {message: 'No User with this email'})
        }

    }
    localStrategy.use(new localStrategy({ usernameField: 'email' }), authenticateUser)
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })
    
}