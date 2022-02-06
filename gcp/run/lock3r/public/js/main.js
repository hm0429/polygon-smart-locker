const CONTRACT_ADDRESS = "0x873660367c0dfa9f7F532C52639c2eB721Bf5A5c"
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"lockerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"dueAmount","type":"uint256"}],"name":"FinishUsingLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"RegisterLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"lockerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"depositAmount","type":"uint256"}],"name":"StartUsingLocker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"}],"name":"finishUsingLocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"hasPermissionToOperate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lockers","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"lat","type":"string"},{"internalType":"string","name":"lon","type":"string"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"minDeposit","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"currentUser","type":"address"},{"internalType":"uint256","name":"deposit","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"bool","name":"isUsing","type":"bool"},{"internalType":"bool","name":"isAvailable","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numLockers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registerFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"lat","type":"string"},{"internalType":"string","name":"lon","type":"string"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"minDeposit","type":"uint256"}],"name":"registerLocker","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"uint256","name":"depositAmount","type":"uint256"}],"name":"startUsingLocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newContractOwner","type":"address"}],"name":"updateContractOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"lat","type":"string"},{"internalType":"string","name":"lon","type":"string"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"minDeposit","type":"uint256"},{"internalType":"bool","name":"isAvailable","type":"bool"}],"name":"updateLocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockerId","type":"uint256"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"updateLockerOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"updateRegisterFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

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
	await initContract()
	loadWeb3AccountInfo()
	loadLockers()
}

function onWalletDisconnect() {
	console.log("onWalletDisconnect")
	$('#connect-wallet-button').show()
	$('#nav-info-wallet').hide()
}

async function loadLockers() {
	// showLoading()
	const numLockers = (await contract.numLockers()).toNumber()
	console.log(numLockers)
	window.lockers = []
	for (let i = 0; i < numLockers; i++) {
		const locker = await contract.lockers(i)
		lockers.push({...locker, id: i})
	}
	renderMap(lockers)
	// hideLoading()
}

/***********************************************************************************
* Utils
***********************************************************************************/

function getPosition(locker) {
	return {lat: parseFloat(locker.lat), lng: parseFloat(locker.lon)}
}

function getDateString(timestamp) {
	return moment(timestamp.toDate()).format('YYYY-MM-DD HH:mm')
}

function isSameAddress(a, b) {
	return ethers.utils.getAddress(a) === ethers.utils.getAddress(b)
}

/***********************************************************************************
* UI - Maps
***********************************************************************************/

function getInfoWindow(locker) {
	console.log(locker)
	const contentString = `
	<span class="marker-info">
	<p>name: ${locker.name}</p>
	<p>fee per sec: ${ethers.utils.formatEther(locker.fee)} MATIC</p>
	<p>min deposit: ${ethers.utils.formatEther(locker.minDeposit)} MATIC</p>
	<button class="btn btn-outline-info btn-sm" onclick="onShowLockerClick(${locker.id})">Use this locker</button>
	</span>
	`
	const infoWindow = new google.maps.InfoWindow({
    	content: contentString,
  	})
  	return infoWindow
}


function addMarker(map, locker) {
	const marker = new google.maps.Marker({
    	position: getPosition(locker),
    	map: map,
    	animation: google.maps.Animation.DROP,
    	title: locker.name
  	})
  	marker.addListener('click', () => {
    	if (window.currentInfoWindow) window.currentInfoWindow.close()
  		window.currentInfoWindow = getInfoWindow(locker)
  		window.currentInfoWindow.open({
  			anchor: marker,
  			map,
  			shouldFocus: false
  		})
	})
}

function renderMap(lockers) {

	if (lockers.length < 1) {
		return
	}

	window.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: {
			lat: parseFloat(lockers[0].lat), 
			lng: parseFloat(lockers[0].lon)
		},
	})
	map.addListener('click', function() {
    	if (window.currentInfoWindow) window.currentInfoWindow.close()
	})

	lockers.forEach((locker, index) => {
		addMarker(window.map, locker)
	})
}


/***********************************************************************************
* Smart Contract Interaction
***********************************************************************************/

async function initContract() {
	if (window.contract) {
		return
	}
	const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
	await provider.send("eth_requestAccounts", []);
	const signer = provider.getSigner();
	window.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
	registerContractEvent()
}

