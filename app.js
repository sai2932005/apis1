const express = require('express')
const app = express()
const path = require('path')
const sqlite3 = require('sqlite3')

const {open} = require('sqlite')
app.use(express.json())
const dbPath = path.join(__dirname, 'cricketTeam.db')

const initializeDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server strated')
    })
  } catch (e) {
    console.log('error during initializing')
    process.exit(1)
  }
}

initializeDBServer()

app.get('/players/', async (request, response) => {
  const getAllPlayers = `SELECT * FROM cricket_team ORDER BY player_id;`

  const allPlayers = await db.all(getAllPlayers)
  response.send(allPlayers.map(eachPlayer => convertDbObj(eachPlayer)))
  console.log(allPlayers)
})
const convertDbObj = eachPlayer => {
  return {
    playerId: eachPlayer.player_id,
    playerName: eachPlayer.player_name,
    jerseyNumber: eachPlayer.jersey_number,
    role: eachPlayer.role,
  }
}
app.post('/players/', async (request, response) => {
  const playerDetailss = request.body
  const {playerName, jerseyNumber, role} = playerDetailss
  const addPlayerQuery = `
    Insert INTO cricket_team(player_name,jersey_number,role)
    VALUES (
      '${playerName}',
       ${jerseyNumber},
      '${role}'
    ); `
  const dbResponse = await db.run(addPlayerQuery)
  console.log(dbResponse)
  const playerId = dbResponse.lastId
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayer = `SELECT * FROM cricket_team
    WHERE player_id = ${playerId};`
  const dbResponse2 = await db.get(getPlayer)
  response.send(dbResponse2)
  console.log(dbResponse2)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const {playerName, jerseyNumber, role} = request.body
  const updatePlayer = `UPDATE cricket_team 
      SET 
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
      
      WHERE player_id = ${playerId};`

  const dbResponse3 = await db.run(updatePlayer)
  console.log('Player Details Updated')
  response.send('Player Details Updated')
})
