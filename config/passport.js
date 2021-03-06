const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      bcrypt = require('bcrypt-nodejs');



      passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findOne({ id: id } , function (err, user) {
            done(err, user);
        });
    });


passport.use(new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password',
//    phoneField: 'phone',
  },
  
  function(phone, password, done) {
    User.findOne({ phone: phone }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log(user)
        return done(null, false, { message: 'Incorrect email.' });
      }
     
      bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
         
            console.log(user.role)

          Role.findOne({id: user.role}).exec(function (err, role) {
            if (err) {
                res.send(500, { error: 'Database Error' });
            }

            var returnUser = {
              username: user.username,
              createdAt: user.createdAt,
              phone:user.phone,
              id: user.id,
              user_role:role.roleName
            };
         //   console.log(req.session)

           
            console.log("req.session.user_role")
          return done(null, returnUser, {
            message: 'Logged In Successfully',
           
          });

        });
        });
    });
  }
));