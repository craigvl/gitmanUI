<template lang="pug">
section.body-section(v-loading.fullscreen.lock='loading' :element-loading-text="loadingText")
  AppHeader

  <!-- Start add issue modal -->
  transition(name='modal')
    div(class='modal-mask', v-if='showModal')
      div(class='modal-wrapper')
        div.modal-container-small
          div(class='modal-header')
            slot(name='header')
              div(v-if="formMode !== 'sponsor'" class='modal-heading') Bounty an issue
              div(v-if="formMode == 'sponsor'" class='modal-heading') Bounty an existing issue
          div(v-if="formMode !== 'sponsor'" class='modal-description') By raising a bounty, GitMan creates an issue against your selected repository.
          div(v-if="formMode === 'sponsor'" class='modal-description') By funding an existing issue, GitMan adds a bounty to the selected issue.

          div(v-if="network" class='modal-description') The bounty for this issue will be set on the Ethereum
          div(v-if="network" class='modal-description')
            el-tag.el-tag-net(size="small") {{network !== 'main' ? network : 'main'}} network
          div(v-if="network" class='modal-description') You can change the network via metamask if you wish

          div(class='modal-body bottom-pad-medium')
            slot(name='body')
              div(v-if="formMode === 'create'").bottom-pad-medium
                span.requiredmessage(v-if="!$v.issue.name.required") *
                el-input(type='text', name='name', v-model='issue.name', placeholder='Title', @input="$v.issue.name.$touch()")
              div(v-if="formMode === 'create'").bottom-pad-medium
                span.requiredmessage(v-if="!$v.issue.description.required") *
                el-input(type='textarea', name='description', v-model='issue.description', placeholder='Description', @input="$v.issue.description.$touch()")

              div(v-if="formMode === 'sponsor'")
                span.requiredmessage(v-if="repoIssues && repoIssues.length === 0") Sorry no issues available to sponsor or fund
                span.requiredmessage(v-if='!$v.issue.number.required') *
                el-select(:disabled='!repoIssues || repoIssues.length === 0', v-model='issue.number', :placeholder="!repoIssues || repoIssues.length == 0 ? 'Issues, loading ...' : 'Issue'", name='issueNumber' class='bottom-pad-medium full-width')
                  el-option(
                  v-for='item in repoIssues'
                  :key='item.value'
                  :label='item.label'
                  :value='item.value')

              span.requiredmessage(v-if='!$v.issue.branch.required') *
              el-select(:disabled='!branches || branches.length === 0', v-model='issue.branch', :placeholder="!branches || branches.length == 0 ? 'Branches, loading ...' : 'Branch'", name='issueBranch' class='bottom-pad-medium full-width')
                el-option(
                v-for='item in branches'
                :key='item.value'
                :label='item.label'
                :value='item.value')
              span.requiredmessage(v-if='!$v.issue.bounty.required') *
              el-select(v-model='issue.bounty', placeholder='Bounty', name='issueBounty', class="full-width")
                el-option(
                v-for='item in formatedRewardAmounts'
                :key='item.value'
                :label='item.label'
                :value='item.value')
              div.tiny-text
                span(v-if="issue.bounty") fee: {{formatAmount(issue.bounty * 0.05)}}
                br
                span(v-if="issue.bounty") reward: {{formatAmount(issue.bounty * 0.85)}}

          div(class='modal-footer')
            slot(name='footer')
              el-button(
              v-if="formMode !== 'sponsor'"
              type='primary',
              :disabled='$v.$invalid'
              @click='addIssue()') Bounty Issue

              el-button(
              v-if="formMode === 'sponsor'"
              type='primary',
              :disabled='$v.$invalid'
              @click='addIssue()') Fund Issue

              el-button(
              type='secondary',
              @click='closeModal()',
              class="float-right") Close

  <!-- End add issue modal -->

  section.container.section
    sidebar
      help-donator

    section-bar(v-if="registeredOwnedRepos && registeredOwnedRepos.length > 0" title="Your registered repositories" subtitle="Repositories enabled for you or others to post bounties on them")

    el-row(:gutter=20 v-if='registeredOwnedRepos && registeredOwnedRepos.length > 0')
      el-col(v-for='repo in registeredOwnedRepos' :key="repo.name" :span="8")
        repo-box(
        :repo="repo"
        :can-create="repo.hasHook"
        :can-sponsor="!repo.private && repo.hasHook"
        :can-enable="!repo.hasHook"
        :metamask="metamaskAvailable"
        :isOwner="true"
        v-on:enable="enableRepository(repo.name)"
        v-on:disable="disableRepository(repo.name)"
        v-on:create-issue="openModal('create', repo.name)"
        v-on:sponsor-issue="openModal('sponsor', repo.name)")

    section-bar(ref="disabled-repos" id="disabled-repos" v-if="disabledOwnedRepos && disabledOwnedRepos.length > 0" anchor="disabled-repos" title="Your available repositories" subtitle="Repositories available for you to enable, so that you or others can post bounties on them")

    el-row(:gutter=20 v-if='disabledOwnedRepos && disabledOwnedRepos.length > 0')
      el-col(v-for='repo in disabledOwnedRepos' :key="repo.name" :span="8")
        repo-box(:id="'repo-'+repo.id"
        :repo="repo"
        :can-create="repo.hasHook"
        :can-sponsor="!repo.private && repo.hasHook"
        :can-enable="!repo.hasHook"
        :metamask="metamaskAvailable"
        :isOwner="true"
        v-on:enable="enableRepository(repo.name)"
        v-on:disable="disableRepository(repo.name)"
        v-on:create-issue="openModal('create', repo.name)"
        v-on:sponsor-issue="openModal('sponsor', repo.name)")

    section-bar(title="Repositories available for sponsoring" subtitle="Enabled repositories available for you to sponsor issues on them", v-model="searchSponsorRepo")

    el-row(:gutter=20 )
      el-col(v-for='repo in sponsoringRepos' :key="repo.name" :span="8")
        repo-box(v-if="repo.canCreateIssue ||  !repo.private" :repo="repo" :can-enable="false" :can-create="repo.canCreateIssue" :can-sponsor="!repo.private" :metamask="metamaskAvailable" :isOwner="false" v-on:create-issue="openModal('create', repo.name)" v-on:sponsor-issue="openModal('sponsor', repo.name)")

  AppFooter
