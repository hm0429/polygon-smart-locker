// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract SmartLocker {

    struct Locker {
        string name;          // locker name used in FE
        string lat;           // used to show locker location on map
        string lon;           // used to show locker location on map
        uint fee;             // fee per second
        uint minDeposit;      // minimum deposit
        address owner;        // store locker owner
        address currentUser;  // store current user
        uint deposit;         // store deposit from current user
        uint startTime;       // block timestamp (sec)
        bool isUsing;         // true when someone uses this locker
        bool isAvailable;     // updatable by owner
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

    /***********************************************************************************
    * Locker Owner Functions
    ***********************************************************************************/

    function registerLocker(
        string memory name, 
        string memory lat, 
        string memory lon, 
        uint fee,
        uint minDeposit
    ) public payable {
        require(msg.value >= registerFee);
        deposits[contractOwner] += msg.value;
        lockers[numLockers] = Locker(
            name,
            lat,
            lon,
            fee,
            minDeposit,
            msg.sender,
            address(0x0),
            0,
            0,
            false,
            true
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

    function updateLocker(
        uint lockerId,
        string memory name, 
        string memory lat, 
        string memory lon, 
        uint fee,
        uint minDeposit,
        bool isAvailable
    ) 
        public
        onlyLockerOwner(lockers[lockerId])
    {
        Locker storage locker = lockers[lockerId];
        require(locker.isUsing == false);
        locker.name = name;
        locker.lat = lat;
        locker.lon = lon;
        locker.fee = fee;
        locker.minDeposit = minDeposit;
        locker.isAvailable = isAvailable;
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

        // Check if a user has enough deposit amount
        require(deposits[msg.sender] >= depositAmount);

        Locker storage locker = lockers[lockerId];

        // Check if a locker is used by current user
        require(hasPermissionToOperate(lockerId, locker.currentUser) == false);

        // Check if depositAmount is greater than minimum locker deposit amount
        require(depositAmount >= locker.minDeposit);

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
        
        require(msg.sender == locker.currentUser);

        uint dueAmount = (block.timestamp - locker.startTime) * locker.fee;
        if (locker.deposit >= dueAmount) {
            deposits[locker.owner] += dueAmount;
            deposits[locker.currentUser] += locker.deposit - dueAmount;
        } else {
            deposits[locker.owner] += locker.deposit;
        }
        
        locker.deposit = 0;
        locker.startTime = 0;
        locker.currentUser = address(0x0);
        locker.isUsing = false;

        emit FinishUsingLocker(msg.sender, lockerId, dueAmount);
    }

    /***********************************************************************************
    * Util Functions
    ***********************************************************************************/

    function hasPermissionToOperate(uint lockerId, address user)  public view returns (bool) {
        require(lockerId < numLockers);

        Locker storage locker = lockers[lockerId];

        if (locker.isAvailable == false) {
            return false;
        }

        uint dueAmount = (block.timestamp - locker.startTime) * locker.fee;
        if (user == locker.currentUser && locker.isUsing == true && locker.deposit >= dueAmount) {
            return true;
        }

        return false;
    }

}
