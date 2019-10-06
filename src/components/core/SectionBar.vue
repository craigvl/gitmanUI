<template lang="pug">
  div
    el-row
      el-col(:span='18')
        div.section-heading
          a(:href="'#'+anchor") {{title}}
        div.section-info {{subtitle}}
      el-col(:span='4' v-if="value!==undefined")
        el-input(type='text' v-bind:value="value" v-on:input="search($event)" placeholder='Search' )
      el-col.float-right(:span='2' v-if="withFilter")
        el-button.float-right(v-if="withFilter" type="primary" @click="filterToggled=!filterToggled")
          icon(icon-name="settings" :rotate="0.25")
    hr
    slide-up-down(:active="filterToggled" :duration="500")
      el-form(label-position="top" label-width="100px")
        el-row
          slot
      hr

</template>

<script>
import Icon from '@/components/core/Icon'

export default {
  components: {
    Icon
  },
  props: ['withFilter', 'value', 'title', 'subtitle', 'anchor'],
  data () {
    return {
      filterToggled: false
    }
  },
  mounted () {
  },
  methods: {
    search (text) {
      this.$emit('input', text)
    }
  }
}
</script>

<style>

</style>
