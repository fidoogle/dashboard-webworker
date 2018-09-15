<template>
  <div class="de-tabs de-width-headers">
    <div class="de-tab" :class="{selected: value.ID===getSelectedStage}" 
    v-for="(value, key) in getStages" :key="key" @click="setStage(value.ID)">
        <div>{{value.Title}}</div>
        <div><pie-chart-enter :index="key" :filterStagePercents="filterStagePercents"></pie-chart-enter></div>

        <div v-if="false">
          <div>{{ showStagePercents[key].percent }}</div>
          <div>Complete</div>
        </div>
       
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import _ from "lodash";
import PieChartEnter from '@/components/PieChartEnter';

export default {

    components: {
        "pie-chart-enter": PieChartEnter
    },

    computed: {
        ...Vuex.mapGetters(["getSelectedArea", "getSelectedStage", "getStages", "getStagePercents"]),

        filterStagePercents() {
            let selectedArea = this.getSelectedArea; console.log('selectedArea2:', selectedArea, ' getStagePercents2', this.getStagePercents);
            let filterByArea = _.filter(this.getStagePercents, function(item) {
                return (item.areaID == selectedArea);
            });
            if (filterByArea.length===0) {
                let empty = [];
                for(let i=0; i<this.getStages.length; i++) {
                    empty.push({
                        areaID: selectedArea,
                        percent: '0%',
                        stageID: this.getStages[i].ID,
                        notstarted: 1,
                        scheduled: 0,
                        inprogress: 0,
                        impediment: 0,
                        completed: 0
                    });
                }
                filterByArea = empty;
            }

            return filterByArea;
        },
        
        showStagePercents() {
            let selectedArea = this.getSelectedArea;
            let filterByArea = _.filter(this.getStagePercents, function(item) {
                return (item.areaID == selectedArea);
            });
            if (filterByArea.length===0) {
                let empty = [];
                for(let i=0; i<this.getStages.length; i++) {
                    empty.push({percent:'?'});
                }
                filterByArea = empty;
            }

            return filterByArea;
        }
    },

    methods: {
        ...Vuex.mapMutations(["setFromRoute", "setLoading", "setSelectedStage"]),

        setStage(id) {
            this.setFromRoute('change-stage');
            this.setSelectedStage(id);
            this.$router.push({ query:{'area': this.getSelectedArea, 'stage': id} });
        }
    },
    
    mounted() {
        var stage = this.$route.query.stage;
        if (!stage) stage = 3;
        this.setSelectedStage(stage);
    },

    beforeUpdate() {
        if (this.getFromRoute==='change-area' || this.getFromRoute==='change-stage') {
            this.setLoading({show: true, message:'Building Tabs...', width:40});
        }
        //console.warn("LOAD: Building Tabs");
    },
    updated() {
        //this.setLoading({show: false, message:''});
        //console.log("LOAD: Building Tabs FINISHED");
    },

    watch: {
        '$route'(to, from) {
            let stage = to.query.stage;
            if (!stage) stage = 3;
            this.setSelectedStage(stage);
        }
    }
}
</script>