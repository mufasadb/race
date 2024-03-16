import React, { useState, useEffect } from 'react'
import { Container, Box, CircularProgress } from '@mui/material'

const PlayerData = ({ userId }) => {
  const [playerData, setPlayerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayerData = async () => {
      // Replace this URL with your Django backend API endpoint for fetching the current user's data.
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/score/scores-by-player/` + userId + '/'
      )
      console.log(userId)
      const data = await response.json()
      setPlayerData(data)
      setLoading(false)
    }

    fetchPlayerData()
  }, [])

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container>
      <h1>Welcome, {playerData.username}!</h1>
      <p>Team: {playerData.team}</p>
      <p>Default league: {playerData.default_league}</p>
      {/* Add more player data fields as needed */}
    </Container>
  )
}
export default PlayerData
