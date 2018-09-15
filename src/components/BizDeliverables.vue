<template>
  <div>
    <div class="de-content-row" v-for="(value, key) in deliverablesFiltered" :key="key">
      <div class="de-content-left" :class="{ 'biz-deliverable': bizDeliverable(value), 'member-experience': !bizDeliverable(value) }">
        <table class="bd-table"><tr><td><a class="bd-link" @click="passToDeds(value.Numbering, value.Title)">{{value.Numbering}} {{value.Title}}</a></td></tr></table>
        <div>
            {{showBDPercents[key].percent}}
        </div>
      </div>
      
      <div class="vertical glidedates" v-if="value.Iteration_Start_Date && getSelectedStage==3">
        <div>{{ value.Iteration_Start_Date | formatDate }}</div>
        <div>{{ value.Iteration_End_Date | formatDate }}</div>
      </div>

      <div class="vertical glidedates" v-else-if="getSelectedStage==3">
        <div> &mdash; </div>
      </div>

      <statuses :bizID="value.ID"></statuses>
        
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import Statuses from '@/components/Statuses';

export default {

    components: {
        "statuses": Statuses
    },

    computed: {
        ...Vuex.mapGetters(["getBDPercents", "getBizDeliverables", "getFromRoute", "getLoading", "getSelectedArea", "getSelectedStage"]),

        deliverablesFiltered() {
            let areaID = this.getSelectedArea;
            let filterByArea = this.getBizDeliverables;

            if (this.getSelectedArea == 2018) { //TODO: careful with strings, may need to parseInt
                filterByArea = this.getBizDeliverables.filter((item) => {
                    return (item.Iteration_Year == this.getSelectedArea);
                });
            } else if (this.getSelectedArea != -1) { //Careful with query params that are strings, don't use !==
                filterByArea = this.getBizDeliverables.filter((item) => {
                    return (item.Tag_x0020_lookupId == areaID); //don't use ===
                });
            }

            return filterByArea;
        },

        showBDPercents() {
            let selectedArea = this.getSelectedArea;
            let selectedStage = this.getSelectedStage;
            let filterByAreaStage = this.getBDPercents.filter((item) => {
                return (item.areaID == selectedArea && item.stageID == selectedStage);
            });

            if (filterByAreaStage.length===0) {
                let empty = [];
                for(let i=0; i<this.deliverablesFiltered.length; i++) {
                    empty.push({percent:'?'});
                }
                filterByAreaStage = empty;
            }

            return filterByAreaStage;
        }
    },

    methods: {
        ...Vuex.mapMutations(["setLoading", "setSelectedArea"]),

        bizDeliverable(val) {
            return (val.Only_x0020_for_x0020_Level_x0020==="Business Deliverable");
        },

        passToDeds(id, title) {
            window.open(window._spPageContextInfo.webAbsoluteUrl+'/Pages/DEDS.aspx?BD_Id='+id, '_blank');
        }
    },
    
    watch: {
        '$route'(to, from) {
            let area = to.query.area;
            if (!area) area = -1;
            this.setSelectedArea(area);
        }
    },

    beforeUpdate() {
        var msg = 'Rendering Business Deliverables...'
        if ( (this.getFromRoute==='change-area' || this.getFromRoute==='change-stage') && this.getLoading.message!==msg ) {
            this.setLoading({show: true, message:msg, width:80});

            //Backup to stop message in case router.afterEach doesn't fire at the end
            if (this.getLoading.message !== '') {
                setTimeout(() => {
                    this.setLoading( { show: false, message: '', width: 0 });
                    //console.error('stop in bizdeliverable');
                }, 0);
            }
        }
        //console.warn("LOAD: Rendering Business Deliverables: ", this.getFromRoute);
    }

}
</script>