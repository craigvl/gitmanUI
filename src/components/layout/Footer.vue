<template lang="pug">
  nav.gm-footer(v-if='$parent.showWelcome === false')
    .gm-footer__content
      .triple-item
        router-link.triple-item__item(id='about', :to=`{ name: 'about' }`) About GitMan
</template>
