pragma solidity ^0.5.0;

import "./IERC20.sol";
import "./SafeMath.sol";

/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20Mintable}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin guidelines: functions revert instead
 * of returning `false` on failure. This behavior is nonetheless conventional
 * and does not conflict with the expectations of ERC20 applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20 is IERC20 {
    uint256 BBCprice = 50;
    
    using SafeMath for uint256;

    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 private _totalSupply;

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address _receiver, uint256 _value) public returns (bool) {
        _transfer(msg.sender, _receiver, _value);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        // transfer이후의 approve는 msg.sender가 _sender로부터 승인받은 금액을 차감하는 로직인데, 나는 뺏다
        //_approve(sender,msg.sender, _allowances[sender][msg.sender].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    // function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    //     _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
    //     return true;
    // }

    // function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    //     _approve(msg.sender, spender, _allowances[msg.sender][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
    //     return true;
    // }

    function _transfer(address _sender, address _receiver, uint256 _value) internal {
        require(_sender != address(0), "ERC20: transfer from the zero address");
        require(_receiver != address(0), "ERC20: transfer to the zero address");
        require(_value <= _balances[_sender]);
        _balances[_sender] = _balances[_sender].sub(_value, "ERC20: transfer amount exceeds balance");
        _balances[_receiver] = _balances[_receiver].add(_value);
        emit Transfer(_sender, _receiver, _value);
    }
    
    function petDataCollect(address _petOwner) external returns(bool){
        uint256 rewardBBC = 10;
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_petOwner] = _balances[_petOwner].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _petOwner, rewardBBC);
        return true;
    }
    
    function productPurchaseReward10(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = _price.div(10); // price / 10%
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward20(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(2); // price / 10 * 2
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward30(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(3); // price / 10 * 3
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward40(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(4); // price / 10 * 4
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward50(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(5); // price / 10 * 5
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward60(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(6); // price / 10 * 6
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward70(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(7); // price / 10 * 7
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward80(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(8); // price / 10 * 8
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward90(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = (_price.div(10)).mul(9); // price / 10 * 9
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }
    
    function productPurchaseReward100(uint _price,address _buyer) external returns (bool){  
        require(_price >= 0);
        uint256 reward = _price; // price
        uint256 rewardBBC = reward.div(50); // reward / 50 
        require(rewardBBC <= _balances[msg.sender]);
        _balances[_buyer] = _balances[_buyer].add(rewardBBC);
        _balances[msg.sender] = _balances[msg.sender].sub(rewardBBC);
        emit Transfer(msg.sender, _buyer, rewardBBC);
        return true;
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        _approve(account, msg.sender, _allowances[account][msg.sender].sub(amount, "ERC20: burn amount exceeds allowance"));
    }
}