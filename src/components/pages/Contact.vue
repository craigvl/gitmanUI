<template lang="pug">
  section(class='body-section', v-loading.fullscreen.lock='loading')
    AppHeader

    AppFooter
</template>

<script>
import { auth, database } from '@/firebase'
import AppHeader from '@/components/layout/Header'
import AppFooter from '@/components/layout/Footer'

export default {
  name: 'about',
  data () {
    return {
      loading: false,
      ethUSD: null,
      showModal: false,
      showHeader: true,
      showWelcome: false,
      showModalDeposit: false
    }
  },
  validations: {},
  firebase: {
    user: database.ref('user')
  },
  components: {
    AppHeader,
    AppFooter
  },
  methods: {
    logout () {
      auth.signOut().then(() => {
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>
