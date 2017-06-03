/*

  Use this command to start testrpc. It gives the correct amount of ether to test accounts

 testrpc --account="0xd73c1d9392c7c2fa91a5138eb3031e5eef9e63d3d94b1b009845c31c820888e7,100000000000000000000" --account="0x814c987495ce90d9770ec667700cab4253cea37b7df78f8996f7a8fc9b52caf4,1000000000000000000000000000" --account="0x7f20fb1c405190f2b86917ca351fc490c456aeb2bb0ef362fb4dbe2a9c16ff98,50000000000000000000000000" --account="0x4de7a70a32596913b9ab4be86cbdd21744ccb651bf65d7347e59c64dbcb6688d,9000000000000000000000000000" --account="0x48a5d6eae1c4b282ab6f165aae5c12f4d85f87ae5b5c3c11bb223a5829ed5c77,99000000000000000000000000" --account="0xa9b507c337d27ac61f31cefe2024971c72647bc69f636ecde66e87d5323af956,100000000000000000000000000" --account="0x923bf2f4a57ad8e9dd88d0e521e86be36c24fbcd3767030fbe003005bd6735ed,15000000000000000000000000000000" --account="0xc7459556bbc7e2624eb09b718cc6578f661a1eadab45c609bac3dd7251074743,200000000000000000000000000000" --account="0x7c2b99e0d2cf4d643462ef3576cec9bd7ebf0d628b99a090f0f15b4ed4472fb3,1000000000000000000000000000" --account="0xfeb392ac81b1c3a33f2b5b2ac4a850f67a30dec980ac6675f397f9ea24306f67,10000000000000000000000000000"

*/


var Shark = artifacts.require("Shark");

const payOffRatio = 1000
const getBalance = account => web3.eth.getBalance(account).toNumber()

contract("Shark", function(accounts) {
  it("should set the initial values", async () => {
    // Get the contract instance
    const shark = await Shark.deployed()

    // Set the account to use
    const account = web3.eth.accounts[0]

    // Get the updated state
    const sharkMessage = await shark.sharkMessage()
    const sharkAddress = await shark.sharkAddress()

    // Perform assertions
    assert.equal(sharkMessage, "Be the first one to show your stack", "Initial message was not correct")
    assert.equal(sharkAddress, account, "Initial sharkAddress was not correct")
  })


  it("should \"Show\" amount correctly", async () => {
    // Get the contract instance
    const shark = await Shark.deployed()

    // Specify message to write
    const messageToWrite = "This is a new message"

    // Set the account to use
    const account = web3.eth.accounts[3]
    const accountBalance = getBalance(account)

    // Get the current shark balance
    const sharkBalance = getBalance(await shark.sharkAddress())

    // Make sure user has sufficient funds
    assert.isAbove(accountBalance, sharkBalance, "User account has less value than current shark account")

    // Execute
    shark.Show.sendTransaction(messageToWrite, { from: account, value: 0 })

    // Get the updated state
    const sharkMessage = await shark.sharkMessage()
    const sharkAddress = await shark.sharkAddress()

    // Perform assertions
    assert.equal(sharkAddress, account, "sharkAddress was wrong")
    assert.equal(sharkMessage, messageToWrite, "sharkMessage was wrong")
  })

  it("should \"PayOff\" correctly", async () => {
    // Get the contract instance
    const shark = await Shark.deployed()

    // Specify message to write
    const messageToWrite = "This is another new message"

    // Set the account to use
    const account = web3.eth.accounts[2]
    const accountBalance = getBalance(account)

    // Get the current shark balance
    const sharkBalance = getBalance(await shark.sharkAddress())

    // Make sure user has sufficient funds
    assert.isAtLeast(accountBalance, sharkBalance / payOffRatio, "Insufficient funds")

    // Execute
    shark.PayOff.sendTransaction(messageToWrite, { from: account, value: sharkBalance / payOffRatio })

    // Get the updated state
    const sharkMessage = await shark.sharkMessage()
    const sharkAddress = await shark.sharkAddress()

    // Perform assertions
    assert.equal(sharkMessage, messageToWrite, "sharkMessage was wrong")
    assert.equal(sharkAddress, account, "sharkAddress was wrong")
  })
})
