const {expect } = require('chai');
const{ ethers } = require('hardhat');

describe('MyToken', function(){
 let mytoken, owner, bob, jane, sara;
 const ZeroAddress = '0x0000000000000000000000000000000000000000';
 
 const id1 = 123;
 const id2 = 124;

 const uri1 = 'http://nibbstack.com/1';
 const uri2 = 'http://nibbstack.com/2';
 const uri3 = 'http://nibbstack.com/3';

 beforeEach(async () => {
     const contract = await ethers.getContractFactory('MyToken');
     mytoken = await contract.deploy();
     [owner, bob, jane, sara] = await ethers.getSigners();
     await mytoken.deployed();

 });

 it('returns the correct contract name', async function(){
     expect(await mytoken.name()).to.equal('MyToken');

 });

 it('returns the correct contract symbol', async function(){
     expect(await mytoken.symbol()).to.equal('MTK');
 });

 it('correctly mints a NFT', async function(){
     expect(await mytoken.connect(owner).safeMint(bob.address)).emit(mytoken, 'Transfer');
     expect(await mytoken.balanceOf(bob.address)).to.equal(1);

 });

 it('returns correct balanceOf', async function(){
     await mytoken.connect(owner).safeMint(bob.address);
     expect(await mytoken.balanceOf(bob.address)).to.equal(1);
     await mytoken.connect(owner).safeMint(bob.address);
     expect(await mytoken.balanceOf(bob.address)).to.equal(2);

 });

 it('finds the correct owner of NFTid',async function(){
     await mytoken.connect(owner).safeMint(bob.address);
     expect(await mytoken.ownerOf(1)).to.equal(bob.address);

 });

 it ('correctly approves account',async function()
 {
     await mytoken.connect(owner).safeMint(bob.address);
     expect(await mytoken.connect(bob).approve(sara.address,1)).to.emit(mytoken, 'Approval');
     expect(await mytoken.getApproved(1)).to.equal(sara.address);

 });

 it ('correctly cancels Approval', async function(){
     await mytoken.connect(owner).safeMint(bob.address);
     await mytoken.connect(bob).approve(sara.address,1);
     await mytoken.connect(bob).approve(ZeroAddress, 1);
     expect(await mytoken.getApproved(1)).to.equal(ZeroAddress);

 });

it ('correclty sets an operator', async function(){
    await mytoken.connect(owner).safeMint(bob.address);
    expect(await mytoken.connect(bob).setApprovalForAll(sara.address,true)).to.emit(mytoken,'ApproveForAll');
    expect(await mytoken.isApprovedForAll(bob.address,sara.address)).to.equal(true);

});

it('sets and cancels an opertor', async function(){
    await mytoken.connect(owner).safeMint(bob.address);
    await mytoken.connect(bob).setApprovalForAll(sara.address,true);
    await mytoken.connect(bob).setApprovalForAll(sara.address, false);
    expect(await mytoken.isApprovedForAll(bob.address, sara.address)).to.equal(false);

});

it('correctly transfer nft from owner', async function(){
    await mytoken.connect(owner).safeMint(bob.address);
    await mytoken.connect(bob).approve(sara.address, 1);
    await mytoken.connect(sara).transferFrom(bob.address,jane.address,1);
    expect(await mytoken.balanceOf(bob.address)).to.equal(0);
    expect (await mytoken.balanceOf(jane.address)).to.equal(1);
    expect(await mytoken.ownerOf(1)).to.equal(jane.address);


});

it ('correctly transfer NFT as operator', async function(){
   
    await mytoken.connect(owner).safeMint(bob.address);
    await mytoken.connect(bob).setApprovalForAll(sara.address, true);
    await mytoken.connect(sara).transferFrom(bob.address,jane.address, 1);
    expect(await mytoken.balanceOf(bob.address)).to.equal(0);
    expect(await mytoken.balanceOf(jane.address)).to.equal(1);
    expect(await mytoken.ownerOf(1)).to.equal(jane.address);

});

it('correctly burns a NFT', async function(){
    await mytoken.connect(owner).safeMint(bob.address);
    expect(await mytoken.connect(owner).burn(1)).to.emit(mytoken, 'Transfer');
    expect(await mytoken.balanceOf(bob.address)).to.equal(0);
    await expect(mytoken.ownerOf(1)).to.be.revertedWith('003002');
});

});
