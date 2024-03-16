import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Grid } from '@mui/material'

const TeamComparison = () => {
  const [teamData, setTeamData] = useState([])

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/dashboard-data/team-comparison`
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => setTeamData(data))
      .catch(err => console.error('Error fetching team data:', err))
  }, [])

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant='h6' gutterBottom>
        Team Comparison
      </Typography>
      <Grid container spacing={2}>
        {teamData.map(team => (
          <Grid item xs={12} md={6} key={team.teamName}>
            <Box sx={{ p: 2, border: '1px solid gray', borderRadius: '4px' }}>
              <Typography variant='subtitle1'>{team.teamName}</Typography>
              <Typography>Total Points: {team.totalPoints}</Typography>
              <Typography>Bounties Claimed: {team.bountiesClaimed}</Typography>
              <Typography>
                Total Scoring Events: {team.totalScoringEvents}
              </Typography>
              <Typography>
                Most Recent Bounty: {team.mostRecentBounty.username}
              </Typography>
              <Typography>
                Claimed At: {new Date(team.mostRecentBounty.claimedAt).toDateString()}
              </Typography>
              <Typography>
                Claimed By: {team.mostRecentBounty.username}
              </Typography>
              <Typography>
                Recent Contributor: {team.mostRecentContributer.username}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default TeamComparison
