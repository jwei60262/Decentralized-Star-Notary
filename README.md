# Decentralized-Star-Notary

This project create a DApp by adding functionality to smart contract and deploy it on the public testnet.

## Write a smart contract with functions

### Smart contract implements the ERC-721 with Zeppelin

Install Zeppelin as below:

npm install --save-exact openzeppelin-solidity@2.0.0-rc.1

### The star token has these pieces of metadata added

-  Star coordinators
	- Dec
    - Mag
	- Cent
-  Star story

### Configure uniqueness with the stars

Smart contract prevents stars with the same coordinates from being added.

Configure uniqueness with the stars, where uniqueness is based on coordinates. In other words, stars with the same coordinates are not permitted.

### Smart contract contains useful functions

Smart contract implements all these functions - createStar(), putStarUpForSale(), buyStar(), checkIfStarExist(), mint(), approve(), safeTransferFrom(), SetApprovalForAll(), getApproved(), isApprovedForAll(), ownerOf(), starsForSale(), tokenIdToStarInfo()

Could lookup all these functions in StorNotary.sol file.

## Test smart contract code coverage

Project contains tests in "test" derectory.

And go through commands below to test contract smart.

	npm install -g ganache-cli truffle
	ganache-cli
	truffle compile
	truffle compile
	truffle test

## Deploy smart contract on a public test network (Rinkeby)

### Deploy smart contract

- Creat project on [infura](https://infura.io/dashboard) and get the url.

- Configure rinkeby test network in truffle-config.js.

- Install truffle provider and deploy.

		npm i -g windows-build-tools
		npm install truffle-hdwallet-provider
		truffle deploy --network rinkeby
		truffle deploy --network rinkeby --reset

### Debug smart contract

Send a transaction to execute createStar() and putStarUpForSale() functions.


Utilize tools to complete function execution.

- [myetherwallet](https://www.myetherwallet.com)

- Metamask

- [etherscan](https://rinkeby.etherscan.io)

## Client code interacts with smart contract

Front-end is implemented on index.html.

Starting up http-server and to access front-end on http://127.0.0.1:8080/.

Functions for claiming a new star and looking up a star by ID  are configured.


Star power 103! I love my wonderful star ra_032.155 dec_121.874 mag_245.978

## Dependency

## Reference

https://cn.udacity.com/
