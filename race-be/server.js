//env
require('dotenv').config()
const environment = process.env.NODE_ENV || 'development'

//library imports
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const DiscordStrategy = require('passport-discord').Strategy

//Model Import
const User = require('./models/User')

//route imports
const userRouter = require('./routes/user')
const characterRouter = require('./routes/character')
const scoreableObjectRouter = require('./routes/scoreableObject')
// const scoreRouter = require('./routes/score')
const leagueRouter = require('./routes/league')
const teamRouter = require('./routes/team')

//bind models to db
const Knex = require('knex')
const knexfile = require('./knexfile')
const { Model, knexSnakeCaseMappers } = require('objection')
const knex = Knex({ ...knexfile.development, ...knexSnakeCaseMappers() })
Model.knex(knex)

//initiate
const app = express()
app.use(bodyParser.json())
app.use(
  cors({
    origin: 'http://localhost:3000', // specify the exact origin
    credentials: true // allow credentials
  })
)

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Important for security
      secure: false, // Set to true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24 // Example: 1-day long session
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

// auth
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'email']
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.query().findOne({ username: profile.username })

        if (!user) {
          console.log('rcreated a user')
          user = await User.query().insert({
            username: profile.username,
            role: 'player' // default role
            // add other fields as necessary
          })
        } else {
          console.log('found a user')
        }

        done(null, user)
      } catch (err) {
        done(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.query()
    .findById(id)
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      done(err)
    })
})

app.get('/auth/discord', passport.authenticate('discord'))

app.get(
  '/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/CreateLeague')
    // res.json({ success: true, user: req.user })
  }
)

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    // Redirect unauthenticated users to the login page
    res.redirect('/login')
  }
}

function ensureRole (role) {
  return function (req, res, next) {
    if (req.user && req.user.role === role) {
      return next()
    } else {
      // Redirect users without the required role to the home page
      res.redirect('/')
    }
  }
}

app.get('/auth/check', (req, res) => {
  console.log('authing someone')
  if (req.isAuthenticated()) {
    res.send(true)
  } else {
    console.log('not authed')
    res.send(false)
  }
})
app.get('/admin/check', (req, res) => {
  console.log('checking admin')
  if (req.isAuthenticated() && ensureRole('admin')) {
    res.send({ isAdmin: true, userId: user.id })
  } else {
    console.log('not admin')
    res.send(false)
  }
})

// middlwear
app.get(
  '/admin',
  ensureAuthenticated,
  ensureRole('admin'),
  function (req, res) {
    // Only authenticated users with the 'admin' role can access this route
    res.send('Welcome, admin!')
  }
)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

//import routres
app.use('/users', userRouter)
app.use('/characters', characterRouter)
app.use('/scoreable-objects', scoreableObjectRouter)
// app.use('/score-events', scoreRouter)
app.use('/leagues', leagueRouter)
app.use('/teams', teamRouter)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.status || 500)
  res.json({ error: err.message })
})
// Start the server
const PORT = process.env.PORT || 8001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
