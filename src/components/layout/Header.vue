<template lang="pug">
  nav.gm-header
    .gm-header__logo
    .gm-header__content
      .triple-item
        router-link.triple-item__item(:v-if="userJobs && userJobs.length > 0 && userCreatedIssues && userCreatedIssues.length > 0" :to=`{ name: 'dashboard' }`) My Jobs
        router-link.triple-item__item(:to=`{ name: 'issues' }`) Eliminate Issue
        router-link.triple-item__item(:to=`{ name: 'repos' }`) Bounty Issue
    .gm-header__user
      el-dropdown(trigger='click' size="small")
        .circle-item
          .circle-item__circle(:style='{ backgroundImage: `url(${user.photoUrl})`}')
          .circle-item__text {{user.name}}
        el-dropdown-menu(slot='dropdown')

          el-dropdown-item(v-if="user && user.isAdmin")
            el-button(type='text' size="small" @click='sponsorRepo()') Sponsor repo

          el-dropdown-item
            el-button(type='text' size="small" @click='openTelegram()') Chat to us
              img.telegram(src='https://telegram.org/img/t_logo.png')

          el-dropdown-item
            el-button(type='text' size="small" @click='openVideo()') Help video
              img.youtube(src='https://www.youtube.com/yt/about/media/images/brand-resources/icons/YouTube_icon_full-color.svg')

          el-dropdown-item(:divided="true")
            el-button(type='text', size="small" @click='logout()') Sign out

</template>

<script>

import entities from '@/mixins/entities'
import user from '@/mixins/user'

import { auth } from '@/firebase'

export default {
  data () {
    return {}
  },
  mixins: [user, entities],

  methods: {
    openVideo () {
      window.open(`https://youtu.be/pw3AFkWl2qc`, '_blank')
    },
    sponsorRepo () {
      // TODO: implement
    },
    logout () {
      auth.signOut()
        .then(() => {
          this.$router.push({ name: 'login' })
        })
    },
    openTelegram () {
      window.open('https://t.me/joinchat/Gr-5fxF7FTHdNfzKQKJGgQ', '_blank')
    }
  }
}
</script>
