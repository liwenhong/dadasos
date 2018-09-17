<template>
  <div>
    <card v-on:addOrder="toAddOrder"></card>
  </div>
</template>

<script>
import card from '@/components/card.vue'
export default {
  data () {
    return {

    }
  },
  components:{
    card
  },
  mounted () {

  },
  methods: {
    toAddOrder(val){
      console.log(val)

    }
  }
}
</script>

<style lang="scss" scoped>

</style>

