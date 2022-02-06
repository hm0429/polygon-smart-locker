const LOCKER_ID = 0
const UNLOCK_PIN = 36 // GPIO16

// JSON credential file SHOULD NOT be added to open repo.
const FIREBASE_CREDENTIAL_PATH = "./lock3r-firebase-adminsdk-credential.json"

// Firebase
const admin = require("firebase-admin")
const serviceAccount = require(FIREBASE_CREDENTIAL_PATH)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
db = admin.firestore()

// Setup GPIO
const gpio = require('rpi-gpio')
gpio.setup(UNLOCK_PIN, gpio.DIR_OUT)

// Called when lockers data is updated
db.collection("lockers").doc(`${LOCKER_ID}`)
.onSnapshot((doc) => {
	console.log("Current data: ", doc.data())
	runLockerOperation(doc.data())
})

async function runLockerOperation(data) {
	if (!data || !data.operation) {
		return
	}

	if (data.operation === "unlock") {
		console.log("start unlock")
		unlock()
	}

	// reset
	await db.collection("lockers").doc(`${LOCKER_ID}`).set({
		operation: ""
	}, {merge: true})
}

function unlock() {
    gpio.write(UNLOCK_PIN, true)
    setTimeout(() => {
        gpio.write(UNLOCK_PIN, false)
    }, 500)
}
