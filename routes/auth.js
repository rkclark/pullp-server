const express = require('express');
const passport = require('passport');

const router = express.Router();

const scopes = ['read:org', 'repo'];

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
router.get(
  '/github',
  passport.authenticate('github', { scope: scopes }),
  (req, res) => { // eslint-disable-line
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  },
);

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
