const {should,expect,assert} = require('chai');
const dataBase = require('../views/dataBase');
const app = require('../app');
const request = require('supertest').agent(app.listen());
const utils = require('../views/utils');
const constVariable = require("../views/const");
const uuid = require("node-uuid");
let date = new Date();
let todayDateStr = utils.getDateStr(date);
date.setDate(date.getDate() + 1);
let tomorrowDateStr = utils.getDateStr(date);
let testCampusUser = {
    type: constVariable.USERTYPE_STUDENT,
    name: "李肇阳",
    number: "2014013432",
    uuid: "",
    token: ""
};
let testUser = [{
    phoneNumber: "13220167398",
    validateCode: "1234",
    realName: "赵哲晖",
    idNumber: "140100199001011234",
    token: ""
},{
    phoneNumber: "13220167399",
    validateCode: "1234",
    realName: "赵哲晖",
    idNumber: "140100199001011234",
    token: ""
},{
    phoneNumber: "13220167390",
    validateCode: "1234",
    realName: "吴海旭",
    idNumber: "140100199001011239",
    token: ""
}];

let testPiano = {
    id: 5,
    room: 303,
    info: "testtesttest",
    stuValue: 10,
    teaValue: 15,
    socValue: 20,
    multiValue: 20,
    type: "test",
    status: 1
};

let testRule = [{
    id: 2,
    start: 12,
    end: 20,
    week: date.getDay(),
    type: 2
},{
    id: 1,
    start: 0,
    end: 6,
    week: date.getDay(),
    type: 2
},{
    id: 1,
    start: 70,
    end: 80,
    week: date.getDay(),
    type: 2
}
]

let testItem = [{
    openid: "test",
    number: testUser[0].phoneNumber,
    reservationType: 2,
    pianoId: 1,
    pianoPrice: 100,
    date: tomorrowDateStr,
    begTimeIndex: 0,
    endTimeIndex: 11,
    uuid: null
}, {
    openid: "test",
    number: testUser[2].phoneNumber,
    reservationType: 3,
    pianoId: 2,
    pianoPrice: 100,
    date: tomorrowDateStr,
    begTimeIndex: 12,
    endTimeIndex: 18,
    uuid: null
},{
    openid: "test",
    number: testUser[0].phoneNumber,
    reservationType: 2,
    pianoId: 1,
    pianoPrice: 100,
    date: todayDateStr,
    begTimeIndex: 50,
    endTimeIndex: 60,
    uuid: null
}, {
    openid: "test",
    number: testUser[2].phoneNumber,
    reservationType: 3,
    pianoId: 2,
    pianoPrice: 100,
    date: tomorrowDateStr,
    begTimeIndex: 25,
    endTimeIndex: 30,
    uuid: null
}];

