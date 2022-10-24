<template lang="pug">
el-card.box-card.card-small.d-flex.flex-column.justify-content-between(:body-style="{ padding: '0px' }" :class="isOwner ? 'card-info' : 'card-primary'")
    br
    div.card-section
      span.card-text.text-repo-big
        icon(icon-name="repo" v-if='!repo.private')
        icon(icon-name="lock" v-if='repo.private')
        a(:href="repoUrl(repo.name)" target="_blank") {{repo.name.split('/')[1]}}

      div.card-text.text-user
        icon(icon-name="person" v-if='!repo.private')
        icon(icon-name="organization" v-if='repo.private')
        a(:href="repoUrl(repo.name)" target="_blank") {{repo.name.split('/')[0]}}

    div.card-section
    br
    br
    div.card-section
    br

    div.card-action-footer(v-if="isOwner")
      el-button(size="small" type="primary" @click="enable") Enable repository

    div.card-action-footer(v-if="isOwner")
      el-dropdown(size="small" split-button type="primary" @click="createIssue") Create new issue with a bounty
        el-dropdown-menu(slot='dropdown')
          el-dropdown-item(@click.native='sponsorIssue' ) Bounty existing issue
          el-dropdown-item(@click.native='disable' ) Disable repository

    div.card-action-footer(v-if='!isOwner')
      el-button(size="small" type="primary" @click="sponsorIssue") Sponsor issue

</template>

<script>
import Icon from '@/components/core/Icon'

export default {
  name: 'repo-box',
  components: {
    Icon
  },
  props: ['repo', 'canCreate', 'canSponsor', 'isOwner'],

  data () {
    return {}
  },
  methods: {
    repoUrl (repositoryName) {
      return `https://github.com/${repositoryName}`
    },
    createIssue () {
      this.$emit('create-issue')
    },
    sponsorIssue () {
      this.$emit('sponsor-issue')
    },
    enable () {
      this.$emit('enable')
    },
    disable () {
      this.$emit('disable')
    }
  },
  created () {
  }
}
</script>
