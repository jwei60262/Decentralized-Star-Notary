pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 

    struct Star { 
        string name;
        string ra;
        string dec;
        string mag;
        string story;
    }

    // Mapping from token ID to star
    mapping(uint256 => Star) public tokenIdToStarInfo;

    // Mapping from token ID to star cost
    mapping(uint256 => uint256) public starsForSale;

    // Mapping from star to existed
    mapping(string => bool) private starExisted;

    function createStar(string name, string ra, string dec, 
        string mag, string story, uint256 tokenId) public {
        require(!checkIfStarExist(ra, dec, mag), "The star has already existed!");
        starExisted[configureUniquenessWithStars(ra, dec, mag)] = true;

        Star memory newStar = Star(name, ra, dec, mag, story);
        tokenIdToStarInfo[tokenId] = newStar;

        _mint(msg.sender, tokenId);
    }

    function putStarUpForSale(uint256 tokenId, uint256 price) public { 
        require(this.ownerOf(tokenId) == msg.sender);

        starsForSale[tokenId] = price;
    }

    function buyStar(uint256 tokenId) public payable { 
        require(starsForSale[tokenId] > 0);

        uint256 starCost = starsForSale[tokenId];
        address starOwner = this.ownerOf(tokenId);
        require(msg.value >= starCost);

        _clearApproval(starOwner, tokenId);
        _removeTokenFrom(starOwner, tokenId);
        _addTokenTo(msg.sender, tokenId);

        starOwner.transfer(starCost);
        if (msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
        
        // clear being on sale 
        starsForSale[tokenId] = 0;
    }

    function checkIfStarExist(string ra, string dec, string mag) internal view returns(bool) {
        return starExisted[configureUniquenessWithStars(ra, dec, mag)];
    }

    function starsForSale(uint256 tokenId) public view returns (uint256) {
        uint256 starCost = starsForSale[tokenId];
        return starCost;
    }

    function tokenIdToStarInfo(uint256 tokenId) public view returns (string, string, string, string, string) {
        return (tokenIdToStarInfo[tokenId].name, tokenIdToStarInfo[tokenId].story,
            tokenIdToStarInfo[tokenId].ra, tokenIdToStarInfo[tokenId].dec,
            tokenIdToStarInfo[tokenId].mag);
    }

    function configureUniquenessWithStars(string ra, string dec, string mag) private pure returns (string) {
        return string(abi.encodePacked(ra, dec, mag));
    }
}
