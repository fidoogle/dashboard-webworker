<template>
  <div>
    <select style="display:inline; width:360px" @change="updateArea(selected)" v-model="selected">
      <option v-for="(value, key) in getAreas" :key="key" :value="value.ID" :selected="selected==value.ID">{{value.Title}}</option>
    </select>
    <div class="area-select">
      <div class="area-select-row">
        <div class="area-title"><b>Area</b></div>
        <div class="area-complete"><b>{{stageTitle}}</b></div>
      </div>
      <div class="area-select-row" v-for="(value, key) in getAreas" :key="key" :value="value.ID">
        <div class="area-title">{{value.Title}}</div>
        <div class="area-complete">{{percent(value.ID)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';

export default {

    data() {
        return {
            selected: null
        }
    },

    computed: {
        ...Vuex.mapGetters(["getAreas", "getSelectedArea", "getSelectedStage", "getStages", "getStagePercents"]),

        stagePercents() {
          const percents = this.getStagePercents.filter((item) => {
              return (item.stageID == this.getSelectedStage); //don't use ===
           });
          return percents;
         },

        stageTitle() {
          const stage = this.getStages.filter((item) => {
              return (item.ID == this.getSelectedStage); //don't use ===
           });
          return stage[0].Title;
        }
    },

    methods: {
        ...Vuex.mapMutations(["setFromRoute", "setLoading", "setSelectedArea"]),

        percent(id) {
          const areaPercent = this.stagePercents.filter((item) => {
              return (item.areaID == id); //don't use ===
           });
          return areaPercent[0].percent;
         },

        setDefaultArea(area) {
            let areaID = area;
            if (!areaID) {
                areaID = -1; //Default to All areas
            }
            if (navigator.userAgent.indexOf("MSIE") > -1 && areaID == -1) { //Don't add All for IE
                areaID = 2; //TODO: default to first ID in areas list. In PROD set areaID=1
            }
            this.setSelectedArea(areaID);
            this.selected = areaID;
        },

        updateArea(selected) {
            this.setFromRoute("change-area");
            this.setSelectedArea(selected);
            this.$router.push({ query:{'area': this.selected, 'stage': this.getSelectedStage} });
        }
    },

    mounted() {
        let area = this.$route.query.area;
        this.setDefaultArea(area);
    },

    watch: {
        '$route'(to, from) {
            this.setLoading({show: true, message:'Setting Area...', width:20});
            let area = to.query.area;
            this.setDefaultArea(area);
        }
    },

    beforeUpdate() {
        /*if (this.getFromRoute==='change-area' || this.getFromRoute==='change-stage') {
            this.setLoading({show: true, message:'Setting Selected Area...'});
        }*/
        //console.log("LOAD: Setting Selected Area");
    }
}
</script>
<style>
.area-select {
  z-index: 10;
  width: 360px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  background-color: white;
  -webkit-box-shadow: -1px 10px 39px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: -1px 10px 39px 0px rgba(0,0,0,0.75);
  box-shadow: -1px 10px 39px 0px rgba(0,0,0,0.75);

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.area-select-row {
  flex: 0 1 auto;
  align-self: stretch;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.area-title {
  color: black;
}
.area-complete {
  color: black;
}
</style>