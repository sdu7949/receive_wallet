pragma solidity ^0.5.0;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./ERC20Burnable.sol";


contract BboomToken is ERC20, ERC20Detailed, ERC20Burnable {
    uint8 public constant DECIMALS = 3;
    uint256 public constant INITIAL_SUPPLY = 10000000000 * (10 ** uint256(DECIMALS));
    
    constructor () public ERC20Detailed("BboomToken", "BBC", DECIMALS) {
        _mint(msg.sender,INITIAL_SUPPLY);
    }
}