const {should,expect,assert} = require('chai');
const dataBase = require('../views/dataBase');
const app = require('../app');
const request = require('supertest').agent(app.listen());
const utils = require('../views/utils');

let date = new Date();
date.setDate(date.getDate() + 1);
let tomorrowDateStr = utils.getDateStr(date);
let testUser = [{
    phoneNumber: "13220167398",
    validateCode: "1234",
    realName: "赵哲晖",
    idNumber: "140100199001011234"
},{
    phoneNumber: "13220167399",
    validateCode: "1234",
    realName: "赵哲晖",
    idNumber: "140100199001011234"
},{
    phoneNumber: "13220167390",
    validateCode: "1234",
    realName: "吴海旭",
    idNumber: "140100199001011239"
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
    week: (date.getDay()+1)%7,
    type: 1
},{
    id: 1,
    start: 0,
    end: 6,
    week: (date.getDay()+1)%7,
    type: 1
}]

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
},{
    openid: "test",
    number: testUser[2].phoneNumber,
    reservationType: 3,
    pianoId: 2,
    pianoPrice: 100,
    date: tomorrowDateStr,
    begTimeIndex: 12,
    endTimeIndex: 18,
    uuid: null
}];


describe('#interfaceUser',()=>{
    describe('userRegister',()=>{
        it('register',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            let res = await request.post('/user/registration')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
        it('registerFalse1',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[1].phoneNumber,"2333");
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
            let res = await request.post('/user/registration')
                .send(testUser[2])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
    });
    describe('userLogin',()=>{
        let cookie = null;
        it('login',async () => {
            let result = await dataBase.SetLoginMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            let res = await request.post('/user/login/outSchool')
                .send(testUser[0])
                .expect(200);
            expect(res.headers["set-cookie"]).to.be.an('array');
            cookie = res.headers["set-cookie"];
            console.log(cookie);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
        it('loginCookieTrue',async () => {
            let res = await request.get('/user/cookie')
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.realName).equal('赵哲晖');
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
        it('loginCookieFalse',async () => {
            let res = await request.get('/user/cookie')
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
            expect(res.info).equal("测试成功!");
            expect(res.uuid.length).equal(32);
            testItem[0].uuid = res.uuid;
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
            let res = await request.post('/user/reservation/validate/' + testItem[0].uuid)
                .expect(200);
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
        it('refundment',async () => {
            let res = await request.post('/user/reservation/refundment')
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
            expect(res.success).equal(true);
            expect(res.info).equal("测试成功!");
            expect(res.uuid.length).equal(32);
            testItem[0].uuid = res.uuid;
        });
        it('repay',async () => {
            let res = await request.post('/user/reservation/validate/' + testItem[0].uuid)
                .expect(200);
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
                    "userName": "liuqiang",
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
                    userName: "liuqiang",
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
            expect(res.name).equals("刘强");
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
                    "userName": "zhaoyang",
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
            expect(res.name).equals("李肇阳");
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
    describe('piano', ()=>{
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
                    status:0})
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
                .send({id: 1,
                    status:0
                })
                .expect(400);
        });
        /*
        it('open', async () => {
            let res = await request.post('/manager/room/status')
                .send({
                    id: 5,
                    status:1})
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
            expect(res.status).equals(1);
        });
        it('rule', async () => {
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
        it('orderTest1',async () => {
            testItem[1].pianoPrice = Math.ceil((testItem[1].endTimeIndex-testItem[1].begTimeIndex)/6)*pianoDetail.multiValue;
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
        it('ruleRelease', async () => {
            testRule[0].type = 0;
            let res = await request.post('/manager/room/rule')
                .send(testRule[0])
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
        });
        */
    });
});


