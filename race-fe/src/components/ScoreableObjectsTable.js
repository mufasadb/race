import React, { useState, useEffect } from 'react'

const ScoreableObjectsTable = () => {
  const [scoreableEvents, setScoreableEvents] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage] = useState(10) // Adjust as needed

  useEffect(() => {
    const fetchScoreableEvents = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/`
      )
      const data = await response.json()
      setScoreableEvents(data)
      console.log(data)
    }

    fetchScoreableEvents()
  }, [])

  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = scoreableEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  )

  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (
    <div>
      <h2>Existing Scoreable Events</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Requires Evidence</th>
            <th>League Multiplier</th>
            <th>Points</th>
            <th>submittable_type</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map(event => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{event.requiresEvidence ? 'Yes' : 'No'}</td>
              <td>{event.leagueMultiplier ? 'Yes' : 'No'}</td>
              <td>{event.points}</td>
              <td>{event.submittableType}</td>
              <td>
                <button
                  onClick={() => {
                    // Handle delete
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(scoreableEvents.length / eventsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ScoreableObjectsTable
