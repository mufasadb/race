import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel
} from '@mui/material'
import { Check as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material'

const ScoringEventsPage = () => {
  const [scoringEvents, setScoringEvents] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('')

  useEffect(() => {
    const fetchScoringEvents = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoring-events`
      )
      const data = await response.json()
      // You would need to implement getUserName and getScoreableName functions
      // that map the user and scoreable object IDs to their names.
      const transformedData = data.map(event => ({
        ...event,
        username: getUserName(event.user_id), // Implement this
        scoreableName: getScoreableName(event.scoreable_object_id) // Implement this
      }))
      setScoringEvents(transformedData)
    }

    fetchScoringEvents()
  }, [])
  const getUserName = async userId => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/users/${userId}`
    )
    const data = await response.json()
    return data.username
  }
  const getScoreableName = async scoreableId => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/${scoreableId}`
    )
    const data = await response.json()
    return data.name
  }

  // Sorting handlers
  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // Implement the sort function based on Material-UI's guidelines or your own sorting logic
  const sortedScoringEvents = scoringEvents.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })

  // Approval and deletion handlers
  const handleApprove = id => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoring-events/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ is_approved: true })
      }
    ).then(() => {
      window.location.reload()
    })
  }

  const handleDelete = id => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoring-events/${id}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    ).then(() => {
      window.location.reload()
    })
  }
  const columns = [
    { id: 'username', label: 'Player Username', minWidth: 170 },
    { id: 'scoreableName', label: 'Scoreable Object', minWidth: 100 },
    { id: 'timestamp', label: 'Timestamp', minWidth: 170 },
    { id: 'is_approved', label: 'Approved', minWidth: 170 },
    { id: 'point_total', label: 'Points', minWidth: 170 }
    // Add more columns as needed
  ]

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={() => handleRequestSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedScoringEvents.map(event => (
            <TableRow key={event.id}>
              <TableCell>{event.username}</TableCell>
              <TableCell>{event.scoreableName}</TableCell>
              <TableCell>{event.timestamp}</TableCell>
              <TableCell>{event.is_approved}</TableCell>
              <TableCell>{event.point_total}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleApprove(event.id)}
                  color='primary'
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(event.id)}
                  color='secondary'
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ScoringEventsPage
