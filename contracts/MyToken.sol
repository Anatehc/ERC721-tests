//SPDX-License-Identifier:Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 public mintRate = 0.01 ether;
    uint public MAX_SUPPLY = 5;

    constructor() ERC721("MyToken", "MTK")
    {}

    function _baseURI() internal pure override returns (string memory){
        return "https://api.MyToken.com/tokens/";

    }

    function safeMint(address to) public{
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());

    }

    // following functions are overrides required by solidity

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
     internal
     override(ERC721,ERC721Enumerable)
     {
         super._beforeTokenTransfer(from, to, tokenId);

     }

     function supportsInterface(bytes4 interfaceId)
     public
     view
     override (ERC721,ERC721Enumerable)
     returns(bool)
     {
         return super.supportsInterface(interfaceId);

     }

     function withdraw() public onlyOwner{
         require(address(this).balance>0, "balance is zero");
         payable(owner()).transfer(address(this).balance);
     }

}



