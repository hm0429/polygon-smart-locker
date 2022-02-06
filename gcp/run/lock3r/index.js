const CONTRACT_ADDRESS = "0x3C42DE4dF9fD5CEe977D4e80Aa8D97b4E200027f"
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"lockerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"dueAmount","type":"uint256"}],"name":"FinishUsingLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"RegisterLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"lockerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"depositAmount","type":"uint256"}],"name":"StartUsingLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"}],"name":"canStartUsingLocker","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"}],"name":"finishUsingLocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"hasPermissionToOperate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lockers","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"lat","type":"string"},{"internalType":"string","name":"lon","type":"string"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"minDeposit","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"currentUser","type":"address"},{"internalType":"uint256","name":"deposit","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"bool","name":"isUsing","type":"bool"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"bool","name":"isPaused","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numLockers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registerFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"lat","type":"string"},{"internalType":"string","name":"lon","type":"string"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"minDeposit","type":"uint256"}],"name":"registerLocker","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"uint256","name":"depositAmount","type":"uint256"}],"name":"startUsingLocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newContractOwner","type":"address"}],"name":"updateContractOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"bool","name":"isAvailable","type":"bool"}],"name":"updateLockerAvailability","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"updateLockerFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"uint256","name":"newMinDeposit","type":"uint256"}],"name":"updateLockerMinDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"updateLockerOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"bool","name":"isPaused","type":"bool"}],"name":"updateLockerPauseStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"updateRegisterFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const PROVIDER_URL = "https://polygon-mumbai.infura.io/v3/ffde347530eb4101a92175bbd4120866"

// JSON credential file SHOULD NOT be added to open repo.
const FIREBASE_CREDENTIAL_PATH = "./lock3r-firebase-adminsdk-credential.json"

const crypto = require("crypto")

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

// ethers
const ethers = require('ethers')
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

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

async function updateChallenge(lockerId) {
	const challenge = crypto.randomBytes(32).toString("hex")
	const ref = db.collection('lockers').doc(`${lockerId}`)
	await ref.set({
		challenge: challenge
	}, {merge: true})
	return challenge
}

async function verify(lockerId, signature) {
	const ref = await db.collection('lockers').doc(`${lockerId}`).get()
	if (!ref.exists) {
		return false
	}
	const challenge = ref.data().challenge
 	const address = ethers.utils.verifyMessage(challenge, signature)
 	console.log(address)

	await updateChallenge(lockerId)

	const result = await contract.hasPermissionToOperate(`${lockerId}`, address)
	.catch((e) => {
		console.log(e)
		return false
	})

	return result
}

app.get('/challenge/:lockerId(\\d+)', async (req, res) => {
	const lockerId = Number(req.params.lockerId)
	const challenge = await updateChallenge(lockerId)
	res.json({challenge:challenge})
})

app.post('/unlock/:lockerId(\\d+)', async (req, res) => {
	const lockerId = Number(req.params.lockerId)
	const signature = req.body.signature
	const verifyResult = await verify(lockerId, signature)
	if (!verifyResult) {
		res.status(400).json({message: "error"})
		return
	}
	const ref = db.collection('lockers').doc(`${lockerId}`)
	await ref.set({
		operation: 'unlock',
	}, {merge: true})
	res.status(200).json({message: "ok"})
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Listening on port', port)
})