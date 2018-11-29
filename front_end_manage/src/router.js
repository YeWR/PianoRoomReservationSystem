import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "login",
            component: Login
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/index",
            name: "index",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "about" */ "./views/Index.vue")
        }
    ]
});
