// Additional imports
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('')
  const [existingTeams, setExistingTeams] = useState([])
  const [usersPerTeam, setUsersPerTeam] = useState([])

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/teams/`, {
        credentials: 'include'
      })
      const data = await response.json()
      console.log(data)
      setExistingTeams(data)
    }

    fetchTeams()
  }, [])

  //request users, iterate through and count team volume
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/users/`, {
        credentials: 'include'
      })
      const data = await response.json()
      //for each user, if team matches position in existing teams array
      //increment the count of users per team in same position in userPerTeam Array
      data.forEach(user => {
        existingTeams.forEach(team => {
          if (user.team === team.id) {
            setUsersPerTeam(prevState => {
              const newState = [...prevState]
              newState[team.id]++
              return newState
            })
          }
        })
      })
    }

    fetchUsers()
  }, [])

  const handleTeamNameChange = event => {
    setTeamName(event.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const csrftoken = Cookies.get('csrftoken')

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/teams/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ name: teamName }),
        credentials: 'include'
      })

      const data = await response.json()
      console.log(data)
      // Handle success, for example, resetting the form or showing a success message
    } catch (error) {
      console.error('Error creating team:', error)
      // Handle error, for example, showing an error message
    }
  }

  return (
    <div className='TeamCreation'>
      <h1>Create a new Team</h1>
      <h2>Existing Teams</h2>
      <ul>
        {existingTeams.map((team, i) => (
          <li key={team.id}>
            <span className='league-name'>Name: {team.name}</span>
            <span className='league-multiplier'>
              count of users: {usersPerTeam[i]}
            </span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='teamName'>Team Name:</label>
          <input
            type='text'
            id='teamName'
            name='teamName'
            value={teamName}
            onChange={handleTeamNameChange}
          />
        </div>
        <button type='submit'>Create Team</button>
      </form>
    </div>
  )
}

export default CreateTeam
