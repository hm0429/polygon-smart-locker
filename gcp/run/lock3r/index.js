
// JSON credential file SHOULD NOT be added to open repo.
const FIREBASE_CREDENTIAL_PATH = "./lock3r-firebase-adminsdk-credential.json"

// Firebase
const admin = require("firebase-admin")
const serviceAccount = require(FIREBASE_CREDENTIAL_PATH)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
db = admin.firestore()

// Express
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('public'))
app.set('view engine', 'pug')
app.use(express.json())

app.get('/', (req, res) => {
	res.render('index')
})

// TODO: remove test
app.get('/test', async (req, res) => {
	await db.collection('lockers').doc('0').set({
		operation: 'unlock'
	}, {merge: true})
	res.json({message: 'ok'})
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Listening on port', port)
})