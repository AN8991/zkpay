// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract zkMessages {
    string[] private messages;
    IERC20 public fidToken;

    // Event to acknowledge a new message
    event MessageReceived(string);

    constructor(address _fidTokenAddress) {
        // Validate the FidToken address
        require(_fidTokenAddress != address(0), "Invalid FidToken address");
        
        // Set the FidToken contract
        fidToken = IERC20(_fidTokenAddress);
        
        // Emit initial message
        emit MessageReceived("The second DeFi run for zkSync!");
    }

    function sendMessage(string memory _message) public {
        messages.push(_message);

        // Acknowledge the message receipt with a response from zkMessages
        emit MessageReceived("Message received!");
    }

    // Function to count the total messages sent to zkMessages
    function getTotalMessages() public view returns (uint256) {
        return messages.length;
    }

    // Function to return the last message sent to the zkMessages
    function getLastMessage() public view returns (string memory) {
        require(messages.length > 0, "No messages sent yet!");
        return messages[messages.length - 1];
    }
}