describe('#interfaceUser',()=>{
    describe('userRegister',()=>{
        // it('CampusRegister',async () => {
        //
        //     let res = await request.get('/user/login/inSchool')
        //         .query({ticket: "test"})
        //         .expect(200);
        //     let user = await dataBase.SearchUser(1,0,testCampusUser.number,testCampusUser.name,null,testCampusUser.type,1);
        //     expect(user.count).equal(1);
        //     console.log(user.data);
        //     expect(user.data[0].uuid.length).equal(16);
        //     testCampusUser.uuid = user.data[0].uuid;
        // });
        it('CampusRegister',async () => {
            let useruuid = uuid.v1().replace(/\-/g,'').substring(0,16);
            let result = await dataBase.CampusUserLogin(testCampusUser.type,testCampusUser.name,testCampusUser.number, useruuid);
            expect(result.success).equal(true);
        });
        it('Societyregister',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            testUser[0].idNumber = md5(testUser[0].idNumber);
            let res = await request.post('/user/registration')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
        it('registerFalse1',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[1].phoneNumber,"2333");
            testUser[1].idNumber = md5(testUser[1].idNumber);
            let res = await request.post('/user/registration')
                .send(testUser[1])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
        });
        it('registerFalse2',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            let res = await request.post('/user/registration')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res.toString() + "registerFalse");
            expect(res.success).equal(false);
        });
        it('register2',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[2].phoneNumber,testUser[2].validateCode);
            testUser[2].idNumber = md5(testUser[2].idNumber);
            let res = await request.post('/user/registration')
                .send(testUser[2])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
    });
    describe('userLogin',()=>{
        it('login',async () => {
            let result = await dataBase.SetLoginMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            let res = await request.post('/user/login/outSchool')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.token).to.be.a("string");
            testUser[0].token = res.token;
        });
        it('loginCookieTrue',async () => {
            let res = await request.get('/user/cookie')
                .query({token: testUser[0].token})
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.realName).equal(testUser[0].realName);
            expect(res.userType).equal(constVariable.USERTYPE_OUTSCHOOL);
        });
        it('loginCookieFalse',async () => {
            let res = await request.get('/user/cookie')
                .query({token: "hhhhhhhhh"})
                .expect(401);
        });
        it('LoginFalse1',async () => {
            let result = await dataBase.SetLoginMsg(testUser[0].phoneNumber,"2333");
            let res = await request.post('/user/login/outSchool')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
        });
        it('LoginFalse2',async () => {
            let result = await dataBase.SetLoginMsg(testUser[1].phoneNumber,testUser[1].validateCode);
            let res = await request.post('/user/login/outSchool')
                .send(testUser[1])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
        });
    });
    let pianoDetail = {};
    describe('piano',()=> {
        it('all', async () => {
            let res = await request.get('/user/piano/all')
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.pianoList).to.be.an('array');
            expect(res.pianoList.length).equal(4);
        });
        it('detail', async () => {
            let res = await request.get('/user/piano/detail')
                .query({
                    pianoId: "1",
                    date: utils.getDateStr(new Date())
                })
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(true);
            expect(res.timeTable).to.be.an('array');
            expect(res.timeTable.length).equal(84);
            pianoDetail = res;
        });
    });
    describe('reservation',()=> {
        it('orderPriceError',async () => {
            let res = await request.post('/user/reservation/order')
                .send(testItem[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
            expect(res.info).equal("金额不匹配");
        });
        it('order',async () => {
            testItem[0].pianoPrice = Math.ceil((testItem[0].endTimeIndex-testItem[0].begTimeIndex)/6)*pianoDetail.pianoPrices[2];
            let res = await request.post('/user/reservation/order')
                .send(testItem[0])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(true);
            expect(res.reservationId.length).equal(32);
            testItem[0].uuid = res.reservationId;
        });
        it('orderUnpaid',async () => {
            testItem[2].pianoPrice = Math.ceil((testItem[2].endTimeIndex-testItem[2].begTimeIndex)/6)*pianoDetail.pianoPrices[2];
            let res = await request.post('/user/reservation/order')
                .send(testItem[2])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(false);
        });
        it('notpaid',async () => {
            let res = await request.get('/user/reservation/notpaid')
                .query({
                    number: testUser[0].phoneNumber
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.reservationList).to.be.an('array');
            expect(res.reservationList.length).equal(1);
            let time = new Date();
            expect(res.reservationList[0].deadlineTime - time.getTime()).above(20*60*1000);
        });
        it('all_noItem',async () => {
            let res = await request.get('/user/reservation/all')
                .query({
                    number: testUser[0].phoneNumber
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.reservationList).to.be.an('array');
            expect(res.reservationList.length).equal(0);
        });
        it('payFinish',async () => {
            let resultdb = await dataBase.ItemPaySuccess(testItem[0].uuid);
            expect(resultdb.success).equal(true);
        });
        it('alarm',async () => {
            let res = await request.get('/user/reservation/alarm')
                .query({
                    number: testUser[0].phoneNumber
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.reservationList).to.be.an('array');
            expect(res.reservationList.length).equal(1);
            expect(res.reservationList[0].reservationId).equal(testItem[0].uuid);
            expect(res.reservationList[0].reservationType).equal(2);
            expect(res.reservationList[0].reservationState).equal(1);
        });
        it('all',async () => {
            let res = await request.get('/user/reservation/all')
                .query({
                    number: testUser[0].phoneNumber
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.reservationList).to.be.an('array');
            expect(res.reservationList.length).equal(1);
            expect(res.reservationList[0].reservationId).equal(testItem[0].uuid);
            expect(res.reservationList[0].reservationType).equal(2);
            expect(res.reservationList[0].reservationState).equal(1);
        });
        it('cancel',async () => {
            let res = await request.post('/user/reservation/cancel')
                .send({
                    reservationId: testItem[0].uuid
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
        it('all_after',async () => {
            let res = await request.get('/user/reservation/all')
                .query({
                    number: testUser[0].phoneNumber
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.reservationList).to.be.an('array');
            expect(res.reservationList.length).equal(0);
        });
        it('alarm_after',async () => {
            let res = await request.get('/user/reservation/alarm')
                .query({
                    number: testUser[0].phoneNumber
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.reservationList).to.be.an('array');
            expect(res.reservationList.length).equal(0);
        });
        it('reorder',async () => {
            testItem[0].pianoPrice = Math.ceil((testItem[0].endTimeIndex-testItem[0].begTimeIndex)/6)*pianoDetail.pianoPrices[2];
            let res = await request.post('/user/reservation/order')
                .send(testItem[0])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(true);
            expect(res.reservationId.length).equal(32);
            testItem[0].uuid = res.reservationId;
        });
        it('repay',async () => {
            let resultdb = await dataBase.ItemPaySuccess(testItem[0].uuid);
            expect(resultdb.success).equal(true);
        });
        it('all',async () => {
            let res = await request.get('/user/reservation/all')
                .query({
                    number: testUser[0].phoneNumber
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.reservationList).to.be.an('array');
            expect(res.reservationList.length).equal(1);
            expect(res.reservationList[0].reservationId).equal(testItem[0].uuid);
            expect(res.reservationList[0].reservationType).equal(2);
            expect(res.reservationList[0].reservationState).equal(1);
        });
    });
    describe('notice', ()=>{
        it('all', async () => {
            let res = await request.get('/user/notice/all')
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.noticeList).to.be.an('array');
        });
    });
});


describe('interfaceManager', ()=>{
    describe('admin', ()=>{
        let admintoken =  "";
        it('login', async () => {
            let res = await request.post('/manager/login')
                .send({
                    "userType": "0",
                    "userName": "admin",
                    "password": "1234"
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.token).to.be.a('string');
            admintoken = res.token;
        });
        it('loginFail', async () => {
            let res = await request.post('/manager/login')
                .send({
                    userType: "1",
                    userName: "admin",
                    password: "1234"
                })
                .expect(401);
        });
        it('info', async () => {
            let res = await request.get('/manager/info')
                .query({
                    token: admintoken
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.name).equals("admin");
            expect(res.roles[0]).equals("admin");
        });
        it('logout', async () => {
            let res = await request.post('/manager/logout')
                .expect(200);
        });
    });
    describe('editor', ()=>{
        let editortoken =  "";
        it('login', async () => {
            let res = await request.post('/manager/login')
                .send({
                    "userType": "1",
                    "userName": "guard",
                    "password": "1234"
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.token).to.be.a('string');
            editortoken = res.token;
        });
        it('info', async () => {
            let res = await request.get('/manager/info')
                .query({
                    token: editortoken
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.name).equals("guard");
            expect(res.roles[0]).equals("editor");
        });
    });
    describe('notice', ()=>{
        it('create', async () => {
            let res = await request.post('/manager/notice/create')
                .send({
                    title: "test",
                    content: "ttttt",
                    time: utils.getDatetimeStr(new Date()),
                    author: "tt"
                })
                .expect(200);
        });
        it('list+', async () => {
            let res = await request.get('/manager/notice/list')
                .query({
                    page: 1,
                    limit: 10,
                    dateSort: "+"
                })
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.items.length).equals(3);
            expect(res.items[2].title).equals("test");
            expect(res.total).equals(3);
        });
        it('list-', async () => {
            let res = await request.get('/manager/notice/list')
                .query({
                    page: 1,
                    limit: 10,
                    dateSort: "-"
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.items.length).equals(3);
            expect(res.items[0].title).equals("test");
            expect(res.total).equals(3);
        });
        it('list_author', async () => {
            let res = await request.get('/manager/notice/list')
                .query({
                    page: 1,
                    limit: 10,
                    author: "tt",
                    dateSort: "-"
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.items.length).equals(1);
            expect(res.items[0].title).equals("test");
            expect(res.total).equals(1);
        });
        it('list_title', async () => {
            let res = await request.get('/manager/notice/list')
                .query({
                    page: 1,
                    limit: 10,
                    title: "test",
                    dateSort: "-"
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.items.length).equals(1);
            expect(res.items[0].title).equals("test");
            expect(res.total).equals(1);
        });
        it('detail', async () => {
            let res = await request.get('/manager/notice/detail')
                .query({
                    id:3
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.title).equals("test");
        });
        it('delete', async () => {
            let res = await request.post('/manager/notice/delete')
                .send({
                    id:1
                })
                .expect(200);
        });
        it('deleteValidate', async () => {
            let res = await request.get('/manager/notice/list')
                .query({
                    page: 1,
                    limit: 10,
                    dateSort: "-"
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.items.length).equals(2);
            expect(res.total).equals(2);
        });
    });
    describe('piano', ()=> {
        it('add', async () => {
            let res = await request.post('/manager/room/create')
                .send(testPiano)
                .expect(200);
        });
        it('list', async () => {
            let res = await request.get('/manager/room/list')
                .query({
                    page: 1,
                    limit: 10
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.items.length).equals(5);
            expect(res.total).equals(5);
        });
        it('detail', async () => {
            let res = await request.get('/manager/room/detail')
                .query({
                    id: 5
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.items[0].room).equals(testPiano.room);
            expect(res.items[0].status).equals(testPiano.status);
            expect(res.items[0].info).equals(testPiano.info);
        });
        it('updateInfo', async () => {
            testPiano.info = "hhh";
            let res = await request.post('/manager/room/info')
                .send(testPiano)
                .expect(200);
        });
        it('updateValidate', async () => {
            let res = await request.get('/manager/room/detail')
                .query({
                    id: 5
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.items[0].room).equals(testPiano.room);
            expect(res.items[0].status).equals(testPiano.status);
            expect(res.items[0].info).equals("hhh");
        });
        it('close', async () => {
            let res = await request.post('/manager/room/status')
                .send({
                    id: 5,
                    status: 0
                })
                .expect(200);
        });
        it('closeValidate', async () => {
            let res = await request.get('/manager/room/detail')
                .query({
                    id: 5
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.items[0].status).equals(0);
        });
        it('closeFail', async () => {
            let res = await request.post('/manager/room/status')
                .send({
                    id: 1,
                    status: 0
                })
                .expect(400);
        });
        it('open', async () => {
            let res = await request.post('/manager/room/status')
                .send({
                    id: 5,
                    status: 1
                })
                .expect(200);
        });
        it('openValidate', async () => {
            let res = await request.get('/manager/room/detail')
                .query({
                    id: 5
                })
                .expect(200);
            res = JSON.parse(res.text);
            console.log('openValidate');
            console.log(res);
            expect(res.items[0].status).equals(1);
        });
        it('rule', async () => {
            console.log(testRule[0]);
            let res = await request.post('/manager/room/rule')
                .send(testRule[0])
                .expect(200);
        });
        let pianoDetail = {};
        it('detail', async () => {
            let res = await request.get('/manager/room/detail')
                .query({
                    id: testItem[1].pianoId
                })
                .expect(200);
            res = JSON.parse(res.text);
            pianoDetail = res.items[0];
        });
        it('orderTest1', async () => {
            testItem[1].pianoPrice = Math.ceil((testItem[1].endTimeIndex - testItem[1].begTimeIndex) / 6) * pianoDetail.multiValue;
            let res = await request.post('/user/reservation/order')
                .send(testItem[1])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(false);
        });
        it('ruleFail', async () => {
            let res = await request.post('/manager/room/rule')
                .send(testRule[1])
                .expect(400);
        });
        it('ruleChange', async () => {
            console.log(testRule[0]);
            let res = await request.post('/manager/room/ruleChange')
                .send(
                    {
                        id: 2,
                        oldStart: 12,
                        newStart: 20,
                        oldEnd: 20,
                        newEnd: 30,
                        week: testRule[0].week,
                    }
                )
                .expect(200);
        });

        it('orderTest2',async () => {
            testItem[1].pianoPrice = Math.ceil((testItem[1].endTimeIndex-testItem[1].begTimeIndex)/6)*pianoDetail.multiValue;
            let res = await request.post('/user/reservation/order')
                .send(testItem[1])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(true);
            testItem[1].uuid = res.reservationId;
        });
        it('payFinish',async () => {
            let resultdb = await dataBase.ItemPaySuccess(testItem[1].uuid);
            expect(resultdb.success).equal(true);
        });
        it('orderTest3',async () => {
            testItem[3].pianoPrice = Math.ceil((testItem[3].endTimeIndex-testItem[3].begTimeIndex)/6)*pianoDetail.multiValue;
            let res = await request.post('/user/reservation/order')
                .send(testItem[3])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(false);
        });
        it('ruleRelease', async () => {
            let res = await request.post('/manager/room/rule')
                .send(
                    {
                        id: 2,
                        start: 20,
                        end: 30,
                        week: date.getDay(),
                        type: 0
                    }
                )
                .expect(200);
        });
        it('orderTest4',async () => {
            testItem[3].pianoPrice = Math.ceil((testItem[3].endTimeIndex-testItem[3].begTimeIndex)/6)*pianoDetail.multiValue;
            let res = await request.post('/user/reservation/order')
                .send(testItem[3])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(true);
        });

    });
    describe('user', ()=>{
        let uuid = "";
        it('list', async () => {
            let res = await request.get('/manager/user/list')
                .query({
                    page: 1,
                    limit: 10
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.total).equal(3);
        });
        it('listIdQuery', async () => {
            let res = await request.get('/manager/user/list')
                .query({
                    page: 1,
                    limit: 10,
                    IDnumber: "140100199001011234"
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.total).equal(1);
            expect(res.list[0].id).equal(testUser[0].realName);
            uuid = res.list[0].userId;
        });
        it('addBlack', async () => {
            let res = await request.post('/manager/user/blacklist/set')
                .send({
                    userId: uuid
                })
                .expect(200);
        });
        let pianoDetail = {};
        it('detail', async () => {
            let res = await request.get('/manager/room/detail')
                .query({
                    id: testItem[2].pianoId
                })
                .expect(200);
            res = JSON.parse(res.text);
            pianoDetail = res.items[0];
        });
        it('orderTestFail',async () => {
            testItem[2].pianoPrice = Math.ceil((testItem[2].endTimeIndex-testItem[2].begTimeIndex)/6)*pianoDetail.socValue;
            let res = await request.post('/user/reservation/order')
                .send(testItem[2])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(false);
        });
        it('removeBlack', async () => {
            let res = await request.post('/manager/user/blacklist/remove')
                .send({
                    userId: uuid
                })
                .expect(200);
        });
        it('orderTestSuccess',async () => {
            testItem[2].pianoPrice = Math.ceil((testItem[2].endTimeIndex-testItem[2].begTimeIndex)/6)*pianoDetail.socValue;
            let res = await request.post('/user/reservation/order')
                .send(testItem[2])
                .expect(200);
            res = JSON.parse(res.text);
            console.log(res);
            expect(res.success).equal(true);
            testItem[2].uuid = res.reservationId;
        });
        it('payFinish',async () => {
            let resultdb = await dataBase.ItemPaySuccess(testItem[2].uuid);
            expect(resultdb.success).equal(true);
        });
    });
    describe('item', ()=>{
        it('list', async () => {
            let res = await request.get('/manager/item/list')
                .query({
                    page: 1,
                    limit: 10
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.total).equal(4);
        });
        let refundId = "";
        it('scan', async () => {
            let res = await request.get('/manager/item/scan')
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.list.length).equal(1);
            refundId = res.list[0].itemId;
        });
        it('checkin', async () => {
            let res = await request.get('/manager/checkin')
                .query({id: refundId})
                .expect(200);
        });
        it('refundment', async () => {
            let res = await request.post('/manager/item/refundment')
                .send({
                    itemId: refundId
                })
                .expect(200);
        });
        it('list2', async () => {
            let res = await request.get('/manager/user/list')
                .query({
                    page: 1,
                    limit: 10
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.total).equal(3);
        });
        it('checkinFalse', async () => {
            let res = await request.get('/manager/checkin')
                .query({id: refundId})
                .expect(400);
        });
    });
    describe('longItem', ()=>{
        it('add', async () => {
            let res = await request.post('/manager/longItem/create')
                .send({
                    "id": testUser[0].phoneNumber,
                    "room": 201,
                    "week": 3,
                    "start": 30,
                    "end": 36,
                    "type": 0
                })
                .expect(200);
        });
        it('addrule', async () => {
            console.log(testRule[2]);
            let res = await request.post('/manager/room/rule')
                .send(testRule[2])
                .expect(200);
        });
        it('addCheck', async () => {
            let res = await request.post('/manager/longItem/create')
                .send({
                    "id": testUser[0].phoneNumber,
                    "room": 201,
                    "week": date.getDay(),
                    "start": 70,
                    "end": 75,
                    "type": 0
                })
                .expect(400);
        });
        it('addRedundant', async () => {
            let res = await request.post('/manager/longItem/create')
                .send({
                    "id": testUser[0].phoneNumber,
                    "room": 201,
                    "week": 3,
                    "start": 30,
                    "end": 36,
                    "type": 0
                })
                .expect(400);
        });
        it('list', async () => {
            let res = await request.get('/manager/longItem/list')
                .query({
                    page: 1,
                    limit: 10
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.count).equal(1);
        });
        it('delete', async () => {
            let res = await request.post('/manager/longItem/delete')
                .send({
                    "id": 1
                })
                .expect(200);
        });
        it('list', async () => {
            let res = await request.get('/manager/longItem/list')
                .query({
                    page: 1,
                    limit: 10
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.count).equal(0);
        });
    });
});

const md5 = (string) => {
    let rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    let addUnsigned = function (lX, lY) {
        let lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    let F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    };

    let G = function (x, y, z) {
        return (x & z) | (y & (~z));
    };

    let H = function (x, y, z) {
        return (x ^ y ^ z);
    };

    let I = function (x, y, z) {
        return (y ^ (x | (~z)));
    };

    let FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    let GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    let HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    let II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    let convertToWordArray = function (string) {
        let lWordCount;
        let lMessageLength = string.length;
        let lNumberOfWordsTempOne = lMessageLength + 8;
        let lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
        let lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        let lWordArray = Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    let wordToHex = function (lValue) {
        let WordToHexValue = "",
            WordToHexValueTemp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };

    let uTF8Encode = function (string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        let output = "";
        for (let n = 0; n < string.length; n++) {
            let c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    let x = Array();
    let k, AA, BB, CC, DD, a, b, c, d;
    let S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    let S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    let S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    let S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    string = uTF8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    let tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return tempValue.toLowerCase();
};
