// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract SmartLocker {

    mapping (address => uint) deposits;

    event Deposit(address from, uint amount);
    event Withdraw(address to, uint amount);

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
