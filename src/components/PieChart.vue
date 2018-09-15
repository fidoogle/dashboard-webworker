<script>
import VueChartJs from 'vue-chartjs';

export default {
    extends: VueChartJs.Pie,
    mixins: [VueChartJs.mixins.reactiveProp],

    data: function data() {
        return {
            options: {
                legend: {
                    display: false
                },

                tooltips: {
                    callbacks: {
                        label: function label(tooltipItem, data) {
                            var allData = data.datasets[tooltipItem.datasetIndex].data;
                            var tooltipLabel = data.labels[tooltipItem.index];
                            var tooltipData = allData[tooltipItem.index];
                            var total = 0;
                            for (var i in allData) {
                                total += allData[i];
                            }
                            var tooltipPercentage = Math.round(tooltipData / total * 100);
                            return tooltipLabel + ': ' + tooltipPercentage + '% (' + tooltipData + ')';
                        }
                    }
                }
            }
        };
    },
    mounted: function mounted() {
        // this.chartData is created in the mixin
        this.renderChart(this.chartData, this.options);
    }
};
</script>