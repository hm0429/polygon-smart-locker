const CONTRACT_ADDRESS = "0xb3440d27eA11c74546bB85d2477AE0DCa8083F4e"
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"lockerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"dueAmount","type":"uint256"}],"name":"FinishUsingLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"RegisterLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"lockerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"depositAmount","type":"uint256"}],"name":"StartUsingLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"}],"name":"canStartUsingLocker","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"}],"name":"finishUsingLocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"hasPermissionToOperate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lockers","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"lat","type":"string"},{"internalType":"string","name":"lon","type":"string"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"minDeposit","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"currentUser","type":"address"},{"internalType":"uint256","name":"deposit","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"bool","name":"isUsing","type":"bool"},{"internalType":"bool","name":"isAvailable","type":"bool"},{"internalType":"bool","name":"isPaused","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numLockers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registerFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"lat","type":"string"},{"internalType":"string","name":"lon","type":"string"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"minDeposit","type":"uint256"}],"name":"registerLocker","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"uint256","name":"depositAmount","type":"uint256"}],"name":"startUsingLocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newContractOwner","type":"address"}],"name":"updateContractOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"bool","name":"isAvailable","type":"bool"}],"name":"updateLockerAvailability","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"updateLockerFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"uint256","name":"newMinDeposit","type":"uint256"}],"name":"updateLockerMinDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"updateLockerOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"bool","name":"isPaused","type":"bool"}],"name":"updateLockerPauseStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"updateRegisterFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

// Mumbai
const CHAIN_ID = "0x13881"	
const CHAIN_NAME = "Matic Mumbai"
const RPC_URL = "https://rpc-mumbai.matic.today"
const EXPLORER_URL = "https://mumbai.polygonscan.com/"

window.account = null

async function getChainId() {
	return await window.ethereum.request({method: 'eth_chainId'})
}

async function addNetwork() {
	await window.ethereum.request({
			method: 'wallet_addEthereumChain',
			params: [{
				chainId: CHAIN_ID,
				chainName: CHAIN_NAME,
				rpcUrls: [RPC_URL],
				nativeCurrency: {
				name: "MATIC",
				symbol: "MATIC",
				decimals: 18
			},
			blockExplorerUrls: [EXPLORER_URL]
		}]
	})	
}

async function changeNetwork() {
	await window.ethereum.request({
		method: 'wallet_switchEthereumChain',
		params: [{ chainId: CHAIN_ID }]
	})	
}

async function onConnectWalletButtonClick() {

	if (typeof window.ethereum === 'undefined') {
 		alert("MetaMask should be installed to use LOCK3R")
 		return
	}

	const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
	window.account = accounts[0]
}

function registerWeb3Callbacks() {
	ethereum.on('accountsChanged', function (accounts) {
		console.log("accountsChanged", accounts[0])
		window.account = accounts[0]
		if (window.account) {
			onWalletConnect()
		} else {
			onWalletDisconnect()
		}
	})
}

function prepWeb3() {
	console.log("prepWeb3")

	if (typeof window.ethereum === 'undefined') {
 		alert("MetaMask should be installed to use LOCK3R")
 		return
	}

	registerWeb3Callbacks()

	console.log(ethereum.selectedAddress)

	if (ethereum.selectedAddress) {
		window.account = ethereum.selectedAddress
		onWalletConnect()
	}
}

async function onWalletConnect() {
	console.log("onWalletConnect")
	$('#connect-wallet-button').hide()
	$('#nav-info-wallet').show()
	$('#nav-info-wallet').text(window.account)

	const chainId = await getChainId()
	if (chainId !== CHAIN_ID) {
		await changeNetwork()
		.catch(async (error) => {
			await addNetwork()
			await changeNetwork()
		})
	}
}

function onWalletDisconnect() {
	console.log("onWalletDisconnect")
	$('#connect-wallet-button').show()
	$('#nav-info-wallet').hide()
}

$(()=> {
	prepWeb3()
})