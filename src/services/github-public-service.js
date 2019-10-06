class GithubPublicService {
  constructor (config, httpClient) {
    this.apiUrl = config.apiUrl
    this.httpClient = httpClient
    this.userRepos = null
  }

  async httpGet (uri, gitAccessToken) {
    const headers = gitAccessToken ? { 'Authorization': `Bearer ${gitAccessToken}` } : {}
    const res = await this.httpClient.get(`${this.apiUrl}/${uri}`, { headers })
    return res.body
  }

  async getRepoIssues (repositoryName) {
    return await this.httpGet(`repos/${repositoryName}/issues`)
  }

  async getUserRepos (gitAccessToken) {
    const url = `user/repos`
    if (!gitAccessToken) throw `missing gitAccessToken for ${url}`

    try {
      return await this.httpGet(url, gitAccessToken)
    } catch (error) {
      if (error.body && error.body.message && error.body.message === 'Not Found') {
        return null
      } else if (error.body && error.body.message && error.body.message === 'Requires authentication') {
        console.warn('getUserRepos Error, not authorized', error)
        return []
      } else {
        console.error('getUserRepos Error', error)
        throw error
      }
    }
  }

  async getUserOrgs (gitAccessToken) {
    const url = `user/orgs`
    if (!gitAccessToken) throw `missing gitAccessToken for ${url}`
    try {
      return await this.httpGet(url, gitAccessToken)
    } catch (error) {
      if (error.body && error.body.message && error.body.message === 'Not Found') {
        return null
      } else {
        console.error('getUserOrgs Error')
        console.dir(error)

        throw error
      }
    }
  }

  async getOrgRepos (gitAccessToken, login) {
    const url = `orgs/${login}/repos`
    if (!gitAccessToken) throw `missing gitAccessToken for ${url}`

    try {
      return await this.httpGet(url, gitAccessToken)
    } catch (error) {
      if (error.body && error.body.message && error.body.message === 'Not Found') {
        return null
      } else if (error.body && error.body.message && error.body.message === 'Requires authentication') {
        console.warn('getOrgRepos Error, not authorized', error)
        return []
      } else {
        console.error('getOrgRepos Error')
        console.dir(error)

        throw error
      }
    }
  }

  async getUserOwnedRepos (gitAccessToken) {
    if (!this.userRepos) {
      const orgs = await this.getUserOrgs(gitAccessToken)
      const promises = orgs
        .map(_ => this.getOrgRepos(gitAccessToken, _.login))
        .concat(this.getUserRepos(gitAccessToken))

      const res = await Promise.all(promises)
      const userRepos = res.reduce((a, c) => a.concat(c), [])
      this.userRepos = userRepos.filter(_ => !_.fork)
    }
    return this.userRepos
  }
}

export default {
  install (Vue, options) {
    // const vueHttp = Vue.prototype.$http
    Vue.prototype.$gitService = new GithubPublicService(options, Vue.http)
    // Vue.$cloudFunction = service
  }
}
