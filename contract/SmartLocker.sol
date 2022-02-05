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
        bool isAvailable;       // updatable by owner
        bool isPaused;          // updatable by contractOwner
    }

    address contractOwner;
    uint registerFee;           // fee for registering a new locker
    mapping (address => uint) deposits;
    
    event Deposit(address from, uint amount);
    event Withdraw(address to, uint amount);

    constructor () {
        contractOwner = msg.sender;
        registerFee = 1 ether;      // 1 MATIC on Polygon
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner);
        _;
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
