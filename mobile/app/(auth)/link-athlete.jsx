import { View, Text } from 'react-native'
import { useEffect, useState } from 'react'
import React from 'react'

// const API_URL = "https://localhost:5001/api"
const API_URL = "https://boba-app-api.onrender.com/api"

const linkathlete = () => {

  const [athletes, setAthletes] = useState([])
  const [selectedAthlete, setSelectedAthlete] = useState('')

  useEffect(() => {
    
    async function getAllAthletes() {
      try {
        const res = await fetch(`${API_URL}/athletes`)

        if (res.ok) {
          const data = await res.json();
          setAthletes(data)
        } else {
          console.log('Error fetching all athletes')
        }
      } catch (error) {
        console.error(error)
      }
    }

    getAllAthletes()

  }, [])

  console.log(athletes)
  

  return (
    <View>
      <Text>Hello this is the link athlete page</Text>
    </View>
  )
}

export default linkathlete