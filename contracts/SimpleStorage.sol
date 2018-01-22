pragma solidity ^0.4.18;

contract SimpleStorage {
  uint storedData;

  event ValueStored(uint x);

  function set(uint x) public {
    storedData = x;
    ValueStored(x);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
