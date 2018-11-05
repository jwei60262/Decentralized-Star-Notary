const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 
    var user1 = accounts[1]
    var user2 = accounts[2]
    var operator = accounts[3]

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })

    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            
            await this.contract.createStar('Star power 103!',
            'ra_032.155', 'dec_121.874', 'mag_245.978',
            'I love my wonderful star', 1, {from: accounts[0]})

            star = await this.contract.tokenIdToStarInfo(1);
            assert.equal(star[0], 'Star power 103!');
            assert.equal(star[1], 'I love my wonderful star');
            assert.equal(star[2], 'ra_032.155');
            assert.equal(star[3], 'dec_121.874');
            assert.equal(star[4], 'mag_245.978');
        })
    })

    describe('The same coordinates are not permitted', () => { 
        it('Smart contract prevents stars with the same coordinates from being added', async function () { 
            
            await this.contract.createStar('Star power 103!',
            'ra_032.155', 'dec_121.874', 'mag_245.978',
            'I love my wonderful star', 1, {from: accounts[0]})

            await expectThrow(this.contract.createStar('Star power 104!',
            'ra_032.155', 'dec_121.874', 'mag_245.978',
            'I love my wonderful star', 2, {from: accounts[1]}));
        })
    })

    describe('buying and selling stars', () => {
        let starId = 1
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () { 
            await this.contract.createStar('Star power 103!',
            'ra_032.155', 'dec_121.874', 'mag_245.978',
            'I love my wonderful star', starId, {from: user1})    
        })

        describe('user1 can sell a star', () => {
            it('user1 can put up their star for sale', async function () { 
                assert.equal(await this.contract.ownerOf(starId), user1)
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
                
                assert.equal(await this.contract.starsForSale(starId), starPrice)
            })

            it('user1 gets the funds after selling a star', async function () { 
                let starPrice = web3.toWei(.05, 'ether')

                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})

                let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
                await this.contract.buyStar(starId, {from: user2, value: starPrice})
                let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)

                assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), 
                            balanceOfUser1AfterTransaction.toNumber())
            })
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function() { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)

                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    })

    describe('can transfer', () => { 
        let tokenId = 1
        let tx

        beforeEach(async function () {
            await this.contract.createStar('Star power 103!',
            'ra_032.155', 'dec_121.874', 'mag_245.978',
            'I love my wonderful star', tokenId, {from: user1})

            tx = await this.contract.safeTransferFrom(user1, user2, tokenId, {from: user1})
        })

        it('token has new owner', async function () { 
            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })

        it('emits the correct event', async function () { 
            assert.equal(tx.logs[0].event, 'Transfer')
            assert.equal(tx.logs[0].args.tokenId, tokenId)
            assert.equal(tx.logs[0].args.to, user2)
            assert.equal(tx.logs[0].args.from, user1)
        })

        it('only permissioned users can transfer tokens', async function() { 
            let randomPersonTryingToStealTokens = accounts[4]

            await expectThrow(this.contract.transferFrom(user1, randomPersonTryingToStealTokens, tokenId, {from: randomPersonTryingToStealTokens}))
        })
    })

    describe('can grant approval to transfer', () => { 
        let tokenId = 1
        let tx 

        beforeEach(async function () {
            await this.contract.createStar('Star power 103!',
            'ra_032.155', 'dec_121.874', 'mag_245.978',
            'I love my wonderful star', tokenId, {from: user1})

            tx = await this.contract.approve(user2, tokenId, {from: user1})
        })

        it('set user2 as an approved address', async function () { 
            assert.equal(await this.contract.getApproved(tokenId), user2)
        })

        it('user2 can now transfer', async function () { 
            await this.contract.transferFrom(user1, user2, tokenId, {from: user2})

            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })

        it('emits the correct event', async function () { 
            assert.equal(tx.logs[0].event, 'Approval')
        })
    })

    describe('can set an operator', () => { 
        let tokenId = 1
        let tx 

        beforeEach(async function () {
            await this.contract.createStar('Star power 103!',
            'ra_032.155', 'dec_121.874', 'mag_245.978',
            'I love my wonderful star', tokenId, {from: user1})

            tx = await this.contract.setApprovalForAll(operator, true, {from: user1})
        })

        it('can set an operator', async function () { 
            assert.equal(await this.contract.isApprovedForAll(user1, operator), true)
        })
    })
})

var expectThrow = async function(promise) { 
    try { 
        await promise
    } catch (error) { 
        assert.exists(error)
        return
    }

    assert.fail('Expected an error but didnt see one!')
}