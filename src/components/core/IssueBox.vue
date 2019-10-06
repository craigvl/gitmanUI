<template lang="pug">
  el-card.box-card.card-big.d-flex.flex-column.justify-content-between(v-loading.fullscreen.lock='loading' :element-loading-text="loadingText" :body-style="{ padding: '0px' }" :class="issue.contractNetwork === 'main' ? 'card-'+stateColor : 'card-primary'")
    div(slot='header')
      el-tooltip(v-if="issue.contractNetwork !== 'main'" effect="dark" content="The bounty for this issue is on the ethereum rinkeby network, which means no actual money will be awarded upon completion." placement="top-start")
        el-tag.el-tag-net(size="small") Rinkeby

      el-tooltip(effect="dark" content="Error creating the smart contract" placement="top-start")
        el-tag(v-if='issue.status === "Rejected"' :type="stateColor" size="small" ) Error

      el-tooltip(effect="dark" content="Currently setting up the smart contract" placement="top-start")
        el-tag(v-if='isFunding && !issue.contractDeployTransaction' :type="stateColor" size="small") Funding

      el-tooltip(effect="dark" content="Currently setting up the smart contract, click to view the transaction on etherscan" placement="top-start")
        el-tag(v-if='isFunding && issue.contractDeployTransaction' :type="stateColor" size="small")
          a(:href="deployTransactionUrl" target="_blank") Funding

      el-tooltip(effect="dark" content="Pull Request merged" placement="top-start")
        el-tag(v-if='issue.status === "Closed"' :type="stateColor" size="small" ) Completed

      el-tooltip(effect="dark" :content="'Issue has been funded with ' + formattedETH(issue.bounty) + ' ETH, click to view on etherscan'" placement="top-start")
        el-tag(v-if='issue.status === "Funded"' :type="stateColor" size="small" )
          a(:href="contractUrl" target="_blank") Funded

      el-tooltip(effect="dark" :content="formattedETH(issue.bounty) + ' ETH, click to view on etherscan'" placement="top-end")
        span.eth-balance.float-right(v-if="issue.bounty")
          a(:href="contractUrl" target="_blank") ${{formattedUSD(issue.bounty)}}

    div.card-section
      a.card-text(:href="issueUrl" target="_blank") {{issue.title}}
      br
      div.card-text.text-repo
        icon(icon-name="repo")
        a(:href="repoUrl" target="_blank") {{issue.repositoryName}}

      el-tooltip(effect="dark" content="The donator for this issue" placement="top-start")
        div.card-text.text-user
          icon(icon-name="gist-secret")
          span {{issue.ownerName}}

    div.card-section.divider(v-if="userJob && userJob.length > 0")
      a.card-text(:href="userJob.forkedBranchUrl" target="_blank") Your contribution

      el-tooltip(v-if="!userJob.pullRequestNumber" effect="dark" content="Click to see how to get started" placement="top-start")
        el-badge.mark.badge-hint(value="?" @click.native="showGitCommand")

      job-link(:job="userJob" :repository-name="issue.repositoryName")

    div.card-section.divider(v-if="sentJobs && sentJobs.length > 0 && !(userJob && userJob.length > 0)")
      div.card-text Pending contributions
        div(v-for='job in sentJobs' :key="job.developerId")
          job-link(:job="job" :repository-name="issue.repositoryName")

    <!-- Owner, funding issue actions (V1) -->
    div.card-action-footer(v-if='issue.status !== "Funded" && !issue.contractDeployTransaction && !issue.contractAddress && user.gitUserName === issue.ownerName')
      el-button(size="small"  type="primary"  @click="cancelIssue") Cancel issue
    <!-- Owner, funding issue actions (V1) -->
    div.card-action-footer(v-if='issue.status !== "Funded" && issue.contractDeployTransaction && !issue.contractAddress && user.gitUserName === issue.ownerName')
      el-button(size="small"  type="primary"  @click="openTransaction(issue.contractNetwork, issue.contractDeployTransaction)") View transaction

      <!-- Dev, start work -->
    div.card-action-footer(v-if="issue.status !== 'Closed' && !userJob && issue.contractAddress && user && user.gitUserName !== issue.ownerName")

      el-dropdown(size="small" split-button type="primary"  @click="startWork") Start work
        el-dropdown-menu(slot='dropdown')
          el-dropdown-item(@click.native='openLink(issueUrl)'
          v-if='issueUrl && issue.status !== "Closed"') View issue
          el-dropdown-item(@click.native='openLink(contractUrl)'
          v-if='contractUrl && issue.status !== "Closed"') View bounty contract

    div.card-action-footer.job-status(v-if='user.gitUserName === issue.ownerName && !isFunding') You added this issue
    div.card-action-footer.job-status(v-if='isForking') Currently forking

    <!-- Dev, fork Ready -->
    div.card-action-footer(v-if="issue.contractAddress && issue.status !== 'Closed' && userJob && userJob.branchUrl && !userJob.pullRequestId")
      el-dropdown(placement="bottom" size="small" split-button type="primary" @click="submitWork") Submit as pull request
        el-dropdown-menu(slot='dropdown')
          el-dropdown-item(@click.native='cancelWork()'
          v-if='contractUrl && issue.status !== "Closed"') Cancel contribution
          el-dropdown-item(divided @click.native='showGitCommand()'
          v-if='issue.status !== "Closed"') View git commands
          el-dropdown-item(@click.native='openJobBranch(userJob.forkName, userJob.branchUrl)'
          v-if='userJob && !userJob.pullRequestNumber && userJob.forkName && userJob.branchUrl && issue.status !== "Closed"') View work branch
          el-dropdown-item(@click.native='openLink(issueUrl)'
          v-if='issueUrl && issue.status !== "Closed"') View issue
          el-dropdown-item(@click.native='openLink(contractUrl)'
          v-if='contractUrl && issue.status !== "Closed"') View bounty contract

    <!-- Dev, Pr Sent -->
    div.card-action-footer(v-if="issue.status !== 'Closed' && userJob && userJob.pullRequestId && user.gitUserName !== issue.ownerName")
      el-dropdown(placement="bottom" size="small" split-button type="primary" @click="openPullRequest(userJob.pullRequestNumber)") View Pull Request
        el-dropdown-menu(slot='dropdown')
          el-dropdown-item(@click.native='cancelWork()'
          v-if='contractUrl && issue.status !== "Closed"') Cancel contribution
          el-dropdown-item(divided @click.native='openLink(issueUrl)'
          v-if='issueUrl && issue.status !== "Closed"') View issue
          el-dropdown-item(@click.native='openLink(contractUrl)'
          v-if='contractUrl && issue.status !== "Closed"') View bounty contract

    div(v-if='issue.status != "Closed" && issue.contractAddress')
      p.tiny-text.dev-count(type='info',v-if='sentJobs && sentJobs.length > 1') {{sentJobs.length}} developers have started work
      p.tiny-text.dev-count(type='info',v-if='sentJobs && sentJobs.length === 1') {{sentJobs.length}} developer has started work
      p.tiny-text.dev-count(type='info',v-if='sentJobs && sentJobs.length === 0') no developers have started work

