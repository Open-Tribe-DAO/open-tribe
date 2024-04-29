// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenTribeToken is ERC20, ERC20Burnable, Ownable {
    constructor(address initialOwner) ERC20("OTToken", "OTTO") Ownable(initialOwner) {
        transferOwnership(msg.sender); 
    }


    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
