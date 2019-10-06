<template lang="pug">
  div.v-sidebar-menu(:class="[!isCollapsed ? 'vsm-default' : 'vsm-collapsed', theme, rtl ? 'rtl' : '']" :style="{'width': sidebarWidth}" @mouseleave="mouseLeave")

    div.vsm-list
      div(v-if="!isCollapsed")

        slot

    el-button(type="primary" circle @click="toggleCollapse" class="help-button" style="text-align")
      icon.help-icon(icon-name="question" :height="32" :width="32")

</template>

<script>

import { animationMixin } from '../../mixins/sidebar'
import Icon from '@/components/core/Icon'

export default {
  name: 'Sidebar',
  components: {
    Icon
  },
  mixins: [animationMixin],
  props: {
    collapsed: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '500px'
    },
    widthCollapsed: {
      type: String,
      default: '50px'
    },
    showChild: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'white-theme'
    },
    showOneChild: {
      type: Boolean,
      default: false
    },
    rtl: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isCollapsed: this.collapsed,
      mobileItem: null,
      mobileItemPos: 0,
      mobileItemHeight: 0,
      closeTimeout: null,
      activeShow: null
    }
  },
  computed: {
    sidebarWidth () {
      return this.isCollapsed ? this.widthCollapsed : this.width
    }
  },
  watch: {
    collapsed (val) {
      this.isCollapsed = val
    }
  },
  created () {
    this.$on('mouseEnterItem', (val) => {
      this.mobileItem = null
      this.$nextTick(() => {
        this.mobileItem = val.item
        this.mobileItemPos = val.pos
        this.mobileItemHeight = val.height
      })
    })

    this.$on('touchClickItem', (clearCloseTimeout) => {
      if (clearCloseTimeout) {
        clearTimeout(this.closeTimeout)
        return
      }
      if (this.closeTimeout) clearTimeout(this.closeTimeout)
      this.closeTimeout = setTimeout(() => {
        this.mouseLeave()
      }, 600)
    })
  },
  methods: {
    mouseLeave () {
      this.mobileItem = null
    },
    toggleCollapse () {
      this.isCollapsed = !this.isCollapsed
      this.$emit('collapse', this.isCollapsed)
    },
    onActiveShow (uid) {
      this.activeShow = uid
    },
    onItemClick (event, item) {
      this.$emit('itemClick', event, item)
    }
  },
  provide () {
    const activeShow = {}
    Object.defineProperty(activeShow, 'uid', {
      enumerable: true,
      get: () => this.activeShow
    })
    return {
      showChild: this.showChild,
      showOneChild: this.showOneChild,
      emitActiveShow: this.onActiveShow,
      activeShow,
      emitItemClick: this.onItemClick,
      rtl: this.rtl
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/sidebar/vue-sidebar-menu.scss';
</style>

<style>
.help-button {
  height: 40px;
  width: 40px;
  margin-top: 5px;
  opacity: 1 !important;
  margin-right: 5px;
  padding: 2px !important;
}

.help-icon {
  opacity: 1 !important;
  height: 32px;
  width: 32px;
}

</style>
