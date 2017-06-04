pragma solidity ^0.4.4;

contract priced {
    modifier costs(uint price) {
        if (msg.value >= price) {
            _;
        }
    }
}

contract Shark is priced {
  // Constants
  address public owner = 0x75a7C5E64dc3e06fE546AafC7F4DcBcC6718155b;

  // Shark state
  string public sharkMessage = "Be the first one to show your stack";
  address public sharkAddress = owner;

  // Modifier to use when restriciting who can call functions
  modifier onlyBy(address _account) {
    require(msg.sender == _account);
    _;
  }

  // Declare events
  event Showed(address shark, string message);
  event PaidOff(address shark, string message);
  event NewShark(address shark, string message);
  event BalanceTransferred(address shark);

  /*
    This function is invoked when a user wants to take the top spot by value
  */
  function Show(string message) {
    // Throw if too little ether was provided
    if(msg.sender.balance <= sharkAddress.balance) throw;

    // Update state
    sharkMessage = message;
    sharkAddress = msg.sender;

    // Trigger events
    Showed(msg.sender, message);
    NewShark(msg.sender, message);
  }

  /*
    This function is invoked if a user wants to buy the top spot
  */
  function PayOff(string message) payable costs(50000000000000000) {
    // Update state
    sharkMessage = message;
    sharkAddress = msg.sender;

    // Trigger events
    PaidOff(msg.sender, message);
    NewShark(msg.sender, message);
  }

  /*
    This function is called by me to transfer out ether
  */
  function TransferEther(address destination) onlyBy(owner) {
    destination.transfer(this.balance - tx.gasprice * 21000);
    BalanceTransferred(destination);
  }

}
