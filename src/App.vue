<template lang="pug">
#app(v-loading.fullscreen.lock='loading')
    router-view
</template>

<script>
import { auth, database } from '@/firebase'

export default {
  name: 'app',
  data () {
    return {
      loading: false,
      userGitRepos: []

    }
  },
  firebase: {
    firebaseIssues: {
      source: database.ref('issue')
    },
    firebaseJobs: {
      source: database.ref('job')
    },
    firebaseRepos: {
      source: database.ref('repo')
    }

  },
  computed: {
    gitAccessToken () {
      return this.firebaseUser.gitAccessToken
    }
  },
  beforeCreate () {
    // const retry = async (fn, retriesLeft = 10, interval = 5000, exponential = false) => {
    //   try {
    //     return await this.$gitService.getOwnedRepos()
    //   } catch (error) {
    //     if (retriesLeft) {
    //       await new Promise(r => setTimeout(r, interval))
    //       return await retry(fn, retriesLeft - 1, exponential ? interval * 2 : interval, exponential)
    //     } else throw new Error('Max retries reached')
    //   }
    // }

    auth.onAuthStateChanged(user => {
      this.loading = true
      if (user) {
        this.$bindAsObject('firebaseUser', database.ref(`user/${user.uid}`), null, (_) => {
          console.log('user ready')

          this.$gitService.getUserOwnedRepos(this.firebaseUser.gitAccessToken).then(_ => {
            this.userGitRepos = _
            console.log('repos ready')

            this.loading = false
          })
        })
        this.$bindAsArray('firebaseUserJobs', database.ref(`job/${user.uid}`), null, (_) => {
          console.log('user jobs ready')
        })
      } else {
        this.loading = false
      }
    })
  }
}
</script>

<style lang="css">
  @import 'https://unpkg.com/vue-snack/dist/vue-snack.min.css';
</style>

<style lang="scss">
  @import './styles/element-variables.scss';
  @import './styles/main.scss';
  @import './styles/sidebar/vue-sidebar-menu.scss';
</style>
