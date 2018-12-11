const {should,expect,assert} = require('chai');
const supertest = require('supertest');
const dataBase = require('../views/dataBase');
const app = require('./app');
const request = supertest(app.listen());

describe('#dataBase',()=>{
    describe('GetSocietyUuidByTele',()=>{
        it('demo',async () =>{
            let result = await dataBase.GetSocietyUuidByTele("13220167398");
            console.log(result);
            expect(result.success).to.have.property('data');
        });
    })
});