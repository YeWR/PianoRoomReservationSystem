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
},{
    phoneNumber: "18800121091",
    validateCode: "1234",
    realName: "吴海旭",
    idNumber: "140100199001011234"
}];
const testRoom =[{
    room: 206,
    info:'test',
    stu:1,
    soc:2,
    tea:1,
    multi:3,
    type:'test',
    status:1
}]

describe('#dataBase',()=>{
    describe('ChangeUserStatus',()=>{
        it('register',async () => {
            let result = await dataBase.SetRegisterMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            let res = await request.post('/user/registration')
                .send(testUser[0])
                .expect(200);
            res = JSON.parse(res.text);
            expect(res.success).equal(true);
        })
        it('society_type',async () =>{
            let result = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let res = await dataBase.ChangeUserStatus(result.data, 0)
            let info = await dataBase.GetUserInfo(result.data);
            expect(info.data.status).to.equal(0);
            res = await dataBase.ChangeUserStatus(result.data, 1)
        });
        // to do
        it('society_type_fail',async () =>{
            let res = await dataBase.ChangeUserStatus("sad", 0)
            let result = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let info = await dataBase.GetUserInfo(result.data);
            expect(info.data.status).to.equal(1);
        });        
    })
    describe('GetUserUuidByNumber',()=>{
        it('get_tele',async () =>{
            let result = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            if(result.data == null){
                expect(1).to.equal(0);
            }
            else{
                expect(0).to.equal(0);
            }
        });
        it('get_tele_fail',async () =>{
            let result = await dataBase.GetUserUuidByNumber("");
            expect(result.info).to.equal('用户不存在');
        });
    })
    describe('SearchUser',()=>{
        it('get_user',async () =>{
            let result = await dataBase.SearchUser(1,0,testUser[0].phoneNumber,null,null,null,null);
            expect(result.data[0].realname).to.equal(testUser[0].realName);
            expect(result.count).to.equal(1);
        });
        it('get_user_without_query',async () =>{
            let result = await dataBase.SearchUser(10,0,null,null,null,null,null);
            expect(result.data[0].realname).to.equal(testUser[0].realName);          
            expect(result.count).to.equal(1);
        });
    })
    describe('GetUserInfo',()=>{
        it('get_user',async () =>{
            let result = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let info = await dataBase.GetUserInfo(result.data);
            expect(info.data.uuid).to.equal(result.data);
        });
        it('get_user_without_query',async () =>{
            let info = await dataBase.GetUserInfo("sad");
            expect(info.data).to.equal(null);
        });
    })
    describe('SetRegisterMsg',()=>{
        it('success',async () =>{
            let info = await dataBase.SetRegisterMsg(testUser[1].phoneNumber,testUser[1].validateCode);
            expect(info.success).to.equal(true);
        });
        it('fail1',async () =>{
            let info = await dataBase.SetRegisterMsg(testUser[0].phoneNumber,testUser[0].validateCode);
            expect(info.success).to.equal(false);
            expect(info.info).to.equal("手机号已经被使用")
        });
        it('fail2',async () =>{
            let info = await dataBase.SetRegisterMsg(testUser[0].phoneNumber,"");
            expect(info.success).to.equal(false);
        });
    })
    describe('SocietyUserRegister',()=>{
        it('success',async () =>{
            let info = await dataBase.SetRegisterMsg(testUser[1].phoneNumber,testUser[1].validateCode);
            info = await dataBase.SocietyUserRegister(1,'test',testUser[1].realName,testUser[1].phoneNumber,'test',testUser[1].validateCode);
            expect(info.success).to.equal(true);
        });
        it('fail1',async () =>{
            let info = await dataBase.SetRegisterMsg(testUser[1].phoneNumber,testUser[1].validateCode);
            info = await dataBase.SocietyUserRegister(1,'test',testUser[1].realName,testUser[1].phoneNumber,'test',"");
            expect(info.success).to.equal(false);
            expect(info.info).to.equal("请先发送验证码");
        });
    })
    describe('SetLoginMsg',()=>{
        it('success',async () =>{
            let info = await dataBase.SetLoginMsg(testUser[1].phoneNumber,testUser[1].validateCode);
            expect(info.success).to.equal(true);
        });
        it('fail1',async () =>{
            let info = await dataBase.SetLoginMsg(testUser[2].phoneNumber,testUser[2].validateCode);
            expect(info.success).to.equal(false);
            expect(info.info).to.equal("手机号未注册");
        });
    })
    describe('SocietyUserLogin',()=>{
        it('success',async () =>{
            let info = await dataBase.SetLoginMsg(testUser[1].phoneNumber,testUser[1].validateCode);
            info = await dataBase.SocietyUserLogin(testUser[1].phoneNumber,testUser[1].validateCode);
            console.log(info)
            expect(info.success).to.equal(true);
            expect(info.data).to.equal(1);
        });
        it('fail1',async () =>{
            let info = await dataBase.SetLoginMsg(testUser[1].phoneNumber,testUser[1].validateCode);
            info = await dataBase.SocietyUserLogin(testUser[1].phoneNumber,"");
            expect(info.success).to.equal(false);
            expect(info.info).to.equal("验证码错误");
            info = await dataBase.SocietyUserLogin(testUser[1].phoneNumber,testUser[1].validateCode);
        });
        it('fail2',async () =>{
            info = await dataBase.SocietyUserLogin(testUser[1].phoneNumber,"");
            expect(info.success).to.equal(false);
            expect(info.info).to.equal("请先发送验证码");
        });
    })
    describe('InsertPiano',()=>{
        it('success',async () =>{
            let result = await dataBase.InsertPiano(testRoom[0].room,testRoom[0].info,testRoom[0].stu,testRoom[0].tea, testRoom[0].soc,testRoom[0].multi,testRoom[0].type,testRoom[0].status)
            expect(result.success).to.equal(true);
        });
    })
    describe('GetPianoRoomAll',()=>{
        it('success',async () =>{
            let result = await dataBase.GetPianoRoomAll()
            expect(result.data.length).to.equal(5);
        });
    })
    // to check
    describe('UpdatePianoInfo',()=>{
        it('success',async () =>{
            let id = 1
            let result = await dataBase.UpdatePianoInfo(1,null,null,null,null, null,null,null,0)
            let info = await dataBase.GetPianoRoomAll()
            expect(info.data[0].piano_status).to.equal(0);
        });
        it('fail1',async () =>{
            let result = await dataBase.UpdatePianoInfo(1,null,null,null,null, null,null,null,null)
            expect(result.success).to.equal(false)
        });
    })
    describe('SearchPiano',()=>{
        it('success',async () =>{
            let result = await dataBase.SearchPiano(10,0,null,null,1)
            expect(result.data[0].piano_id).to.equal(1);
        });
        it('fail1',async () =>{
            let id = 6
            let result = await dataBase.SearchPiano(10,0,null,null,id)
            expect(result.data.length).to.equal(0);
        });
    })
    // to design
    describe('getDateNum',()=>{
        it('return 1',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate()+1)
            now_date.setHours(now_date.getHours())
            let res = dataBase.getDateNum(now_date)
            expect(res).to.equal(1);
        });
        it('return 2',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate()+2)
            now_date.setHours(now_date.getHours())
            let res = dataBase.getDateNum(now_date)
            expect(res).to.equal(2);
        });
        it('return -1',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate()-1)
            now_date.setHours(now_date.getHours())
            let res = dataBase.getDateNum(now_date)
            expect(res).to.equal(-1);
        });
        it('return 0',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let res = dataBase.getDateNum(now_date)
            expect(res).to.equal(0);
        });
    })
    // to design
    describe('GetPianoRoomInfo',()=>{
        it('success',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.GetPianoRoomInfo(1,now_date)
            expect(result.data.piano_id).to.equal(1);
        });
        it('fail',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.GetPianoRoomInfo(6,now_date)
            expect(result.data).to.equal(null);            
        });
    }) 
    describe('preparePianoForInsert',()=>{
        it('success',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.preparePianoForInsert(1,0,10,now_date);
            expect(result.success).to.equal(true);
            result = await dataBase.GetPianoRoomInfo(1,now_date)
            for(let i = 0; i<10; i++){
                expect(result.data.piano_list[i]).to.equal(1)
            }
        });
        it('fail1',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.preparePianoForInsert(6,0,5,now_date)
            expect(result.success).to.equal(false);
            expect(result.info).to.equal("琴房不存在");         
        });
        it('fail2',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.preparePianoForInsert(1,0,10,now_date)
            expect(result.success).to.equal(false);
        });
    })
    // to do
    describe('ChangePianoRule',()=>{
        it('success',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.ChangePianoRule(1,0,10,0,1);
            expect(result.success).to.equal(true);
            result = await dataBase.GetPianoRoomInfo(1,now_date)
            for(let i = 0; i<10; i++){
                expect(result.data.piano_list[i]).to.equal(1)
            }
        });
        it('fail1',async () =>{
            let result = await dataBase.preparePianoForInsert(6,0,5,0,1)
            expect(result.success).to.equal(false);
            expect(result.info).to.equal("琴房不存在");         
        });
    })
    // to change
    // describe('InsertItem',()=>{
    //     it('success',async () =>{
    //         let now_date = new Date();
    //         now_date.setDate(now_date.getDate())
    //         now_date.setHours(now_date.getHours())
    //         let result = await dataBase.ChangePianoRule(1,0,10,0,1);
    //         expect(result.success).to.equal(true);
    //         result = await dataBase.GetPianoRoomInfo(1,now_date)
    //         for(let i = 0; i<10; i++){
    //             expect(result.data.piano_list[i]).to.equal(1)
    //         }
    //     });
    //     it('fail1',async () =>{
    //         let result = await dataBase.preparePianoForInsert(6,0,5,0,1)
    //         expect(result.success).to.equal(false);
    //         expect(result.info).to.equal("琴房不存在");         
    //     });
    // })
    // describe('InsertTempItem',()=>{
    //     it('success',async () =>{
    //         let now_date = new Date();
    //         now_date.setDate(now_date.getDate())
    //         now_date.setHours(now_date.getHours())
    //         let result = await dataBase.ChangePianoRule(1,0,10,0,1);
    //         expect(result.success).to.equal(true);
    //         result = await dataBase.GetPianoRoomInfo(1,now_date)
    //         for(let i = 0; i<10; i++){
    //             expect(result.data.piano_list[i]).to.equal(1)
    //         }
    //     });
    //     it('fail1',async () =>{
    //         let result = await dataBase.preparePianoForInsert(6,0,5,0,1)
    //         expect(result.success).to.equal(false);
    //         expect(result.info).to.equal("琴房不存在");         
    //     });
    // })
    describe('ItemCheckin',()=>{
        it('success',async () =>{
            // to do
            
            let result = await dataBase.ItemCheckin();
            expect(result.data.length).to.equal(2);
        });
        it('fail1',async () =>{
            // 首先insert
            
            let result = await dataBase.ItemCheckin();
            expect(result.data.length).to.equal(2);
        });
    })    
    describe('GetNoticeAll',()=>{
        it('success',async () =>{
            let result = await dataBase.GetNoticeAll();
            expect(result.data.length).to.equal(2);
        });
    })
    describe('SearchNotice',()=>{
        it('success',async () =>{
            let result = await dataBase.SearchNotice(2,0,null,null,null);
            console.log(result)
            expect(result.data.notice_id).to.equal(1);
        });
        it('fail1',async () =>{
            let result = await dataBase.SearchNotice(2,0,null,null,null);
            console.log(result)
            expect(result).to.equal(1);
        });
    })
    describe('GetNoticeInfo',()=>{
        it('success',async () =>{
            let result = await dataBase.GetNoticeInfo(1);
            expect(result.data.notice_id).to.equal(1);
        });
        it('fail1',async () =>{
            let result = await dataBase.GetNoticeInfo(3);
            expect(result.data).to.equal(null);
        });
    })
    describe('InsertNotice',()=>{
        it('success',async () =>{
            let now_date = new Date();
            let result = await dataBase.InsertNotice('test','test',"2018-12-21 00:00:00",'test',1);
            result = await dataBase.GetNoticeInfo(3);
            expect(result.data.notice_title).to.equal('test');
        });
        it('fail1',async () =>{
            let now_date = new Date();
            let result = await dataBase.InsertNotice('test','test',null,'test',1);
            expect(result.success).to.equal(false);
        });
    })
    describe('DeleteNotice',()=>{
        it('success',async () =>{
            let result = await dataBase.DeleteNotice(1);
            result = await dataBase.GetNoticeInfo(1);
            expect(result.data.notice_type).to.equal(0);
        });
    })
});
