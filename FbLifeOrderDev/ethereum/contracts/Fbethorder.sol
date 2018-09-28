pragma solidity ^0.4.18;

contract Fbethorder {
    event ActivityInfor(string location, string RegisterDay, string Abstract);
    uint256 constant public FEE = 0.5 ether;
    uint256 constant public ReFEE = 0.2 ether;
    mapping (uint256 => address) public id2Addr;
    mapping (address => uint256) public userId;
    mapping (address => bool) public useratt;
    address public fborder;
    address public FbWallet;
    uint256 public nowtime;
    uint256 public userAmount;
    uint256 public maxAttendees;
    uint256 public startTime;
    uint256 public endTime;
    bool public classstart;

    function Fbethorder(address _FbWallet, uint256 _maxAttendees, uint256 _startTime, string _location, string _RegisterDay, string _Abstract) public {
        FbWallet = _FbWallet;
        maxAttendees = _maxAttendees;
        userAmount = 0;
        startTime = _startTime;
        classstart = false;
        fborder = msg.sender;
        emit ActivityInfor( _location, _RegisterDay, _Abstract );
    }
    
    function getnow() public {
        nowtime = now;
    }
    
    function () payable external {
        getTicket(msg.sender);
    }

    function getTicket (address _attendee) payable public {
        require(now >= startTime && msg.value >= FEE && userId[_attendee] == 0);
        userAmount ++;
        require(userAmount <= maxAttendees);
        userId[_attendee] = userAmount;
        id2Addr[userAmount] = _attendee;
    }

    /* 發起人設定結束時間，時間使用UTC+8 */
    function EndTime(uint256 _endTime) public {
        require(FbWallet == msg.sender);       
        endTime = _endTime;
        classstart = true;
    }    
    
    function Useratt( ) public {
        /* 確定開課，確任使用者是有報名成功的出席者 */
        require(classstart == true && userId[msg.sender] != 0 && useratt[msg.sender] == false);
        useratt[msg.sender] = true;
    }
    
    /* 課程結束，準時退回押金，延遲罰款 */
    function withdraw () public {
        require(FbWallet == msg.sender);
        for(uint i = 1; i <= userAmount; i++){
            if(useratt[id2Addr[i]] == false) continue;
            /* 這邊時間要減去 UTC+8 */
            if(now <= endTime + 2 minutes){
                id2Addr[i].transfer(ReFEE);
            }else {
                id2Addr[i].transfer(ReFEE + 0.1 ether);
            }
        }
        FbWallet.transfer(this.balance);
    }
}