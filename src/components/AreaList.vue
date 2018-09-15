<template>
  <div>
      <select style="display:inline; width:360px" @change="updateArea(selected)" v-model="selected">
          <option v-for="(value, key) in getAreas" :key="key" :value="value.ID" :selected="selected==value.ID">{{value.Title}}</option>
      </select>
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
        ...Vuex.mapGetters(["getAreas", "getSelectedArea", "getSelectedStage"])
    },

    methods: {
        ...Vuex.mapMutations(["setFromRoute", "setLoading", "setSelectedArea"]),

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