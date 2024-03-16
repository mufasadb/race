import React, { useState, useEffect } from 'react'
import { Paper, Typography, Grid, Box, Chip } from '@mui/material'

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
      <Typography variant='h6' gutterBottom component='div'>
        Team Comparison
      </Typography>
      <Grid container spacing={2}>
        {teamData.map(team => (
          <Grid item xs={12} md={6} key={team.teamName}>
            <Box
              sx={{
                p: 2,
                border: '1px solid gray',
                borderRadius: '4px',
                bgcolor: '#2a2a2a', // Dark background
                color: 'white', // White text
                '&:hover': {
                  transform: 'scale(1.05)', // Grow effect on hover
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' // Shadow on hover
                },
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease'
              }}
            >
              <Typography
                variant='subtitle1'
                component='div'
                sx={{ color: '#4daff7', textAlign: 'center', mb: 1 }}
              >
                {team.teamName}
              </Typography>{' '}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label={`Total Points: ${team.totalPoints}`}
                  color='primary'
                />
                <Chip
                  label={`Bounties Claimed: ${team.bountiesClaimed}`}
                  color='secondary'
                />

                <Chip
                  label={`Total Scoring Events: ${team.totalScoringEvents}`}
                  variant='outlined'
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant='body2' component='div'>
                  Most Recent Bounty:{' '}
                  <Chip
                    label={`${
                      team.mostRecentBounty.username
                        ? team.mostRecentBounty.username
                        : 'N/A'
                    }`}
                    varient='outlined'
                  />
                </Typography>
                <Typography>
                  Claimed At:{' '}
                  {team.mostRecentBounty.claimedAt
                    ? new Date(team.mostRecentBounty.claimedAt).toDateString()
                    : 'N/A'}
                </Typography>
                <Typography>
                  Claimed By:{' '}
                  {team.mostRecentBounty.username
                    ? team.mostRecentBounty.username
                    : 'N/A'}
                </Typography>
                <Typography>
                  Recent Contributor:{' '}
                  {team.mostRecentContributer.username
                    ? team.mostRecentContributer.username
                    : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default TeamComparison
