<template>
    <div id="bg" class="bg">
        <div class="login" @keyup.13="doLogin">
            <div class="form-horizontal login">
                <div class="logo">THU琴房预约管理系统登录</div>

                <div>
                    <select v-model="userInfo.userType">
                        <option value="0">管理员</option>
                        <option value="1">审核人员</option>
                    </select>
                </div>

                <div class="form-group input-group input-group-lg ">
                    <span class="input-group-addon"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                    <input type="text" class=" form-control" placeholder="账户名" v-model="userInfo.userName">
                </div>
                <div class="form-group input-group input-group-lg">
                    <span class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></span>
                    <input type="password" class=" form-control" placeholder="账户密码" v-model="userInfo.password">
                </div>
                <div class="form-group">
                    <button class="btn btn-default btn-sm form-control login-btn" @click="doLogin">登 录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "../https";
    import * as utils from "../js/utils"

    export default {
        name: "login",
        data() {
            return {
                userInfo: {
                    userType: "0",
                    userName: "",
                    password: "",
                }
            }
        },
        methods: {
            doLogin() {

                let that = this;

                console.log(this.userInfo.userType);
                if (!that.userInfo.userName) {
                    alert("用户名不能为空");
                    return false
                }
                if (!that.userInfo.password) {
                    alert("密码名不能为空");
                    return false
                }


                axios.post("/manager/login", this.userInfo)
                    .then(res => {
                        console.log(res);
                        if (res.status === 200) {
                            this.$store.commit(utils.LOGIN, window.localStorage.getItem("token"));
                            localStorage.token_expire = res.data.expire;

                            that.$notify({
                                group: "infoPlace",
                                title: "提示信息",
                                text: "登录成功",
                                type: "success"
                            });

                            localStorage.token = res.data.token;
                            localStorage.realName = res.data.realName;

                            that.$router.push({path: "/index"});
                        } else {
                            that.$notify({
                                group: "infoPlace",
                                title: "提示信息",
                                text: res.data.info,
                                type: "error"
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.$notify({
                            group: "infoPlace",
                            title: "提示信息",
                            text: err.info,
                            type: "error"
                        });
                    })
            }
        },
        mounted() {
            let wi = window.screen.width;
            let hi = window.screen.height;
            document.getElementById("bg").style.width = wi + "px";
            document.getElementById("bg").style.height = hi + "px";
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*.bg {*/
    /*!*background-color: aqua;*!*/
    /*background-image: url("../assets/bj.jpg");*/
    /*background-size:100% 100%*/
    /*}*/
    .login {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 400px;

    }

    .login-btn {
        background-color: whitesmoke;
    }

    .logo {
        font-family: "DejaVu Sans Mono";
        color: lightblue;
        font-size: 50px;
    }
</style>