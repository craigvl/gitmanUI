class Web3Service {
  constructor (config) {
    const factoryContractAbi = JSON.parse(config.factoryContractAbi)
    this.factoryContracts = {
      main: { abi: factoryContractAbi, address: config.mainnetFactoryContract },
      rinkeby: { abi: factoryContractAbi, address: config.rinkebyFactoryContract }
    }
  }

  get networks () {
    return {
      '1': 'main',
      '4': 'rinkeby'
    }
  }

  async getCurrentAccount (web3) {
    const accounts = await web3.eth.getAccounts()
    return accounts[0]
  }

  async getCurrentNetwork (web3) {
    const network = await web3.eth.net.getNetworkType()
    return network.toLowerCase()
  }

  async sendCreateIssue (web3, user, repository, issue, bounty, transactionHashCallback, confirmCallBack, errorCallback) {
    const valueWei = web3.utils.toWei(bounty.toString(), 'ether')

    const account = await this.getCurrentAccount(web3)
    const network = await this.getCurrentNetwork(web3)
    const { abi, address } = this.factoryContracts[network]
    const contract = new web3.eth.Contract(abi, address)

    const receipt = await contract.methods.createIssue(user.toString(), repository.toString(), issue.toString())
      .send({ from: account, value: valueWei })
      .on('transactionHash', transactionHashCallback)
      // .on('confirmation', confirmCallBack)
      .on('error', errorCallback)

    // const { transactionHash, blockNumber } = receipt
    // const { contractAddress } = receipt.events.IssueCreated.returnValues
    // return { transactionHash, blockNumber, contractAddress, network }
  }
}

export default {
  install (Vue, options) {
    const service = new Web3Service(options)
    Vue.prototype.$web3Service = service
  }
}
