<template>
    <div>
        
        <div id="loading-overlay" v-show="getLoading.show">
            <div id="loading-content">
                <div v-html="getLoading.message"></div>
                <progress-bar :width="getLoading.width"></progress-bar>
            </div>
        </div>

        <div class="de-center de-header1">
            <div class="de-width-headers" :class="{'width-IE':isIE}">Dashboard Powered By Web Worker</div>
            <div id="ie-message" v-if="isIE">
                <div><i class="material-icons">error</i></div>
                <div>Some features on this dashboard are not available on IE.
                For better performance, please use Chrome. (go/Chrome)</div>
            </div>
        </div>

        <div class="de-center de-header2">
            <div class="de-width-headers">
                <area-list></area-list>
            </div>
        </div>

        <div class="de-center de-header3">
            <de-tabs></de-tabs>
        </div>

        <div class="de-legend sticky">
            <div class="de-legend-item">
                <i class="material-icons" style="color:#D8D8D8">brightness_1</i>
                &nbsp;Not started
            </div>
            <div class="de-legend-item">
                <i class="material-icons" style="color:#AA66DD">brightness_1</i>
                &nbsp;Scheduled
            </div>
            <div class="de-legend-item">
                <i class="material-icons" style="color:#59C2E7">brightness_1</i>
                &nbsp;In progress
            </div>
            <div class="de-legend-item">
                <i class="material-icons" style="color:#E92C2C">brightness_1</i>
                &nbsp;Impediment
            </div>
            <div class="de-legend-item">
                <i class="material-icons" style="color:#51B735">brightness_1</i>
                &nbsp;Completed
            </div>
        </div>

        <router-view></router-view>
        
    </div>

</template>

<script>
import Vuex from 'vuex';
import AreaList from '@/components/AreaList';
import DeTabs from '@/components/DeTabs';
import DeTabMenus from '@/components/DeTabMenus';
import TableData from '@/components/TableData';
import ProgressBar from '@/components/ProgressBar';
import axios from 'axios';
/*import Worker from 'worker-loader!../../public/webWorker.js';*/

export default {
    data() {
        return {
            webWorker: null
        }
    },

    components: {
        "area-list": AreaList,
        "de-tabs": DeTabs,
        "de-tab-menus": DeTabMenus,
        "table-data": TableData,
        "progress-bar": ProgressBar
    },

    computed: {
        ...Vuex.mapGetters([
            "getActivities", 
            "getActivityPercents", 
            "getAreas", 
            "getBizDeliverables", 
            "getDEGPGlidePaths", 
            "getDEGPIterations",
            "getLoading",
            "getStages", 
            "getStatuses"
        ]),
        isIE() {
            return (window.navigator.userAgent.indexOf('MSIE') > 0);
        }
    },

    destroyed() {
        this.stopWorker();
    },

    created() {
        axios.all([
            this.fetchActivities(), 
            this.fetchAreas(), 
            this.fetchBizDeliverables(), 
            this.fetchStages(), 
            this.fetchStatuses(),
            this.fetchDEGPGlidePaths(),
            this.fetchDEGPIterations()
        ]).then( () => {
            // All requests are now complete but allow script to catch up
            setTimeout(()=>{
                this.addGlidePathsToBizDeliverables();
                //TODO: Better performance JSON.stringify https://nolanlawson.com/2016/02/29/high-performance-web-worker-messages/
                this.startWorker(this.getActivities, this.getAreas, this.getBizDeliverables, this.getStages, this.getStatuses);
            },100);
        }).catch((e) => {
            console.error('All Requests Error:', e);
        });
    },

    methods: {
        ...Vuex.mapActions([
            "fetchActivities", 
            "fetchAreas", 
            "fetchBizDeliverables", 
            "fetchStages", 
            "fetchStatuses", 
            "fetchDEGPGlidePaths", 
            "fetchDEGPIterations"
        ]),
        ...Vuex.mapMutations([
            "setActivityPercents", 
            "setBDPercents", 
            "setBizDeliverables",
            "setLoading",
            "setStagePercents"
        ]),
        
        addGlidePathsToBizDeliverables() {
            let glidePathsByIteration = null;
            let BDS = this.getBizDeliverables;

            for (let i = 0; i<this.getDEGPIterations.length; i++) {
                //filter Glidepaths by ID
                glidePathsByIteration = this.getDEGPGlidePaths.filter( (item) => {
                    return (this.getDEGPIterations[i].ID == item.Iteration_x0020_TitleId);
                });
                for (let g = 0; g<glidePathsByIteration.length; g++) {
                    for (let bd of BDS) {
                        if (bd.ID == glidePathsByIteration[g].NumberingId) {
                            bd = Object.assign(bd, {
                                Iteration_ID: this.getDEGPIterations[i].ID,
                                Iteration_End_Date: this.getDEGPIterations[i].Documentation_x0020_End_x0020_Da,
                                Iteration_Start_Date: this.getDEGPIterations[i].Documentation_x0020_Start_x0020_,
                                Iteration_Year: this.getDEGPIterations[i].Plan_x0020_Year
                            });
                        }
                    }
                }
            }

            this.setBizDeliverables(BDS);
        },

        refreshStatuses() {
            this.setLoading({show: true, message:'Refreshing Data...', width:25});
            this.fetchStatuses()
            .then(() => {
                this.setLoading({show: true, message:'Rebuilding Data Structures...', width:50});
                this.webWorker.postMessage([
                    this.getActivities, 
                    this.getAreas, 
                    this.getBizDeliverables, 
                    this.getStages, 
                    this.getStatuses
                ]);
                this.setLoading({show: true, message:'Computing Percentages...', width:75});
            }).catch((e) => {
                console.error('Refresh Statuses Request Error:', e);
            });
        },

        startWorker(activities, areas, bds, stages, statuses) {
            if (typeof(Worker) !== "undefined") {
                if (this.webWorker == null) {
                    this.webWorker = new Worker('/webWorker.js');
                }
                this.webWorker.postMessage([
                    activities, 
                    areas, 
                    bds, 
                    stages, 
                    statuses
                ]);
                let that = this;
                this.webWorker.onmessage = function(e) {
                    that.setActivityPercents( e.data[0]);
                    that.setBDPercents( e.data[1]);
                    that.setStagePercents( e.data[2]);
                    that.setLoading({show: false, message:''});
                }
            } else {//browser does not support web workers
                alert('Your browser does not support web workers. Try Google Chrome.');
            }
        },

        stopWorker() { 
            this.webWorker.terminate();
            this.webWorker = null;
        }
    }
}
</script>