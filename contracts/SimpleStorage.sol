pragma solidity ^0.4.18;

contract SimpleStorage {
  uint storedData;

  event ValueChanged();
  event ValueStored(uint x);

  function set(uint x) public {
    ValueStored(x);
    ValueChanged();
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
