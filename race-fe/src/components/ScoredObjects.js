import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import UserContext from '../context/UserContext'

const ScoredObjects = () => {
  const { userId, teamId, isAdmin, isLoggedIn } = React.useContext(UserContext)

  const [scoreableObjects, setScoreableObjects] = useState([])

  useEffect(() => {
    fetchScoreableObjects()
  }, [])

  const fetchScoreableObjects = async () => {
    try {
      const responses = await Promise.all([
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}${
            process.env.REACT_APP_BACKEND_PORT
          }/scoreable-objects/available/player-bounties/${userId ? userId : 1}`
        ),
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}${
            process.env.REACT_APP_BACKEND_PORT
          }/scoreable-objects/available/team-bounties/${teamId ? teamId : 1}`
        ),
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/available/league-bounties`
        )
      ])
      const data = await Promise.all(responses.map(res => res.json()))
      setScoreableObjects(data.flat())
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label='Available Scoreable Objects'>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Points</TableCell>
            {/* Add other relevant columns as needed */}
          </TableRow>
        </TableHead>
        <TableBody>
          {scoreableObjects.map((object, index) => (
            <TableRow key={index}>
              <TableCell>{object.id}</TableCell>
              <TableCell>{object.name}</TableCell>
              <TableCell>{object.description}</TableCell>
              <TableCell>{object.points}</TableCell>
              {/* Render other object properties as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ScoredObjects

