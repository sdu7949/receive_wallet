pragma solidity ^0.5.12;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./ERC20Burnable.sol";
    
contract BboomContract is ERC20, ERC20Detailed, ERC20Burnable{
    using SafeMath for uint256;
    
    uint256 totalSupply_;
    address admin;

    uint256 public constant INITIAL_SUPPLY = 10000000000 * (10 ** uint256(3));
    
    constructor () public ERC20Detailed("BboomCoin", "BBC", 3) {
        admin = msg.sender;
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = totalSupply_;
        _mint(msg.sender,INITIAL_SUPPLY);
    }

    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
    event Approval(address indexed _tokenOwner, address indexed _spender, uint _value);
    event Transfer(address indexed _sender, address indexed _receiver, uint _value);
    
    modifier imOwner{
        msg.sender == admin;
        _;
    }
    
    function adminAddress() external view returns(address){
        return admin;
    }

}