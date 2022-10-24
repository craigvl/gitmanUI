<template lang="pug">
section(class='body-section' v-loading.fullscreen.lock='loading || forkingJob' :element-loading-text="forkingJob ? `Forking the repository ${forkingJob.repositoryName} this can take a minute or two` : loadingText")
    AppHeader

    div.transition(name='modal')
      div(class='modal-mask', v-if='showGitCommandModal')
        div(class='modal-wrapper')
          div(class='modal-container-large gitCommands')
            div(class='modal-header')
              slot(name='header')
                h1 Starting Work
            div(class='modal-body bottom-pad-medium')
              .slot(name='body')
              div.bottom-pad-medium Use the git commands below to get started.
              div.bottom-pad-medium If you need to clone the repository use the command below
              pre
                code {{gitCommandTextClone}}
              br
              br
              div.bottom-pad-medium If you have already cloned the repository use the command below
              pre
                code {{gitCommandTextGetBranch}}
              br
              br
              div.bottom-pad-medium When your issue is fixed, just click on <strong> submit as pull request </strong>, this will send the pull request on github for approval by the repository owner
              br
              br
              el-button(class="float-right" type='secondary', @click='showGitCommandModal = false') Close

    section.container.section
      sidebar
        help-developer

      section-bar(title="Available bounties" subtitle="Bounties currenlty open to be worked on" :with-filter="true" v-model="search")
        el-form-item(label="Ethereum network" prop="name")
          el-switch.filter-switch(v-model="networkFilter" active-text="Mainnet" inactive-text="Testnet" active-value="main" inactive-value="rinkeby")
      el-row(:gutter='20')
        el-col(v-for='issue in availableIssues',:span=12, :key="issue.id")
          issue-box(v-if='canViewIssue(issue) && user'
          :user="user"
          :issue="issue"
          :eth-usd="ethUSD"
          :jobs="jobs"
          v-on:git-command="openGitCommand(issue, $event)"
          )
    AppFooter
</template>

<script>
import AppHeader from '@/components/layout/Header'
import AppFooter from '@/components/layout/Footer'
import IssueBox from '@/components/core/IssueBox'
import Icon from '@/components/core/Icon'
import SectionBar from '@/components/core/SectionBar'
import user from '@/mixins/user'
import entities from '@/mixins/entities'
import Sidebar from '@/components/layout/Sidebar'
import HelpDeveloper from '@/components/content/HelpDeveloper'

export default {
  components: {
    AppHeader,
    AppFooter,
    IssueBox,
    Icon,
    SectionBar,
    Sidebar,
    HelpDeveloper
  },
  mixins: [user, entities],
  data () {
    return {
      loading: false,
      loadingText: '',
      ethUSD: null,
      showGitCommandModal: false,
      gitCommandTextClone: null,
      gitCommandTextGetBranch: null,
      issue: {
        name: '',
        description: '',
        bounty: '',
        branch: ''
      },
      search: '',
      networkFilter: 'main',
      activeFilter: true,
      toggleJobFilter: false,
      toggleIssueFilter: false
    }
  },
  computed: {

    availableIssues () {
      return this.queryIssues({ search: this.search, network: this.networkFilter, isActive: this.activeFilter })(this.issues)
    },
    // userJobIssues () {
    //   return this.queryIssues({search, network: networkFilter, isActive: activeFilter})(this.$parent.issues.filter(_ => !this.$parent.userJobs.find(j => j.issueKey === _['.key'])))

    //   return this.$parent.issues.filter(_ => this.isIssueActive(null, !this.activeFilter)(_) && this.$parent.userJobs.find(j => j.issueKey === _['.key']))
    // },
    forkingJob () {
      return this.userJobs.find(_ => _.forking && !_.forkName)
    }
  },
  created () {
    // this.$cloudFunction.fetchEthUSD().then(_ => { this.ethUSD = _ })
  },
  methods: {
    openGitCommand (issue, job) {
      const { branchUrl, repositoryName } = job.job
      this.gitCommandTextClone = `git clone -b ${branchUrl.split('/')[2]} https://github.com/${this.user.gitUserName}/${repositoryName.split('/')[1]}.git`
      this.gitCommandTextGetBranch = `git fetch && git checkout ${branchUrl.split('/')[2]}`
      this.showGitCommandModal = true
    },
    canViewIssue (issue) {
      // rules: must be owner, or worker or issue must be funded
      return issue.ownerName === this.user.gitUserName || issue.status === 'Funded'
    }
  }
}

</script>
