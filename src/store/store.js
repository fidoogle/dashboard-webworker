import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import _ from "lodash";

Vue.use(Vuex);

export default function createStore(appId) {
  return new Vuex.Store({
    state: {
      activities: [],
      activityPercents: [],
      areas: [],
      contentWidth: 1024,
      bizDeliverables: [],
      bdPercents: [],
      DEGPGlidePaths: [],
      DEGPIterations: [],
      fromRoute: "page-load",
      loading: {
        show: false,
        message: "",
        width: "60%"
      },
      selectedArea: -1,
      selectedStage: 3,
      stages: [],
      stageHover: -1,
      stagePercents: [],
      statuses: [],
      statusesFiltered: []
    },

    getters: {
      getActivities(state) {
        return state.activities;
      },
      getActivityPercents(state) {
        return state.activityPercents;
      },
      getActivitiesFiltered(state) {
        var stageID = state.selectedStage;
        var filterByStage = _.filter(state.activities, function(item) {
          return item.Stage.ID === stageID;
        });

        return filterByStage;
      },
      getAreas(state) {
        return state.areas;
      },
      getBDPercents(state) {
        return state.bdPercents;
      },
      getBizDeliverables(state) {
        return state.bizDeliverables;
      },
      getContentWidth(state) {
        return state.contentWidth;
      },
      getDEGPGlidePaths(state) {
        return state.DEGPGlidePaths;
      },
      getDEGPIterations(state) {
        return state.DEGPIterations;
      },
      getFromRoute: function getFromRoute(state) {
        return state.fromRoute;
      },
      getLoading: function getLoading(state) {
        return state.loading;
      },
      getSelectedArea(state) {
        return state.selectedArea;
      },
      getSelectedStage(state) {
        return state.selectedStage;
      },
      getStages(state) {
        return state.stages;
      },
      getStageHover(state) {
        return state.stageHover;
      },
      getStagePercents(state) {
        return state.stagePercents;
      },
      getStatuses(state) {
        return state.statuses;
      },
      getStatusesFiltered(state) {
        return state.statusesFiltered;
      }
    },

    mutations: {
      setActivities(state, payload) {
        state.activities = payload;
        //console.log('setActivities:',payload);
      },
      setActivityPercents(state, payload) {
        state.activityPercents = payload;
        //console.log('setActivityPercents:',payload);
      },
      setAreas(state, payload) {
        //Trim excess data
        var newArray = payload.map(function(item) {
          return {
            ID: item.ID,
            Title: item.Title
          };
        });
        //Don't add All for IE
        if (navigator.userAgent.indexOf("MSIE") == -1) {
          newArray.unshift({ ID: -1, Title: "All" });
        }
        newArray.push({ ID: 2018, Title: "2018 Glidepath" }); //TODO: extend to more glidepaths
        state.areas = newArray;
        //console.log('state.areas:', state.areas);
      },
      setBDPercents(state, payload) {
        state.bdPercents = payload;
        //console.log('setBDPercents', payload);
      },
      setBizDeliverables(state, payload) {
        var deliverables = payload.filter(function(item) {
          return item.Numbering.split(".").length === 3;
        });
        state.bizDeliverables = sortNumbering(deliverables);
        //console.log('state.bizDeliverables:', state.bizDeliverables);
      },
      setContentWidth(state, payload) {
        if (payload < 1024) {
          state.contentWidth = 1024;
        } else {
          state.contentWidth = payload;
        }
      },
      setDEGPGlidePaths(state, payload) {
        //Trim excess data
        state.DEGPGlidePaths = payload.map(function(item) {
          return {
            ID: item.ID,
            Iteration_x0020_TitleId: item.Iteration_x0020_TitleId,
            NumberingId: item.NumberingId
          };
        });
        //console.log('state.DEGPGlidePaths:', state.DEGPGlidePaths);
      },
      setDEGPIterations(state, payload) {
        //Trim excess data
        state.DEGPIterations = payload.map(function(item) {
          return {
            ID: item.ID,
            Documentation_x0020_End_x0020_Da:
              item.Documentation_x0020_End_x0020_Da,
            Documentation_x0020_Start_x0020_:
              item.Documentation_x0020_Start_x0020_,
            Plan_x0020_Year: item.Plan_x0020_Year
          };
        });
        //console.log('state.DEGPIterations:', state.DEGPIterations);
      },
      setFromRoute: function setFromRoute(state, payload) {
        state.fromRoute = payload;
      },
      setLoading: function setLoading(state, payload) {
        state.loading = payload;
      },
      setSelectedArea(state, payload) {
        var num = parseInt(payload, 10);
        state.selectedArea = num;
      },
      setSelectedStage(state, payload) {
        var num = parseInt(payload, 10);
        state.selectedStage = num;
      },
      setStages(state, payload) {
        state.stages = payload;
      },
      setStageHover(state, payload) {
        state.stageHover = payload;
      },
      setStagePercents(state, payload) {
        state.stagePercents = payload;
      },
      setStatuses(state, payload) {
        //Trim excess data
        state.statuses = payload.map(function(item) {
          return {
            ID: item.ID,
            Activity: { ID: item.Activity.ID },
            BD: { ID: item.BD.ID },
            Comments: item.Comments,
            Status: item.Status
          };
        });
        //console.log('state.statuses:', state.statuses);
      },
      setStatusesFiltered(state, bizID) {
        var filterByBizDeliverable = state.statuses.filter(function(item) {
          return item.BD.ID === bizID;
        });
        state.statusesFiltered = filterByBizDeliverable;
      }
    },

    actions: {
      fetchActivities({ commit }) {
        return axios.get("/activities.json").then(function(result) {
          commit("setActivities", result.data.d.results);
          //console.log('fetchActivities:', result.data.d.results);
        });
      },
      fetchAreas({ commit }) {
        return axios.get("/areas.json").then(function(result) {
          commit("setAreas", result.data.d.results);
          //console.log('fetchAreas:', result.data.d.results);
        });
      },
      fetchBizDeliverables({ commit }) {
        return axios.get("/bizDeliverables.json").then(function(result) {
          commit("setBizDeliverables", result.data.d.results);
          //console.log('fetchBizDeliverables:', result.data.d.results);
        });
      },
      fetchStages({ commit }) {
        return axios.get("/stages.json").then(function(result) {
          commit("setStages", result.data.d.results);
          //console.log('fetchStages:', result.data.d.results);
        });
      },
      fetchStatuses({ commit }) {
        return axios.get("/statuses.json").then(function(result) {
          commit("setStatuses", result.data.d.results);
          //console.log('fetchStatuses:', result.data.d.results);
        });
      },
      fetchDEGPGlidePaths({ commit }) {
        return axios.get("/degpGlidePaths.json").then(function(result) {
          commit("setDEGPGlidePaths", result.data.d.results);
          //console.log('fetchDEGPGlidePaths:', result.data.d.results);
        });
      },
      fetchDEGPIterations({ commit }) {
        return axios.get("/degpIterations.json").then(function(result) {
          commit("setDEGPIterations", result.data.d.results);
          //console.log('fetchDEGPIterations:', result.data.d.results);
        });
      }
    }
  });
}

