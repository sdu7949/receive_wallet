pragma solidity ^0.5.12;
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";
    
contract BboomContract{
    using SafeMath for uint256;
    uint256 BBCprice = 50;
    uint256 totalSupply_;
    address admin;
    
    constructor(uint256 total) public {  // contract constructor address have all toekn
       admin = msg.sender;
       totalSupply_ = total;
       balances[msg.sender] = totalSupply_;
    }
    
    string public constant name = "BboomCoin";
    string public constant symbol = "BBC";
    uint8 public constant decimals = 3;
    
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
    
    function totalSupply() external view returns (uint256) { 
      return totalSupply_;
    }
    
    function balanceOf(address _user) public view returns (uint) {
      return balances[_user];
    }
    function transfer(address _sender,address _receiver, uint _value) imOwner public returns (bool) {
      require(_value <= balances[_sender]);
      balances[_sender] = balances[_sender].sub(_value);
      balances[_receiver] = balances[_receiver].add(_value);
      emit Transfer(_sender, _receiver, _value);
      return true;
    }
    
    function approve(address _sender,address _delegate, uint _value) public returns (bool) {
      allowed[_sender][_delegate] = _value;
      emit Approval(_sender, _delegate, _value);
      return true;
    }
    
    function allowance(address owner, address delegate) public view returns (uint) {
      return allowed[owner][delegate];
    }
    
    function transferFrom(address _owner,address _delegate, address _buyer, uint _value) public returns (bool) {
      require(_value <= balances[_owner]);
      require(_value <= allowed[_owner][_delegate]);
      balances[_owner] = balances[_owner].sub(_value);
      allowed[_owner][_delegate] = allowed[_owner][_delegate].sub(_value);
      balances[_buyer] = balances[_buyer].add(_value);
      emit Transfer(_owner, _buyer, _value);
      return true;
    }
    
    function adminBalance() public view returns (uint256){ //check admin token 
        return balances[admin];
    }
    
    function petDataCollect(address _petOwner) external returns(bool){
        uint256 rewardBBC = 10;
        require(rewardBBC <= balances[admin]);
        balances[_petOwner] = balances[_petOwner].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _petOwner, rewardBBC);
        return true;
    }
    
    function productPurchaseReward10(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = _price.div(10); // price / 10%
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward20(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(2); // price / 10 * 2
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward30(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(3); // price / 10 * 3
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward40(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(4); // price / 10 * 4
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward50(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(5); // price / 10 * 5
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward60(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(6); // price / 10 * 6
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward70(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(7); // price / 10 * 7
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward80(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(8); // price / 10 * 8
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward90(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(9); // price / 10 * 9
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward100(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = _price; // price
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= balances[admin]);
        balances[_buyer] = balances[_buyer].add(rewardBBC);
        balances[admin] = balances[admin].sub(rewardBBC);
        emit Transfer(admin, _buyer, rewardBBC);
        return true;
    }

}