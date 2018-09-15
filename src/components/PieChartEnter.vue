<template>
  <div>
    <pie-chart :chart-data="datacollection" :width="100" :height="100"></pie-chart>
  </div>
</template>

<script>
import Vuex from 'vuex';
import PieChart from '@/components/PieChart';

//COLORS: Not started, Scheduled, In progress, Impediment, Completed
const COLORS = ['#D8D8D8', '#AA66DD', '#59C2E7', '#D74037', '#51B735'];

export default {

  components: {
    PieChart
  },

  props: {
    index: {
      type: Number,
      default: 0
    },
    filterStagePercents: {
      type: Array
    }
  },

  components: {
    PieChart
  },

  computed: {
    ...Vuex.mapGetters(["getSelectedArea", "getStages", "getStagePercents"]),

    stageCounts() {
        let result = [0, 0, 0, 0, 0];
        const filteredPercents = this.filterStagePercents;
        if (filteredPercents && filteredPercents[this.index]) {
            result = [filteredPercents[this.index].notstarted, filteredPercents[this.index].scheduled, filteredPercents[this.index].inprogress, filteredPercents[this.index].impediment, filteredPercents[this.index].completed];
        }
        return result;
    },

    datacollection: function datacollection() {
        return {
            labels: ['', '', '', '', ''],
            datasets: [{
                backgroundColor: COLORS,
                data: this.stageCounts
            }]
        };
    }
  }
}
</script>