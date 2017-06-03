pragma solidity ^0.4.4;

contract Shark {
  // Constants
  address constant public owner = 0xdcb2998d716b10d27790fea5161b297cb17994d1;

  // Shark state
  string public sharkMessage = "Be the first one to show your stack";
  address public sharkAddress = owner;

  // Modifier to user when restriciting who can call functions
  modifier onlyBy(address _account) {
    require(msg.sender == _account);
    _;
  }

  // Declare events
  event Showed(address from, string message);
  event PaidOff(address from, string message);
  event NewShark(address from, string message);

  /*
    This function is invoked when a user wants to take the top spot by value
  */
  function Show(string message) {
    // Throw if too little ether was provided
    if(msg.sender.balance < sharkAddress.balance) throw;

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
  function PayOff(string message) payable {
    //uint amountToPay = sharkAddress.balance / 1000;
    // Send all ether back if too little was provided
    /*if(msg.value < amountToPay) {
      msg.sender.transfer(msg.value);
      throw;
    }*/
    // Send some ether back if too much was provided
    /*if(msg.value > amountToPay) {
      msg.sender.transfer(msg.value - amountToPay);
    }*/

    // Update state
    sharkMessage = message;
    sharkAddress = msg.sender;

    // Trigger events
    PaidOff(msg.sender, message);
    NewShark(msg.sender, message);
  }

  /*
    This function is invoked by me to transfer the ether used in payoffs
  */
  function DrainPayOffs(address destination) onlyBy(owner) {
    destination.transfer(this.balance);
  }

}
