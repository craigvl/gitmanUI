class CloudFunctionService {
  constructor (config) {
    this.firebaseFunctions = config.firebaseFunctions
    this.ethUSDRate = null
  }

  async authExternalUser (appKey, token) {
    const auth = this.firebaseFunctions.httpsCallable('authExternalUser')
    const res = await auth({
      appKey,
      token
    })
    return res.data
  }

  async submitWork (head, repoName, branch, issueId) {
    const createPullRequest = this.firebaseFunctions.httpsCallable('submitWork')
    const res = await createPullRequest({
      head: head,
      repoName: repoName,
      branch: branch,
      issueId
    })
    return res.data
  }

  async getBranches (repositoryName) {
    const getBranches = this.firebaseFunctions.httpsCallable('getBranches')
    const res = await getBranches({ repositoryName })
    return res.data
  }

  async getOwnedRepos () {
    const getRepos = this.firebaseFunctions.httpsCallable('getOwnedRepos')
    const res = await getRepos()
    return res.data
  }

  async registerRepo (repositoryName) {
    const create = this.firebaseFunctions.httpsCallable(`registerRepo`)
    const res = await create({ repositoryName })
    return res.data
  }

  async deregisterRepo (repositoryName) {
    const remove = this.firebaseFunctions.httpsCallable(`deregisterRepo`)
    const res = await remove({ repositoryName })
    return res.data
  }

  async startWork (userKey, issueKey) {
    const res = await this.firebaseFunctions.httpsCallable(`startWork`)({
      userKey,
      issueKey
    })
    return res.data
  }

  async saveWallet (userKey, address, network) {
    const res = await this.firebaseFunctions.httpsCallable(`saveWallet`)({
      network,
      userKey,
      address
    })
    return res.data
  }

  async addIssue (userKey, repositoryName, branch, title, description, network) {
    const addIssue = this.firebaseFunctions.httpsCallable(`addIssue`)
    const res = await addIssue({
      title,
      description,
      branch,
      repositoryName,
      userKey,
      network
    })
    return res.data
  }

  async sponsorIssue (userKey, repositoryName, branch, issueNumber, network) {
    const sponsorIssue = this.firebaseFunctions.httpsCallable(`sponsorIssue`)
    const res = await sponsorIssue({
      issueNumber,
      branch,
      repositoryName,
      userKey,
      network
    })
    return res.data
  }

  async cancelJob (issueKey) {
    const cancelIssue = this.firebaseFunctions.httpsCallable(`cancelJob`)
    await cancelIssue({
      issueKey
    })
  }

  async cancelIssue (issueKey) {
    const cancelIssue = this.firebaseFunctions.httpsCallable(`cancelIssue`)
    await cancelIssue({
      issueKey
    })
  }

  async fetchEthUSD () {
    if (!this.ethUSDRate) {
      const res = await this.firebaseFunctions.httpsCallable(`getUSD`)()
      var result = JSON.parse(res.data)
      this.ethUSDRate = parseInt(result.data.ETH.quote.USD.price)
    }
    return this.ethUSDRate
  }

  /// verifiy the contract and attach value and other to FB issue
  async startFundIssue (issueKey, transaction, contractNetwork) {
    const res = await this.firebaseFunctions.httpsCallable(`startFundIssue`)({
      issueKey,
      transaction,
      contractNetwork
    })
    return res.data
  }

  /// verifiy the contract and attach value and other to FB issue
  async completeFundIssue (issueKey, contractAddress, contractNetwork) {
    const res = await this.firebaseFunctions.httpsCallable(`completeFundIssue`)({
      issueKey,
      contractAddress,
      contractNetwork
    })
    return res.data
  }

  // deleteHook (gitAccessToken, userKey, ownerName, repoName, repoId) {
  //   const deleteHook = this.firebaseFunctions.httpsCallable('app/deleteHook')

  //   return new Promise((resolve, reject) => {
  //     deleteHook({
  //       gitAccessToken: gitAccessToken,
  //       repoOwner: ownerName,
  //       repoName: repoName,
  //       repoId: repoId,
  //       userKey
  //     }).then(response => {
  //       if (response.status !== 200 || parseInt(response.body.status) === 0) {
  //         const message = `error creating hook, err: ${response}`
  //         reject(message)
  //       } else {
  //         resolve(response.body.value)
  //       }
  //     }, err => reject(err))
  //   })
  // }

  // checkFork (userKey, gitAccessToken, jobKey, ownerName, userName, issue) {
  //   const checkFork = this.firebaseFunctions.httpsCallable(`app/checkFork`)

  //   return new Promise((resolve, reject) => {
  //     checkFork({
  //       userKey: userKey,
  //       repoName: issue.repositoryName,
  //       repoOwner: ownerName,
  //       userName: userName,
  //       gitAccessToken: gitAccessToken,
  //       jobKey: jobKey
  //     }).then(response => {
  //       if (response.status !== 200 || parseInt(response.body.status) === 0) {
  //         const message = `error starting work, err: ${response}`
  //         reject(message)
  //       } else {
  //         resolve(response.body.value)
  //       }
  //     }, err => reject(err))
  //   })
  // }
}

export default {
  install (Vue, options) {
    // const vueHttp = Vue.prototype.$http
    const service = new CloudFunctionService(options, Vue.http)
    Vue.prototype.$cloudFunction = service
    // Vue.$cloudFunction = service
  }
}
