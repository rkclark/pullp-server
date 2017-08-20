require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const index = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

passport.serializeUser((user, done) => {
  console.log('SERIALIZE USER: ', user);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  console.log('DE-SERIALIZE USER: ', obj);
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // asynchronous verification, for effect...
      console.log('GITHUB STRATEGY_PROFILE: ', profile);
      console.log('GITHUB STRATEGY_ACCESS_TOKEN: ', accessToken);
      console.log('GITHUB STRATEGY_REFRESH_TOKEN: ', refreshToken);
      console.log('GITHUB STRATEGY_DONE: ', done);

      process.nextTick(() =>
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.

        done(null, profile),
      );
    },
  ),
);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth/', auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
