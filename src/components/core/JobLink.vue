<template lang="pug">
  div
    div.card-text.text-user(v-if="status == 'forking'")
      icon(icon-name="repo-forked")
      a(:href="jobPullRequestUrl" target="_blank") {{job.developerName}}
      el-tooltip(effect="dark" :content="`The job is being started by ${job.developerName}`" placement="top-end")
        div.float-right.job-status
          icon(icon-name="clock")
          span  Forking

    div.card-text.text-repo(v-if="status == 'pending'")
      icon(icon-name="git-branch")
      a(:href="jobBranchUrl" target="_blank") {{job.forkName}}
      el-tooltip(effect="dark" :content="`${job.developerName} is currently working on this, once done, a pull request will be sent`" placement="top-end")
        div.float-right.job-status
          icon(icon-name="clock")
          span  In progress

    div.card-text.text-user(v-if="status == 'ready'")
      icon(icon-name="git-pull-request")
      a(:href="jobPullRequestUrl" target="_blank") {{job.forkName}}
      el-tooltip(effect="dark" :content="`The job has been completed by ${job.developerName} and is ready for review`" placement="top-end")
        div.float-right.job-status
          icon(icon-name="check")
          span  Submitted

</template>

<script>
import Icon from '@/components/core/Icon'
import github from '@/mixins/github'
import entities from '@/mixins/entities'

export default {
  components: {
    Icon
  },
  mixins: [github, entities],
  props: ['job', 'repositoryName'],
  data () {
    return {}
  },
  computed: {
    status () {
      return this.getJobStatus(this.job)
    },
    jobPullRequestUrl () {
      return this.pullRequestUrl(this.repositoryName, this.job.pullRequestNumber)
    },
    jobBranchUrl () {
      return this.forkedBranchUrl(this.job.forkName, this.job.branchUrl)
    }
  }
}
</script>

<style>

  .job-status {
    font-style: italic;
  }
</style>
