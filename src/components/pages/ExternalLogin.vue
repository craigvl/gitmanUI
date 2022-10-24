<template lang="pug">
section.login-container(v-loading.fullscreen.lock='loading')

    div
      .login-container__content
        .logo-large

      a.text-center Application Key
      el-input(type='text' name='appKey', v-model='appKey', placeholder='Application Key')

      a.text-center Token
      el-input(type='text' name='Token' v-model='token' placeholder='Paste token here')

      a(:href="githubLoginUrl")

      el-row(type="flex" justify="center")
        el-tag.error-login(v-if="errorMessage" closable type="danger")  {{errorMessage}}

      el-row(type="flex" justify="center")
        .button-login(type='button', @click='login') Login

</template>

<script>
import { auth, githubProvider } from '@/firebase'

export default {
  name: 'external-login',
  data () {
    return {
      loading: false,
      errorMessage: '',
      token: '',
      appKey: 'DAAFAA4BCA8',
      githubLoginUrl: ''
    }
  },
  created () {
    this.$router.onError(error => {
      this.errorMessage = error.message ? error.message : error
      if (this.errorMessage.includes('3rd party cookie')) {
        this.errorMessage += ' Please review your browser settings to enable it for this site.'
      }
    })
  },
  methods: {
    login () {
      this.$cloudFunction.authExternalUser(this.appKey, this.token).then(result => {
        auth().signInWithCredential()

        auth.signInWithCustomToken(result.gitmanToken).catch(function () {})

        const credential = githubProvider.credential(result.gitmanToken)
        this.accessToken = credential.accessToken
        this.idToken = credential.idToken

        // result.gitmanToken
        // result.githubToken
        // result.userKey
        this.githubLoginUrl = result.githubLoginUrl
      })
      // auth.signInWithRedirect(githubProvider).then(result => {
      //   this.errorMessage = ''
      //   this.$router.push({ name: 'welcome' })
      // })
    }
  }
}
</script>
