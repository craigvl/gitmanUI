class EtherscanService {
  constructor (config, httpClient) {
    this.config = config
    this.httpClient = httpClient
  }

  getContractLink (network, contract) {
    if (network && contract) {
      return network.startsWith('main') ? `https://etherscan.io/address/${contract}` : `https://${network}.etherscan.io/address/${contract}`
    }
  }

  getTransactionLink (network, transactionHash) {
    if (network && transactionHash) {
      return network.startsWith('main') ? `https://etherscan.io/tx/${transactionHash}` : `https://${network}.etherscan.io/tx/${transactionHash}`
    }
  }
}

export default {
  install (Vue, options) {
    // const vueHttp = Vue.prototype.$http
    const service = new EtherscanService(options, Vue.http)
    Vue.prototype.$etherscanService = service
    // Vue.$cloudFunction = service
  }
}
