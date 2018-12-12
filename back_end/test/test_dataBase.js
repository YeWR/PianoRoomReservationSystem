const {should,expect,assert} = require('chai');
const request = require('supertest');
const dataBase = require('../views/dataBase');
const app = require('../app');
const koaapp = app.listen(3000);

describe('#dataBase',()=>{
    describe('GetSocietyUuidByTele',()=>{
        it('demo',async () =>{
            let result = await dataBase.GetSocietyUuidByTele("13220167398");
            expect(result).to.have.property('data');
        });
    })
});

describe('#interface',()=>{
    describe('/user/piano/all',()=>{
        it('demo',async () =>{
            let res = await request(koaapp).get('/user/piano/all')
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        });
    })
});