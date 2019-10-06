export default {
  computed: {
    user () {
      return {
        ...this.$root.$children[0].firebaseUser,
        key: this.$root.$children[0].firebaseUser['.key'],
        isAdmin: this.$admins.includes(this.$root.$children[0].firebaseUser.email)
      }
    }
  }
}
