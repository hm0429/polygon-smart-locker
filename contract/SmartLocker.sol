// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract SmartLocker {

    struct Locker {
        string name;
        string lat;
        string lon;
        uint fee;
        address owner;
        address currentUser;
        bool isAvailable;                   // updatable by owner
        bool isPaused;                      // updatable by contractOwner
    }

    address contractOwner;
    uint registerFee;                       // fee for registering a new locker
    mapping (uint => Locker) lockers;
    uint numLockers;
    mapping (address => uint) deposits;

    /***********************************************************************************
    * Events
    ***********************************************************************************/
    
    event RegisterLocker(address owner, uint id);
    event Deposit(address from, uint amount);
    event Withdraw(address to, uint amount);
    
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
        uint fee
    ) public payable {
        require(msg.value >= registerFee);
        deposits[contractOwner] += msg.value;
        lockers[numLockers] = Locker(
            name, lat, lon, fee, msg.sender, address(0x0), true, false
        );
        emit RegisterLocker(msg.sender, numLockers);
        numLockers++;
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

}
