import Vue from "vue";
import Vuex from "vuex";
import * as utils from "./js/utils"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        token: null,
        title: ""
    },
    mutations: {
        [utils.LOGIN]: (state, data) => {
            localStorage.token = data;
            state.token = data;
        },
        [utils.LOGOUT]: (state) => {
            localStorage.removeItem("token");
            state.token = null
        },
        [utils.TITLE]: (state, data) => {
            state.title = data;
        }
    },
    actions: {}
});