</template>

<script>

import Icon from '@/components/core/Icon'
import JobLink from '@/components/core/JobLink'
import github from '@/mixins/github'

export default {
  props: ['ethUsd', 'issue', 'user', 'jobs'],
  mixins: [github],
  components: {
    Icon,
    JobLink
  },
  data () {
    return {
      loading: false,
      loadingText: '',
      active: 0,
      showHeader: true
    }
  },
  computed: {
    isForking () {
      return this.jobs.find(_ => _.issueId === this.issue.id && _.developerId === this.user.id && !_.branchUrl)
    },
    isFunding () {
      return this.issue.status !== 'Closed' && this.issue.status !== 'Funded' && this.issue.status !== 'Rejected' && !this.issue.contractAddress
    },
    issueUrl () {
      return `https://github.com/${this.issue.repositoryName}/issues/${this.issue.number}`
    },
    repoUrl () {
      return `https://github.com/${this.issue.repositoryName}`
    },
    deployTransactionUrl () {
      return this.$etherscanService.getTransactionLink(this.issue.contractNetwork, this.issue.contractDeployTransaction)
    },
    contractUrl () {
      return this.$etherscanService.getContractLink(this.issue.contractNetwork, this.issue.contractAddress)
    },
    stateColor () {
      if (this.issue.status === 'Created' && !this.issue.contractAddress) return 'warning'
      if (this.issue.status === 'Rejected') return 'danger'
      if (this.issue.status === 'Closed') return 'info'
      if (this.issue.status === 'Funded') return 'success'
      if (!this.issue.contractAddress && this.issue.status !== 'Rejected') return 'danger'
    },
    userJob () { // returns users job for this issue , will exists if user has started work, should only ever be one record
      return this.jobs
        .find(_ => _.issueId === this.issue.id && _.developerId === this.user.id)
    },
    sentJobs () {
      // console.log(`issue jobs for ${this.issue.id} ${this.issue.title} `, this.jobs.filter(_ => _.issueId === this.issue.id && _.branchUrl))
      return this.jobs
        .filter(_ => _.issueId === this.issue.id && _.branchUrl)
    },
    metamaskAvailable () {
      return window.$web3 && this.$web3Service.getCurrentNetwork(window.$web3)
    }
  },
  created () {
  },
  methods: {
    openLink (url) {
      window.open(url, '_blank')
    },
    async cancelWork () {
      try {
        const { forkName, branchUrl } = this.userJob
        this.startLoading('Withdrawing your contribution, the branch will still available on your github account.')
        await this.$cloudFunction.cancelJob(this.issue['.key'])
        this.stopLoading()
        this.$snack.success({
          text: 'Job cancelled',
          button: 'View branch on github',
          action: () => this.openJobBranch(forkName, branchUrl)
        })
      } catch (error) {
        this.handleError(error)
      }
    },
    async submitWork () {
      const head = `${this.user.gitUserName}:${this.userJob.branchUrl.split('/')[2]}`
      this.startLoading(`Creating a pull request for ${this.userJob.branchUrl}`)
      try {
        const { url, id } = await this.$cloudFunction.submitWork(head, this.issue.repositoryName, this.issue.branch, this.issue.id)

        this.stopLoading()
        this.$snack.success({
          text: 'Pull Request Created',
          button: 'View pull request',
          action: () => this.openUrl(url.replace('https:/api.github.com/repos/', 'https://github.com/'))
        })
      } catch (error) {
        this.stopLoading()
        this.$snack.danger({
          text: error.message,
          button: 'View git commands',
          action: () => this.showGitCommand()
        })
      }
    },
    async cancelIssue () {
      try {
        this.startLoading()
        await this.$cloudFunction.cancelIssue(this.issue['.key'])
        this.stopLoading()
        this.$snack.success({
          text: 'Issue deleted',
          action: ''
        })
      } catch (error) {
        this.handleError(error)
      }
    },
    /* TODO: investigate why MM is not working in this instance
      retryFunding () {

          this.startLoading()
          window.ethereum.enable().then(wallet => {
            const web3 = window.web3
            if (!web3) throw 'Metamask not working ... '
            // update with current metamask values (MM refresh the page anyways on change...)

            web3.currentProvider.publicConfigStore.on('update', (data, currentNetwork) => {
              this.startLoading(`Found account ${data.selectedAddress} on ${this.$web3Service.networks[data.networkVersion]} network, now preparing the transaction.`)
            })
              // network before creating the issue, useful for polling later on
            this.$web3Service.getCurrentNetwork(web3).then(issueNetwork => {
              const transactionHashCallback = async transaction => {
                this.startLoading(`Transaction ${transaction} has been sent, waiting for confirmation.`)
                this.$cloudFunction.startFundIssue(issueKey, transaction, issueNetwork)
              }

              const errorCallback = error => {
                this.handleError()(error)
                throw error
              }

            this.$web3Service.sendCreateIssue(web3, this.issue.ownerId, this.issue.repositoryId, this.issue.id, this.issue.bounty.toString(), transactionHashCallback, errorCallback)
            .then(data => {
            const { transactionHash, blockNumber, contractAddress, network } = data
            this.startLoading(`Transaction has now been validated, contract ${contractAddress} has been created.`)
             this.$cloudFunction.completeFundIssue(issueKey, contractAddress, network).then(_ => {
              this.$snack.success({ text: 'Issue funded'})
              this.stopLoading()
             }).catch (error=> { this.handleError(error) })
          }).catch (error=> { this.handleError(error) })

        }).catch (error=> { this.handleError(error) })
      }).catch (error=> { this.handleError(error) })
      },
      */
    async startWork () {
      let wallet = this.user[this.issue.contractNetwork + 'Wallet']

      try {
        const modalResponse = await this.$prompt(
          `Please input the wallet address for the Ethereum <el-tag style={margin-right:0px;} class="el-tag--small el-tag el-tag-single el-tag-net" size="small">${this.issue.contractNetwork} network</el-tag> where you would like the bounty to go when a pull request is approved.<br><br> Then click on the create branch button which will fork the repository if required and create the required gitman branch for you to complete your work on.`,
          'Ethereum Reward Wallet',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'Create Branch',
            inputValue: wallet,
            cancelButtonText: 'Cancel',
            inputPattern: /^0x[a-fA-F0-9]{40}$/,
            inputErrorMessage: 'Please enter a valid Ethereum wallet address.'
          })
        wallet = modalResponse.value
      } catch (err) {
        this.stopLoading()
        console.error(err)
        return
      }
      this.startLoading('Forking the repository if needed and creating a branch ... ')
      await this.$cloudFunction.saveWallet(this.user['.key'], wallet, this.issue.contractNetwork)
      try {
        const { branchUrl, jobKey } = await this.$cloudFunction.startWork(this.user['.key'], this.issue['.key'])
        if (branchUrl) {
          // forked and branching worked
          this.stopLoading()
          this.showGitCommand()
        } else {
          this.stopLoading()

          // this.loadingText('Forking the repository ... please be patient this can take a few minutes ... ')
          // forking ...
        }
      } catch (error) {
        this.handleError(error)
      }
    },
    startLoading (text) {
      this.loading = true
      this.loadingText = text
    },
    stopLoading () {
      this.loading = false
    },
    handleError (error) {
      const message = error.message ? error.message : error
      console.error(message)
      this.stopLoading()
      this.$snack.danger({ text: message })
    },
    showGitCommand () {
      const job = this.userJob
      const issue = this.issue
      this.$emit('git-command', { issue, job }) // this.getUserJob will become $event on the listener / parent
    },
    formattedUSD (value) {
      return this.ethUsd && (value / 1000000000000000000 * this.ethUsd).toFixed(2)
    },
    formattedETH (value) {
      return (value / 1000000000000000000).toFixed(4)
    },
    openUrl (url) {
      window.open(url, '_blank')
    },
    openPullRequest (pullRequestNumber) {
      window.open(this.pullRequestUrl(this.issue.repositoryName, pullRequestNumber), '_blank')
    },
    openJobBranch (forkName, branchUrl) {
      window.open(this.forkedBranchUrl(forkName, branchUrl), '_blank')
    },
    openTransaction (network, transaction) {
      window.open(this.$etherscanService.getTransactionLink(network, transaction), '_blank')
    }
  }
}

</script>
