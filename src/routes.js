import Vue from "vue";
import TableData from "@/components/TableData";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    name: "Home",
    // Wildcard path
    path: "*",
    // Specify the component to be rendered for this route
    component: TableData,
    // Inject  props based on route.query values (our query parameters!)
    props: function props(route) {
      return {
        area: route.query.area,
        stage: route.query.stage
      };
    }
  }
];

export default function createRouter(store) {
  var router = new Router({
    mode: "history",
    routes: routes
  });

  router.afterEach((to, from) => {
    if (
      store.getters.getFromRoute === "change-area" ||
      store.getters.getFromRoute === "change-stage"
    ) {
      setTimeout(function() {
        store.commit("setLoading", { show: false, message: "" });
        console.error("stop");
      }, 500);
    }
  });

  return router;
}
