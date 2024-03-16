const express = require('express')
const router = express.Router()
const Team = require('../models/team.js')
const ScoringEvent = require('../models/scoringEvent.js')
const User = require('../models/user.js')
const ScoreableObject = require('../models/scoreableObject.js')
//end point for the team comparison page

//return for each team: name, total points, bounties claimed, total scoring events
//most recent bounty (what it was, user who claimed it, and when it was claimed)
//most recent contributer
//top 3 contributers

router.get('/team-comparison', async (req, res) => {
  //get all teams
  //get all scoring events
  //check if each scoring event was a bounty and set isBounty
  //get all users

  const teams = await Team.query()
  const scoringEvents = await ScoringEvent.query().withGraphFetched(
    '[scoreableObject,league]'
  )
  const users = await User.query()
  for (const event of scoringEvents) {
    // console.log(event)
    const scoreableObject = await ScoreableObject.query().findById(
      event.scoreableObjectId
    )
    if (
      scoreableObject.submittableType === 'player_bounty' ||
      scoreableObject.submittableType === 'team_bounty' ||
      scoreableObject.submittableType === 'server_bounty'
    ) {
      event.isBounty = true
    } else {
      event.isBounty = false
    }
  }

  const teamComparison = []
  for (const team of teams) {
    const teamData = {
      teamName: team.name,
      teamColour: team.colour,
      totalPoints: 0,
      bountiesClaimed: 0,
      totalScoringEvents: 0,
      mostRecentBounty: {
        name: '',
        claimedBy: '',
        claimedAt: ''
      },
      mostRecentContributer: {
        username: '',
        claimedAt: ''
      },
      topContributers: []
    }
    for (const event of scoringEvents) {
      if (event.teamId === team.id) {
        teamData.totalPoints += event.pointTotal
        teamData.totalScoringEvents++
        if (event.isBounty) {
          teamData.bountiesClaimed++
          if (event.createdAt > teamData.mostRecentBounty.claimedAt) {
            teamData.mostRecentBounty.name = event.scoreableObject.name
            teamData.mostRecentBounty.claimedAt = event.createdAt
            const user = await User.query().findById(event.userId)
            teamData.mostRecentBounty.username = user.username
            // const ScoreableObject = await ScoreableObject.query().findById(
            //   event.scoreableObjectId
            // )
            // teamData.mostRecentBounty.username = ScoreableObject.username
          }
        }
        if (event.createdAt > teamData.mostRecentContributer.claimedAt) {
          const user = await User.query().findById(event.userId)
          teamData.mostRecentContributer.username = user.username
          teamData.mostRecentContributer.claimedAt = event.createdAt
        }
      }
    }
    teamComparison.push(teamData)
  }
  res.json(teamComparison)
})

router.get('/leader-board', async (req, res) => {
  const users = await User.query()
  const scoringEvents = await ScoringEvent.query()
  const teams = await Team.query()
  const userScores = []
  for (const user of users) {
    let score = 0
    let count = 0
    for (const event of scoringEvents) {
      if (event.userId === user.id) {
        score += event.pointTotal
      }
    }
    user.score = score
    user.scoredEventsCount = count
    user.teamName = teams.find(team => team.id === user.teamId).name
    user.teamColour = teams.find(team => team.id === user.teamId).colour
    userScores.push(user)
  }
  userScores.sort((a, b) => {
    return b.score - a.score
  })
  res.json(userScores)
})

module.exports = router
