const express = require('express')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')
const path = require('path')
const Rollbar = require('rollbar')

app.use(express.json())
app.use(express.static('public'))

var rollbar = new Rollbar({
  accessToken: 'f1eb49e811e44e8a8cf7251b7a99d53b',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

app.get('/', (req,res) => {
    res.status(200).sendFile(path.join(__dirname, '../assessment-qaops/public/index.html'))
  })

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
        rollbar.log('Got robots')
    } catch (error) {
        rollbar.error(error)
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        rollbar.error(error)
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
        }
        rollbar.log('successfully dueled')
    } catch (error) {
        rollbar.error(error)
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
        rollbar.log('Score Shown')
    } catch (error) {
        rollbar.error(error)
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})


app.listen(4000, () => {
  console.log(`Listening on 4000`)
})