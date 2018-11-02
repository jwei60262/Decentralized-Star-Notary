pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 

    /// RA = Right Ascension
    /// DEC = Declination  
    /// CEN = Centaurus
    /// MAG = Magnitude

    struct Star { 
        string name; 
        string dec;
        string mag;
        string cent;
        string story;
    }

    createStar()

    putStarUpForSale()

    buyStar()

    /// Utilizing star coordinates, this function will check if the coordinates have already been claimed.
    /// The return type is boolean.
    checkIfStarExist()

    mint()

    approve()

    safeTransferFrom()

    SetApprovalForAll()

    getApproved()

    isApprovedForAll()

    ownerOf()

    starsForSale()

    /// Expected response:
    /// ["Star power 103!", "I love my wonderful star", "ra_032.155", "dec_121.874", "mag_245.978"]
    tokenIdToStarInfo()
}
