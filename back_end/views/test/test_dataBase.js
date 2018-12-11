const {should,expect,assert} = require('chai');
const supertest = require('supertest');
const dataBase = require('../dataBase');
const app = require('../../app');
const request = supertest(app.listen());

describe('#dataBase',()=>{
    describe('GetSocietyUuidByTele',()=>{
        it('should return 5 when 2 + 3',() =>{
            console.log(dataBase);
            let result = dataBase.GetSocietyUuidByTele("13220167398");
            expect(result.success).to.have.property('data');
        });
    })
});