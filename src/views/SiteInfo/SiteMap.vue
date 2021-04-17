<template>
  <showMap @mapSend="mapSend($event)"></showMap>
</template>
<script>
const showMap = () => import('@/components/showMap.vue')
export default {
  data () {
    return {}
  },
  components: {
    showMap
  },
  methods: {
    // Get message from showMap son.
    mapSend (ev) {
      this.$emit('getMapId', ev.mapId)
    }
  }
}
</script>
<style lang="scss" scoped></style>