</template>

<script>
import { auth } from '@/firebase'
import AppHeader from '@/components/layout/Header'
import AppFooter from '@/components/layout/Footer'
import RepoBox from '@/components/core/RepoBox'
import SectionBar from '@/components/core/SectionBar'

import { required } from 'vuelidate/lib/validators'
import user from '@/mixins/user'
import entities from '@/mixins/entities'
import Sidebar from '@/components/layout/Sidebar'
import HelpDonator from '@/components/content/HelpDonator'

export default {
  name: 'repos',
  components: {
    AppHeader,
    AppFooter,
    RepoBox,
    SectionBar,
    Sidebar,
    HelpDonator
  },
  mixins: [user, entities],
  props: {
    enableId: {
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
      issue: {
        repositoryName: '',
        name: '',
        description: '',
        bounty: '',
        branch: '',
        number: ''
      },
      searchSponsorRepo: '',
      branches: [],
      activeFilter: true,
      networkFilter: 'main'
    }
  },
  validations () {
    return {
      issue: {
        name: this.formMode === 'create' ? { required } : {},
        description: this.formMode === 'create' ? { required } : {},
        branch: { required },
        bounty: { required },
        number: this.formMode === 'sponsor' ? { required } : {}
      }
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
    enableRepository (repositoryName) {
      this.loading = true
      this.loadingText = 'Creating hooks on the repository to enable the bountying of issues'
      this.$cloudFunction.registerRepo(repositoryName)
        .then(_ => { this.loading = false })
        .catch(this.handleError)
    },
    disableRepository (repositoryName) {
      this.loading = true
      this.loadingText = 'Removing hooks on the repository and deregister it from Gitman'
      this.$cloudFunction.deregisterRepo(repositoryName)
        .then(_ => { this.loading = false })
        .catch(this.handleError)
    },
    getJobsForIssue (issueId) {
      return this.$parent.jobs
        .map(_ => Object.keys(_).filter(k => k !== '.key').map(k => _[k]))
        .reduce((a, c) => a.concat(c), [])
        .filter(_ => _.issueId === issueId)
    },
    async addIssue () {
      if (this.$v.$invalid) {
        this.$snack.danger('Invalid parameters')
        return
      }

      if (this.formMode === 'sponsor') {
        if (!this.issue.repositoryName || !this.issue.number || !this.issue.branch || !this.issue.bounty) {
          this.$snack.danger('Invalid paramaters')
          return
        }
      }

      if (this.formMode === 'create' && (!this.issue.repositoryName || !this.issue.description || !this.issue.branch || !this.issue.name || !this.issue.bounty)) {
        this.$snack.danger('Invalid paramaters')
        return
      }

      this.loadingText = null
      this.closeModal()
      // create Web Hook
      this.loading = true

      const [repositoryOwner] = this.issue.repositoryName.split('/')

      // create hook only the donator/creator is the owner of the repository
      const createHookPromise = repositoryOwner === this.user.gitUserName ? this.$cloudFunction.registerRepo(this.issue.repositoryName) : Promise.resolve()

      createHookPromise.then(_ => {
        const issuePromise = !this.issue.number
          ? this.$cloudFunction.addIssue(this.user.key, this.issue.repositoryName, this.issue.branch, this.issue.name, this.issue.description)
          : this.$cloudFunction.sponsorIssue(this.user.key, this.issue.repositoryName, this.issue.branch, this.issue.number)

        issuePromise.then(async data => {
          // const ownerId = data.ownerId
          // const repositoryId = data.repositoryId
          // const issueId = data.id
          const issueKey = data.key

          // This code is called when the sendCreateIssue receives the transaction hash, .on('transactionHash'

          await this.$cloudFunction.startFundIssue(issueKey)
          this.loading = false
          this.loadingText = null
          this.$snack.success({
            text: 'Issue funded',
            button: 'Ok'
          })
        })
      })
    },
    repoUrl (repositoryName) {
      return `https://github.com/${repositoryName}`
    },

    async getAvailableIssues (repositoryName) {
      const repoIssues = await this.$gitService.getRepoIssues(repositoryName)
      const gitmanIssueNumbers = this.issues
        .filter(_ => _.repositoryName === repositoryName)
        .map(_ => _.number)

      // exclude already bountied issues
      return repoIssues.filter(_ => gitmanIssueNumbers.indexOf(_.number) <= 0 && (!_.labels || !_.labels.some(l => l.name.indexOf('gitman'))))
    },

    async openModal (mode, repositoryName) {
      this.formMode = mode
      this.issue.repositoryName = repositoryName
      this.issue.name = ''
      this.issue.description = ''
      this.issue.bounty = null
      this.issue.branch = ''
      this.issue.number = null
      this.repoIssues = null
      this.branches = []

      // Get all branches for repo
      this.$cloudFunction.getBranches(repositoryName).then(branches => {
        this.branches = branches.filter(_ => !_.name.startsWith('gitman-')).map(_ => ({
          key: _,
          value: _.name,
          label: _.name
        }))
      })

      if (this.formMode === 'sponsor') {
        try {
          const issues = await this.getAvailableIssues(repositoryName)
          this.repoIssues = issues.map(_ => ({
            key: _.number,
            value: _.number,
            label: _.title
          }))

          this.showModal = true
        } catch (e) {
          if (e.status === 404) {
            this.showModal = false
            this.handleError('No issues found.')
          }
        }
      } else {
        this.showModal = true
      }
    },
    closeModal () {
      this.branches = []
      this.showModal = false
      this.loading = false
    },
    formatAmount (ether) {
      return `${ether} eth ≈ ${((ether) * this.ethUSD).toFixed(2)} USD`
    }
  },

  created () {
  },
  computed: {
    formatedRewardAmounts () {
      return this.$rewardAmounts
        .filter(_ => this.$admins.indexOf(this.user.email) >= 0 || _ > 0.01)
        .map(_ => ({ value: _, label: this.formatAmount(_) }))
    },

    sponsoringRepos () {
      return this.hookRepos
        .filter(_ => _.name.split('/')[0] !== this.user.gitUserName && !_.private)
        .map(_ => ({ ..._, canCreateIssue: false }))
        .searchBy(['name'], this.searchSponsorRepo)
        .unique(_ => _.name)
    },

    gitRepos () {
      return this.$root.$children[0].userGitRepos
    },
    disabledOwnedRepos () {
      const hookUserRepos = this.$root.$children[0].firebaseRepos.map(_ => _.name)

      // Merge user repos with hooks
      const gitUserRepos = this.gitRepos
        .filter(_ => _.permissions.admin && !_.fork && hookUserRepos.indexOf(_.full_name) < 0) // TODO: re-add permissions
        .map(_ => ({ ..._, name: _.full_name, hasHook: false }))
        .unique(_ => _.name)

      return gitUserRepos.sort((a, b) => {
        if (this.enableId) {
          if (a.id === parseInt(this.enableId)) return -1
          if (b.id === parseInt(this.enableId)) return 1
        }
        return 0
      })
    },

    registeredOwnedRepos () {
      const hookUserRepos = this.$root.$children[0].firebaseRepos.map(_ => _.name)
      return this.gitRepos
        .filter(_ => _.permissions.admin && !_.fork && hookUserRepos.indexOf(_.full_name) >= 0)
        .map(_ => ({ ..._, name: _.full_name, hasHook: true }))
        .unique(_ => _.name)
    }
  }
}
</script>
