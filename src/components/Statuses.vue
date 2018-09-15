<template>
  <div class="de-content-right">
    <div class="de-content-right-items padded" v-for="(valueActivity, keyActivity) in getActivitiesFiltered" :key="keyActivity">

    <a href="#" class="node-tooltip" @click="editStatus(value.ID)" v-if="value.Activity.ID===valueActivity.ID" v-for="(value, key) in statusesFiltered" :key="key">
        <i class="material-icons" :class="getStatusClass(value.Status)" :data-status="getStatusClass(value.Status)" :data-activity-id="valueActivity.ID" :data-biz-id="bizID">brightness_1</i>
        <span class="node-tooltiptext" :class="{wide: value.Comments.length>150}" v-html="value.Comments" v-if="value.Comments"></span>
    </a>

    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import _ from "lodash";

export default {

    props: {
        bizID: {
            type: Number,
            default() {
                return -1;
            }
        }
    },

    computed: {
        ...Vuex.mapGetters(["getActivitiesFiltered", "getStatuses"]),

        statuses() {
            return this.getStatuses;
        },

        statusesFiltered() {
            let bizID = this.bizID;
            let filterByBizDeliverable = _.filter(this.getStatuses, function(item) {
                return (item.BD.ID == bizID);
            });
            return filterByBizDeliverable;
        }
    },

    methods: {
        ...Vuex.mapMutations(["setLoading"]),

        editStatus(id) {
            window.openDialog(_spPageContextInfo.webAbsoluteUrl+'/Lists/DE%20Dash%20Values/EditForm.aspx?ID='+id);
        },

        getStatusClass(pStatus) {
            let status = pStatus.toLowerCase().trim();
            if (status==='scheduled') return 'scheduled';
            else if (status==='complete' || status==='completed') return 'complete';
            else if (status==='in progress') return 'in-progress';
            else if (status==='impediment') return 'impediment';
            else  return 'not-started';
        }
    },

    beforeUpdate() {
        if (this.getFromRoute==='change-area' || this.getFromRoute==='change-stage') {
            this.setLoading({show: true, message:'Rendering Statuses...', width:90});
        }
        //console.warn("LOAD: Rendering Statuses");
    },
    updated() {
        //this.setLoading({show: false, message:''});
        //console.log("LOAD: Rendering Statuses FINISHED");
    }

}
</script>