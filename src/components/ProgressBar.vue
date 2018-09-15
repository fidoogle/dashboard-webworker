<template>
  <div class="progress-bar-back">
    <div class="progress-bar-front" :style="{ 'width': width + '%' }"></div>
  </div>
</template>

<script>
import Vuex from 'vuex';

export default {

    props: {
        width: {
            default() {
                return 10;
            }
        }
    },

    computed: {
        ...Vuex.mapGetters(["getLoading"])
    }
}
</script>