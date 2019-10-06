<template lang="pug">
  section.login-container(v-loading.fullscreen.lock='loading')

    div
      .login-container__content
        .logo-large

      h1.text-center Beta

      el-row(type="flex" justify="center")
        el-tag.error-login(v-if="errorMessage" closable type="danger")  {{errorMessage}}

      el-row(type="flex" justify="center")
        .button-login(type='button', @click='login') Continue with GitHub

</template>

<script>
import { auth, githubProvider } from '@/firebase'

export default {
  name: 'login',
  data () {
    return {
      loading: false,
      errorMessage: ''
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
      this.loading = true
      auth.signInWithRedirect(githubProvider).then(result => {
        this.errorMessage = ''
        this.$router.push({ name: 'welcome' })
      })
    }
  }
}
</script>
