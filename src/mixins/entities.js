export default {
  computed: {
    jobs () {
      return this.$root.$children[0].firebaseJobs.reduce((a, c) => a.concat(Object.keys(c).filter(_ => _ !== '.key').map(_ => c[_])), [])
    },
    issues () {
      return this.$root.$children[0].firebaseIssues
    },
    userJobs () {
      return this.$root.$children[0].firebaseUserJobs
    },
    hookRepos () {
      return this.$root.$children[0].firebaseRepos
    },
    // repos () {
    //   return this.$root.$children[0].userGitRepos
    // },
    userCreatedIssues () {
      return this.$root.$children[0].firebaseIssues.filter(_ => _.ownerKey === this.$root.$children[0].firebaseUser['.key'])
    },
    userContributingIssues () {
      return this.$root.$children[0].firebaseIssues.filter(i => this.$root.$children[0].firebaseUserJobs.some(j => i.id === j.issueId))
    },
    issuesWithJobs () {
      return this.$root.$children[0].firebaseIssues.map(issue => ({
        issue: issue,
        jobs: this.$root.$children[0].firebaseJobs
          .reduce((a, c) => a.concat(Object.keys(c).filter(_ => _ !== '.key').map(_ => c[_])), [])
          .filter(job => job.issueId === issue.id)
      }))
    }
    // registeredOwnedRepos () {
    //   const hookUserRepos = this.$root.$children[0].firebaseRepos.map(_ => _.name)

    //   return this.$root.$children[0].userGitRepos
    //     .filter(_ => _.permissions.admin && !_.fork && hookUserRepos.indexOf(_.full_name) >= 0)
    //     .map(_ => ({ ..._, name: _.full_name, hasHook: true }))
    //     .unique(_ => _.name)
    // }
  },
  methods: {
    equalOrNull (value, test) {
      return test === undefined || (value && value.toLowerCase()) === test.toLowerCase()
    },
    isIssueActive (network, completed) {
      return _ => (completed ? _.status && _.status.toLowerCase() === 'closed' : _.status && _.status.toLowerCase() !== 'closed') && this.equalOrNull(_.contractNetwork, network)
    },
    isJobActive (issue) {
      // add more checks
      return _ => issue.status.toLowerCase() !== 'closed'
    },
    getJobStatus (_) {
      if (_.branchUrl) return 'pending' // working
      if (_.pullRequestNumber) return 'ready' // ready for review'
      if (_.forking) return 'forking'
    },
    getJobsForIssue (issueId) {
      return jobs => jobs
        .reduce((a, c) => a.concat(Object.keys(c).filter(_ => _ !== '.key').map(_ => c[_])), [])
        .filter(_ => _.issueId === issueId)
    },
    getJobIssues (jobs) {
      return issues => issues.filter(_ => jobs.find(j => j.issueKey === _['.key']))
    },
    queryRepos (q) {
      return repos => repos
        .filter(_ => _.name.split('/')[0] !== this.user.gitUserName && !_.private)
        .searchBy(['name'], this.searchSponsorRepo)
    },
    queryIssues (q) {
      // const {
      //   search,
      //   ownerUsername,
      //   isActive,
      //   network
      // } = q

      return issues => issues
        .filter(_ => this.isIssueActive(q.network, !q.isActive)(_) && this.equalOrNull(_.ownerUsername, q.ownerUsername))
        .searchBy(['title', 'tags', 'repositoryName'], q.search)
        .sort((x, y) => y.createdAt - x.createdAt)
    }
  }
}
