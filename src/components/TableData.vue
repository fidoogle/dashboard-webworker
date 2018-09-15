<template>
  <div class="de-center">
    <div class="de-content" :style="{ 'min-width': getContentWidth + 'px' }">
        <div class="de-content-row title sticky">
            <div class="de-content-left de-content-left-title">
                Business Deliverables & Experiences
            </div>


            <div class="vertical glidedates-title" v-if="getSelectedStage==3">
                <div>Planned Glide Path</div>
                <div>Start date</div>
                <div>End date</div>
            </div>
            
            <activities></activities>
            
        </div>
        
        <biz-deliverables></biz-deliverables>

    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import Activities from '@/components/Activities';
import BizDeliverables from '@/components/BizDeliverables';

export default {
    components: {
        "activities": Activities,
        "biz-deliverables": BizDeliverables
    },

    methods: {
        ...Vuex.mapMutations(["setLoading"])
    },

    computed: {
        ...Vuex.mapGetters(["getContentWidth", "getSelectedStage"])
    },

    beforeUpdate() {
        //this.setLoading({show: true, message:'Buidling Table...'});
        //console.log("LOAD: Buidling Table");
    }
}
</script>