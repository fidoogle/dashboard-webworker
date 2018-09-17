<template>
  <div>

        <div class="area-select" v-show="getStageHover!==-1" style="left: 50px;">
          <div class="area-select-title">
            <div class="area-title-header">Area</div>
            <div class="area-complete-header">Completed</div>
          </div>
          <div class="area-select-row" v-for="(value2, key2) in getAreas" :key="key2" :value="value2.ID">
            <div class="area-title">{{value2.Title}}</div>
            <div class="area-complete">{{percent(value2.ID)}}</div>
          </div>
        </div>

  </div>

</template>

<script>
import Vuex from 'vuex';

export default {

    computed: {
      ...Vuex.mapGetters(["getAreas", "getSelectedArea", "getSelectedStage", "getStages", "getStageHover", "getStagePercents"]),

      stagePercents() {
        const percents = this.getStagePercents.filter((item) => {
            return (item.stageID == this.getStageHover); //don't use ===
          });
        return percents;
      }
    },

    methods: {
      percent(id) {
        const areaPercent = this.stagePercents.filter((item) => {
            return (item.areaID == id); //don't use ===
          });
        if (areaPercent[0] && areaPercent[0].percent)
          return areaPercent[0].percent;
        return '?%'
      }
    }
}
</script>

<style>
.area-select {
  position: absolute;
  top: 132px;
  z-index: 10;
  width: 360px;
  border: 1px solid #ccc;
  border-radius: 6px;
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
.area-select-row, .area-select-title {
  padding: 2px 10px 2px 10px;
  flex: 0 1 auto;
  align-self: stretch;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.area-select-row:hover {
  cursor: pointer;
  background-color: #eee;
}
.area-title-header, .area-complete-header {
  color: black;
  font-weight: bold;
}
.area-title, .area-complete {
  color: black;
}
</style>