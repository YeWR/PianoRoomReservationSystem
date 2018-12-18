const {should,expect,assert} = require('chai');
const request = require('supertest');
const dataBase = require('../views/dataBase');
const app = require('../app');
const koaapp = app.listen(3000);
const testUser = [{
    phoneNumber: "13220167398",
    validateCode: "1234",
    realName: "赵哲晖",
    idNumber: "140100199001011234"
},{
    phoneNumber: "13220167399",
    validateCode: "1234",
    realName: "赵哲晖",
    idNumber: "140100199001011234"
}];

/*describe('#dataBase',()=>{
    describe('GetSocietyUuidByTele',()=>{
        it('demo',async () =>{
            let result = await dataBase.GetSocietyUuidByTele("13220167398");
            expect(result).to.have.property('data');
        });
    })
});*/

describe('#interface',()=>{
    describe('userRegister',()=>{
        it('register',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            let res = await request(koaapp).post('/user/registration')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
        it('registerFalse1',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[1].phoneNumber,"2333");
            let res = await request(koaapp).post('/user/registration')
                .send(testUser[1])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
        });
        it('registerFalse2',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            let res = await request(koaapp).post('/user/registration')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
        });
    });
    describe('userLogin',()=>{
        let cookie = null;
        it('login',async () => {
            let result = await dataBase.SetLoginMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            let res = await request(koaapp).post('/user/login/outSchool')
                .send(testUser[0])
                .expect(200);
            expect(res.headers["set-cookie"]).to.be.an('array');
            cookie = res.headers["set-cookie"];
            console.log(cookie);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
        it('loginCookieTrue',async () => {
            let res = await request(koaapp).get('/user/cookie')
                .set('cookie', cookie)
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.realName).equal('赵哲晖');
        });
        it('loginCookieFalse',async () => {
            let res = await request(koaapp).get('/user/cookie')
                .set('cookie', "test")
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
        });
        it('LoginFalse1',async () => {
            let result = await dataBase.SetLoginMsg(testUser[0].phoneNumber,"2333");
            let res = await request(koaapp).post('/user/login/outSchool')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
        });
        it('LoginFalse2',async () => {
            let result = await dataBase.SetLoginMsg(testUser[1].phoneNumber,testUser[1].validateCode);
            let res = await request(koaapp).post('/user/login/outSchool')
                .send(testUser[1])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(false);
        });
    });
    describe('piano',()=>{
        it('all',async () => {
            let res = await request(koaapp).get('/user/piano/all')
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.pianoList).to.be.an('array');
            expect(res.pianoList.length).equal(4);
        });
        it('detail',async () => {
            let res = await request(koaapp).get('/user/piano/detail')
                .query({
                    pianoId: "1",
                    date: "2018-12-15"
                })
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
            expect(res.timeTable).to.be.an('array');
            expect(res.timeTable.length).equal(84);
        });
    })
});