//TODO: move to common code:

var MAXLEVELS = 7; //maximum # of expected levels in data, could be set high to ensure all possible levels are covered

//Sort data by Numbering of type 1.3, 1.1, 1.2, 1.1.3, 1.2.4, etc, where each dot separates the levels.
//Assumes each level is an integer. Data may be of type ['1.3', '1.1'] or [{... Numbering: '1.3'}, {... Numbering: '1.1'}]
//Externally used in Store and here internally
function sortNumbering(data) {
  return data.sort(sortNumberingBy);
}

//Define compare expression up to MAXLEVELS
var compareExp = "0"; //start with zero (false) to prevent a trailing || at end
for (var i = 0; i < MAXLEVELS; i++) {
  compareExp += "|| num1[" + i + "] - num2[" + i + "]";
}

function sortNumberingBy(a, b) {
  var aLevels;
  var bLevels;

  if (a.Numbering) aLevels = a.Numbering.split(".");
  else if (a.Process && a.Process.Numbering)
    aLevels = a.Process.Numbering.split(".");
  //For BDDS
  else aLevels = a.split(".");
  if (b.Numbering) bLevels = b.Numbering.split(".");
  else if (b.Process && b.Process.Numbering)
    bLevels = b.Process.Numbering.split(".");
  //For BDDS
  else bLevels = b.split(".");

  var num1 = [];
  var num2 = [];

  //Pad levels with zeros if level is not present
  for (var i = 0; i < MAXLEVELS; i++) {
    if (aLevels[i]) {
      num1[i] = parseInt(aLevels[i], 10);
    } else {
      num1[i] = 0;
    }
    if (bLevels[i]) {
      num2[i] = parseInt(bLevels[i], 10);
    } else {
      num2[i] = 0;
    }
  }

  return eval(compareExp);
}
