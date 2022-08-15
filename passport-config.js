const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function init(passport, getUserByUsername, getUserById){
    const authUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        if(user == null){
            return done(null, false, {message: "Acest utilizator nu exista."});
        }

        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            } else {
                return done(null, false, {message: "Parola gresita."});
            }
        } catch (err) {
            return done(err)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password'}, authUser));
    passport.serializeUser((user, done) => {
        return done(null, user.id)
    });
    passport.deserializeUser(async (id, done) => {
        const u = await getUserById(id);
        return done(null, u);
    });
}
 module.exports = init;