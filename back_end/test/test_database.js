const {should,expect,assert} = require('chai');
const dataBase = require('../views/dataBase');
const app = require('../app');
const request = require('supertest').agent(app.listen());
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
