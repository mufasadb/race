const express = require('express')
const router = express.Router()
const ScoringEvent = require('../models/scoringEvent.js')

// Get all scoringEvents
router.get('/', async (req, res) => {
  try {
    const scoringEvents = await ScoringEvent.query()
    res.json(scoringEvents)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get scoringEvent by ID
router.get('/:id', getScoringEvent, (req, res) => {
  res.json(res.scoringEvent)
})

// Create scoringEvent
router.post('/', async (req, res) => {
  try {
    const newScoringEvent = await ScoringEvent.query().insert(req.body)
    res.status(201).json(newScoringEvent)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update scoringEvent
router.patch('/:id', getScoringEvent, async (req, res) => {
  try {
    const updatedScoringEvent = await res.scoringEvent.$query().patch(req.body)
    res.json(updatedScoringEvent)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete scoringEvent
router.delete('/:id', getScoringEvent, async (req, res) => {
  try {
    await res.scoringEvent.$query().delete()
    res.json({ message: 'Deleted ScoringEvent' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware function for getting scoringEvent by ID
async function getScoringEvent (req, res, next) {
  console.log('tried to get scoringEvent')
  let scoringEvent
  try {
    scoringEvent = await ScoringEvent.query().findById(req.params.id)
    if (scoringEvent == null) {
      return res.status(404).json({ message: 'Cannot find scoringEvent' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.scoringEvent = scoringEvent
  next()
}

//get scoringEvent list by user id
router.get('/user/:id', async (req, res) => {
  try {
    const scoringEvents = await ScoringEvent.query().where(
      'user_id',
      req.params.id
    )
    res.json(scoringEvents)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/team/:id', async (req, res) => {
  try {
    const scoringEvents = await ScoringEvent.query().where(
      'team_id',
      req.params.id
    )
    res.json(scoringEvents)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/league/:id', async (req, res) => {
  try {
    const scoringEvents = await ScoringEvent.query().where(
      'league_id',
      req.params.id
    )
    res.json(scoringEvents)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/scoreByTeam/:id', async (req, res) => {
  try {
    const scoringEvents = await ScoringEvent.query().where(
      'team_id',
      req.params.id
    )
    totalScore = 0
    scoringEvents.forEach(event => {
      totalScore += event.score
    })
    res.json(totalScore)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/scoreByTeam/:id/:type', async (req, res) => {
  try {
    const scoringEvents = await ScoringEvent.query()
      .where('team_id', req.params.id)
      .andWhere('type', req.params.type)
    totalScore = 0
    scoringEvents.forEach(event => {
      totalScore += event.score
    })
    res.json(totalScore)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