function registerContractEvent() {
	contract.on("Deposit", (from, amount) => {
		console.log("Event: Deposit")
		if (isSameAddress(from, account)) {
			loadWeb3AccountInfo()
		}
 	})

	contract.on("StartUsingLocker", (user, lockerId, depositAmount) => {
		console.log("Event: StartUsingLocker")
		let i = lockerId.toNumber()
		if (isSameAddress(user, account) 
			&& i === window.currentLockerId) {
			loadWeb3AccountInfo()
			updateLocker(i)
			alert("You are now able to unlock the locker.")
		}
 	})

	contract.on("FinishUsingLocker", (user, lockerId, dueAmount) => {
		console.log("Event: FinishUsingLocker")
		let i = lockerId.toNumber()
		if (isSameAddress(user, account) 
			&& i === window.currentLockerId) {
			loadWeb3AccountInfo()
			updateLocker(i)
			alert("Finished using locker.")
		}
 	})
}

async function loadWeb3AccountInfo() {
	const deposit = await contract.deposits(account)
	$('#deposit-balance').val(ethers.utils.formatEther(deposit))
}

async function updateLocker(lockerId) {
	const locker = await contract.lockers(lockerId)
	lockers[lockerId] = {...locker, id: lockerId}
	refreshLockerUI(lockerId)
}

/***********************************************************************************
* UI
***********************************************************************************/

function showLoading() {
	$('#loading ,#spinner').height($(window).height()).css('display', 'block')
}

function hideLoading() {
	$('#loading ,#spinner').height($(window).height()).css('display', 'none')
}

function refreshLockerUI(lockerId) {
	const locker = lockers[lockerId]
	if (locker.isUsing === true 
		&& ethers.utils.getAddress(locker.currentUser) 
			=== ethers.utils.getAddress(account)) 
	{
		$('#locker-start').hide()
		$('#locker-operation').show()
	} else {
		$('#locker-start').show()
		$('#locker-operation').hide()
	}
	$('#locker-id').val(locker.id)
	$('#locker-name').text(locker.name)
	$('#locker-fee').text(`fee: ${ethers.utils.formatEther(locker.fee)} MATIC / sec`)
	$('#locker-min-deposit').text(`minimum deposit: ${ethers.utils.formatEther(locker.minDeposit)} MATIC`)
	$('#locker-modal').modal('show')
}

/***********************************************************************************
* API Call
***********************************************************************************/

async function getChallenge(lockerId) {
	const url = `/challenge/${lockerId}`
	return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "GET",
      async: true,
      contentType: "application/json",
      dataType: "json",
    }).then(
      function (result) {
      	console.log("result:",result)
        resolve(result)
      },
      function () {
      	console.log("reject")
        reject()
      }
    )
	})
}

async function unlock(lockerId, signature) {
	const url = `/unlock/${lockerId}`
	return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      async: true,
      contentType: "application/json",
      data:JSON.stringify({signature}),
      dataType: "json",
    }).then(
      function (result) {
      	console.log("result:",result)
        resolve(result)
      },
      function () {
      	console.log("reject")
        reject()
      }
    )
	})
}

/***********************************************************************************
* User Action
***********************************************************************************/

async function onConnectWalletButtonClick() {
	if (typeof window.ethereum === 'undefined') {
 		alert("MetaMask should be installed to use LOCK3R")
 		return
	}

	const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
	window.account = accounts[0]
	
	if (account) {
		onWalletConnect()
	}

}

async function onAddDepositClick() {
	let amount = $('#add-deposit-input').val()
	if(!amount) {
		return
	}
	amount = ethers.utils.parseEther(amount)
	contract.deposit({value: amount})
	.then((tx) => {
		console.log(tx)
		alert(`transaction sent: ${tx.hash}`)
	})
}

function onShowLockerClick(lockerId) {
	window.currentLockerId = lockerId
	refreshLockerUI(lockerId)
}

function onStartUsingLockerButtonClick() {
	let lockerId = $('#locker-id').val()
	let depositAmount = $('#locker-deposit-input').val()
	depositAmount = ethers.utils.parseUnits(depositAmount)
	contract.startUsingLocker(lockerId, depositAmount)
	.then((tx) => {
		console.log(tx)
		alert(`transaction sent: ${tx.hash}`)
	})
}

async function onUnlockButtonClick() {
	let lockerId = $('#locker-id').val()
	const challenge = (await getChallenge(lockerId)).challenge

	// Sign challenge
	const web3 = new Web3(ethereum)
	const signature = await web3.eth.personal.sign(challenge, account)

	const unlockResult = await unlock(lockerId, signature)
	.catch((error) => {
		alert("You don't have permission to unlock")
	})
}

function onFinishUsingLockerButtonClick() {
	let lockerId = $('#locker-id').val()
	contract.finishUsingLocker(lockerId)
	.then((tx) => {
		console.log(tx)
		alert(`transaction sent: ${tx.hash}`)
	})
}

$(()=> {
	prepWeb3()
})