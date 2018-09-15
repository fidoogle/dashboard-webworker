import Vue from "vue";
import axios from "axios";
import moment from "moment";
import createRouter from "@/routes";
import createStore from "@/store/store";
import App from "@/components/App";

Vue.config.devtools = true;
Vue.config.productionTip = false;

//Create globals

//Default request config
axios.defaults.baseURL = "https://storage.googleapis.com/dedashboard/mockdata";
axios.defaults.headers.common["Accept"] =
  "application/json;odata=verbose;charset=utf-8";

//General filters for formatting data
Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("MM/DD/YYYY");
  }
});

/* Create Vue app for each component instance */
const x = document.querySelectorAll(".dashboard_component");

for (var i = 0; i < x.length; i++) {
  const store = createStore(i);
  new Vue({
    el: x[i],
    store: store,
    router: createRouter(store),
    data: {
      appId: i
    },
    components: { App: App },
    template: "<App :appId='appId' ref='refApp'></App>"
  });
}
