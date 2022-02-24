//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DevbulatERC20 {
    address private _owner;
    string private _name;
    string private _symbol;
    uint256 private _decimals;
    uint256 private _totalSupply;
    mapping (address => uint) private _balances;
    mapping (address => mapping (address => uint)) private _allowances;

    constructor(string memory tokenName, string memory tokenSymbol, uint256 tokenDecimals) {
         _owner = msg.sender;
         _name = tokenName;
         _symbol = tokenSymbol;
         _decimals = tokenDecimals;
         _totalSupply = 0;
    }

    function mint(address recipient, uint256 amount) public {
        require(_owner == msg.sender, "You are not owner");

        _balances[recipient] += amount;
        _totalSupply += amount;
    }

    function burn(address recipient, uint256 amount) public {
        require(_owner == msg.sender, "You are not owner");
        
        _balances[recipient] -= amount;
        _totalSupply -= amount;
    }

    function transfer(address recipient, uint256 amount ) public {
        require(amount <= _balances[msg.sender], "Not enough tokens");

        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
    }

    function transferFrom(address sender, address recipient, uint256 amount ) public {
        require(amount <= allowance(sender, recipient), "Not approved");
        require(amount <= _balances[sender], "Not enough tokens");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][recipient] -= amount;
    }

    function approve(address spender, uint256 amount ) public {
        _allowances[msg.sender][spender] = amount;
    }

    function increaseAllowance(address spender, uint256 amount ) public {
        _allowances[msg.sender][spender] += amount;
    }

    function decreaseAllowance(address spender, uint256 amount ) public {
        _allowances[msg.sender][spender] = amount > _allowances[msg.sender][spender] ? 0 : _allowances[msg.sender][spender] - amount;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint256) {
        return _decimals;
    }

    function balanceOf(address user) public view returns (uint256) {
        return _balances[user];
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
}
