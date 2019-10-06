<template lang="pug">

  section.body-section(v-loading.fullscreen.lock='loading' :element-loading-text="loadingText")
    AppHeader

    section.container.section

      section-bar(title="Your contributions" subtitle="Bounties your are currently working on" :with-filter="true")
        el-col(:span="6")
          el-form-item(label="Issue progress" prop="name")
            el-switch(v-model="workingFilter.isActive" active-text="Active" inactive-text="Completed" :active-value="true" :inactive-value="false")
        el-col(:span="6")
          el-form-item(label="Ethereum network" prop="name")
            el-switch.filter-switch(v-model="workingFilter.network" active-text="Mainnet" inactive-text="Testnet" active-value="main" inactive-value="rinkeby")

      el-row(:gutter='20' )
        el-col(v-for='issue in contributingIssues',:span=12, :key="issue.id")
          issue-box(
          v-if='user'
          :user="user"
          :issue="issue"
          :eth-usd="ethUSD"
          :jobs="jobs"
          v-on:git-command="openGitCommand(issue, $event)"
          )

      section-bar(v-if="userCreatedIssues && userCreatedIssues.length > 0" title="Your posted bounties" subtitle="Issues created or sponsored by you" :with-filter="true")
        el-col(:span="6")
          el-form-item(label="Issue progress" prop="name")
            el-switch.filter-switch(v-model="createdFilter.isActive" active-text="Active" inactive-text="Completed" :active-value="true" :inactive-value="false")
        el-col(:span="6")
          el-form-item(label="Ethereum network" prop="name")
            el-switch.filter-switch(v-model="createdFilter.network" active-text="Mainnet" inactive-text="Testnet" active-value="main" inactive-value="rinkeby")

      el-row(v-if="userCreatedIssues && userCreatedIssues.length > 0" :gutter='20')
        el-col(v-for='issue in createdIssues' :span=12, :key="issue.id")
          issue-box(
          :user="user"
          :issue="issue"
          :jobs="jobs"
          :eth-usd="ethUSD"
          v-on:git-command="openGitCommand(issue, $event)"
          )
    AppFooter
</template>

<script>
import { auth, database } from '@/firebase'
import AppHeader from '@/components/layout/Header'
import AppFooter from '@/components/layout/Footer'

import RepoBox from '@/components/core/RepoBox'
import SectionBar from '@/components/core/SectionBar'
import IssueBox from '@/components/core/IssueBox'
import Web3 from 'web3'
import user from '@/mixins/user'
import entities from '@/mixins/entities'
import { pipe } from '@/utils'

export default {
  name: 'repos',
  components: {
    AppHeader,
    AppFooter,
    RepoBox,
    IssueBox,
    SectionBar
  },
  mixins: [user, entities],
  props: {
    issueId: {
      type: String,
      default: null,
      required: false
    }
  },
  data () {
    return {
      network: null,
      wallet: null,
      metamaskAvailable: false,
      loading: false,
      loadingText: '',
      ethUSD: null,
      showModal: false,
      formMode: '',
      activeFilter: true,
      networkFilter: 'main',
      toggleJobFilter: false,
      toggleIssueFilter: false,
      createdFilter: { network: 'main', isActive: true },
      workingFilter: { network: 'main', isActive: true }
    }
  },
  methods: {
    handleError (error) {
      console.error(error.message ? error.message : error)
      this.loading = false
      this.$snack.danger(error.message ? error.message : error)
    },
    logout () {
      auth.signOut().then(() => {
        this.$router.push({ name: 'login' })
      })
    },
    formatAmount (ether) {
      return `${ether} eth â‰ˆ ${((ether) * this.ethUSD).toFixed(2)} USD`
    },
    getJobsForIssue (issueId) {
      return this.getJobsForIssue(issueId)(this.jobs)
    }
  },

  created () {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      this.metamaskAvailable = true
    } else if (window.web3) { // old browsers
      window.web3 = new Web3(window.web3.currentProvider)
      this.metamaskAvailable = true
    } else { // non dapp browsers
      this.metamaskAvailable = false
      console.warn('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    // if (window.web3 && !this.$web3Service.networks[window.web3.currentProvider.networkVersion]) {
    //   this.metamaskAvailable = false
    //   console.warn('Non-Ethereum browser detected. You should consider trying MetaMask!')
    // }
    this.$cloudFunction.fetchEthUSD().then(_ => { this.ethUSD = _ })
  },
  computed: {
    contributingIssues () {
      return this.queryIssues(this.workingFilter)(this.userContributingIssues)
    },
    createdIssues () {
      return this.queryIssues(this.createdFilter)(this.userCreatedIssues)
    },
    forkingJob () {
      return this.userJobs.find(_ => _.forking && !_.forkName)
    },
    formatedRewardAmounts () {
      return this.$rewardAmounts
        .filter(_ => this.$admins.indexOf(this.user.email) >= 0 || _ > 0.01)
        .map(_ => ({ value: _, label: this.formatAmount(_) }))
    },
    openGitCommand (issue, job) {
      const { branchUrl, repositoryName } = job.job
      this.gitCommandTextClone = `git clone -b ${branchUrl.split('/')[2]} https://github.com/${this.user.gitUserName}/${repositoryName.split('/')[1]}.git`
      this.gitCommandTextGetBranch = `git fetch && git checkout ${branchUrl.split('/')[2]}`
      this.showGitCommandModal = true
    }

  }
}
</script>
