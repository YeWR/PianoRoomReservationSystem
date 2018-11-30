import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Index from "./views/Index"
import store from "./store"
import * as utils from "./js/utils"

Vue.use(Router);

const routes = [
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/",
        name: "index",
        meta: {
            requireAuth: true //需要登录验证
        },
        component: Index
    }
];

/*
 * 页面刷新时，重新赋值token
 */
if (window.localStorage.getItem("token")) {
    store.commit(utils.LOGIN, window.localStorage.getItem("token"))
}

const router = new Router({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            next();
        }
        else {
            next({
                path: "/login",
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
});

export default router;
