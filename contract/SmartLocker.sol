// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract SmartLocker {

    struct Locker {
        string name;
        string lat;
        string lon;
        uint fee;                               // fee per second
        uint minTime;                           // minimum time to use the locker (sec)
        address owner;
        address currentUser;
        uint deposit;
        uint startTime;                         // block timestamp (sec)
        bool isUsing;                           // updatable by user
        bool isAvailable;                       // updatable by owner
        bool isPaused;                          // updatable by contractOwner
    }

    address public contractOwner;
    uint public registerFee;                    // fee for registering a new locker
    mapping (uint => Locker) public lockers;
    uint public numLockers;
    mapping (address => uint) public deposits;

    /***********************************************************************************
    * Events
    ***********************************************************************************/
    
    event RegisterLocker(address owner, uint id);
    event Deposit(address from, uint amount);
    event Withdraw(address to, uint amount);
    event StartUsingLocker(address user, uint lockerId, uint depositAmount);
    event FinishUsingLocker(address user, uint lockerId, uint dueAmount);

    /***********************************************************************************
    * Modifiers
    ***********************************************************************************/

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    modifier onlyLockerOwner(Locker storage locker) {
        require(msg.sender == locker.owner);
        _;
    } 

    /***********************************************************************************
    * Contract Owner Functions
    ***********************************************************************************/

    constructor () {
        contractOwner = msg.sender;
        registerFee = 1 ether;      // 1 MATIC on Polygon
    }

    function updateContractOwner(address newContractOwner) 
        public
        onlyContractOwner
    {
        require(newContractOwner != address(0x0));
        contractOwner = newContractOwner;
    }

    function updateRegisterFee(uint newFee)
        public
        onlyContractOwner
    {
        registerFee = newFee;
    }

    function updateLockerPauseStatus(uint lockerId, bool isPaused)
        public
        onlyContractOwner
    {
        lockers[lockerId].isPaused = isPaused;   
    }

    /***********************************************************************************
    * Locker Owner Functions
    ***********************************************************************************/

    function registerLocker(
        string memory name, 
        string memory lat, 
        string memory lon, 
        uint fee,
        uint minTime
    ) public payable {
        require(msg.value >= registerFee);
        deposits[contractOwner] += msg.value;
        lockers[numLockers] = Locker(
            name,
            lat,
            lon,
            fee,
            minTime,
            msg.sender,
            address(0x0),
            0,
            0,
            false,
            true,
            false
        );
        emit RegisterLocker(msg.sender, numLockers);
        numLockers++;
    }

    function updateLockerOwner(uint lockerId, address newOwner) 
        public
        onlyLockerOwner(lockers[lockerId])
    {
        require(newOwner != address(0x0));
        lockers[lockerId].owner = newOwner;
    }


    function updateLockerFee(uint lockerId, uint newFee) 
        public 
        onlyLockerOwner(lockers[lockerId])
    {
        require(lockers[lockerId].isUsing == false);
        lockers[lockerId].fee = newFee;
    }

    function updateLockerMinTime(uint lockerId, uint newMinTime) 
        public 
        onlyLockerOwner(lockers[lockerId])
    {
        require(lockers[lockerId].isUsing == false);
        lockers[lockerId].minTime = newMinTime;
    }

    function updateLockerAvailability(uint lockerId, bool isAvailable) 
        public
        onlyLockerOwner(lockers[lockerId])
    {
        require(lockers[lockerId].isUsing == false);
        lockers[lockerId].isAvailable = isAvailable;
    }

    /***********************************************************************************
    * User Functions
    ***********************************************************************************/

    function balance() public view returns (uint) {
        return deposits[address(msg.sender)];
    }

    function deposit() public payable {
        deposits[address(msg.sender)] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public {
        uint amount = deposits[address(msg.sender)];
        deposits[address(msg.sender)] = 0;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function startUsingLocker(uint lockerId, uint256 depositAmount) public {
        require(lockerId < numLockers);

        // Check if depositAmount is greater than minimum locker deposit amount
        require(depositAmount >= minLockerDepositAmount(lockerId));

        // Check if a user has enough deposit amount
        require(deposits[msg.sender] >= depositAmount);

        // Check if a locker can be used.
        require(canStartUsingLocker(lockerId) == true);

        Locker storage locker = lockers[lockerId];
        
        // collect deposit if it remains
        deposits[locker.owner] += locker.deposit;

        // store new deposit
        deposits[msg.sender] -= depositAmount;
        locker.deposit = depositAmount;

        locker.currentUser = msg.sender;
        locker.isUsing = true;
        locker.startTime = block.timestamp;

        emit StartUsingLocker(msg.sender, lockerId, depositAmount);
    }

    function finishUsingLocker(uint lockerId) public {
        require(lockerId < numLockers);
        
        Locker storage locker = lockers[lockerId];
        
        require(locker.isPaused == false);
        require(msg.sender == locker.currentUser);

        uint timePassed = block.timestamp - locker.startTime;
        require(timePassed >= locker.minTime);

        uint dueAmount = timePassed * locker.fee;
        require(locker.deposit >= dueAmount);

        deposits[locker.owner] += dueAmount;
        deposits[locker.currentUser] += locker.deposit - dueAmount;
        
        locker.deposit = 0;
        locker.startTime = 0;
        locker.currentUser = address(0x0);
        locker.isUsing = false;

        emit FinishUsingLocker(msg.sender, lockerId, dueAmount);
    }

    /***********************************************************************************
    * Util Functions
    ***********************************************************************************/

    function canStartUsingLocker(uint lockerId) public view returns (bool) {
        require(lockerId < numLockers);
        Locker storage locker = lockers[lockerId];

        if (locker.isAvailable == false || locker.isPaused == true) {
            return false;
        }

        if (locker.isUsing == false) {
            return true;
        }

        // Locker can be used when due amount exceeds deposit amount
        uint dueAmount = (block.timestamp - locker.startTime) * locker.fee;
        if (locker.isUsing == true && locker.deposit < dueAmount) {
            return true;
        }

        return false;
    }

    function hasPermissionToOperate(uint lockerId, address user)  public view returns (bool) {
        require(lockerId < numLockers);

        Locker storage locker = lockers[lockerId];

        if (locker.isAvailable == false || locker.isPaused == true) {
            return false;
        }

        uint dueAmount = (block.timestamp - locker.startTime) * locker.fee;
        if (user == locker.currentUser && locker.isUsing == true && locker.deposit >= dueAmount) {
            return true;
        }

        return false;
    }

    function minLockerDepositAmount(uint256 lockerId) public view returns (uint) {
        require(lockerId < numLockers);
        Locker storage locker = lockers[lockerId];
        return locker.fee * locker.minTime;
    }
}
