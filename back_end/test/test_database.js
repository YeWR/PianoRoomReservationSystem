const {should,expect,assert} = require('chai');
const dataBase = require('../views/dataBase');
const app = require('../app');
const request = require('supertest').agent(app.listen());

let uuid = ['4fc7520005ab11e99aab63509163c297','4fc7520005ab11e99aab63509163csda','sda7520005ab11e99aab63509163c297']

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
},{
    phoneNumber: "12234567890",
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

let timeLength = 84;

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
    describe('CampusUserLogin',()=>{
        it('success1',async () =>{
            let info = await dataBase.CampusUserLogin(0,testUser[3].realName,testUser[3].phoneNumber,"campus test");
            expect(info.success).to.equal(true);
        });
        it('success2',async () =>{
            let info = await dataBase.CampusUserLogin(0,testUser[3].realName,testUser[3].phoneNumber,"campus test");
            expect(info.success).to.equal(true);
        });
        it('fail1',async () =>{
            let info = await dataBase.CampusUserLogin(0,testUser[3].realName,null);
            expect(info.success).to.equal(false);
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
            expect(info.username).to.equal(1);
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
    describe('preparePianoForRule',()=>{
        it('success',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.preparePianoForRule(4,0,10,now_date);
            expect(result.success).to.equal(true);
            let res = await dataBase.GetPianoRoomAll()
            console.log(res.data[3].piano_list)
            for(let i = 0; i<10; i++){
                expect(res.data[3].piano_list.data[i]).to.equal(50)
            }
        });
        it('fail1',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.preparePianoForRule(6,0,5,now_date)
            expect(result.success).to.equal(false);
            expect(result.info).to.equal("琴房不存在");         
        });
        it('fail2',async () =>{
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let result = await dataBase.preparePianoForRule(1,0,10,now_date)
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
    describe('InsertItem',()=>{
        it('success',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let date = now_date.getFullYear()+'-'+now_date.getMonth()+'-'+now_date.getDate()+' '+now_date.getHours()+':'+now_date.getMinutes()+':'+now_date.getSeconds();
            let result = await dataBase.InsertItem(date,res.data,2,1,0,50,10,0,uuid[0]);
            expect(result.success).to.equal(true);
        });
        it('fail1',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let date = now_date.getFullYear()+'-'+now_date.getMonth()+'-'+now_date.getDate();
            let result = await dataBase.InsertItem(date,res.data,2,0,0,50,10,0,uuid[1]);
            expect(result.success).to.equal(false);
            expect(result.info).to.equal("预约失败");         
        });
    })
    describe('GetItem',()=>{
        it('success',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let result = await dataBase.GetItem(res.data);
            expect(result.data[0].item_username).to.equal(res.data);
        });
        it('fail1',async () =>{
            let result = await dataBase.GetItem("");
            expect(result.data.length).to.equal(0);        
        });
    })
    describe('ItemCheckin',()=>{
        it('success',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let result = await dataBase.GetItem(res.data);
            result = await dataBase.ItemCheckin(result.data[0].item_uuid);
            expect(result.success).to.equal(true);
            result = await dataBase.GetItem(res.data);
            expect(result.data[0].item_type).to.equal(2);
        });
        it('fail1',async () =>{
            let result = await dataBase.ItemCheckin("");
            expect(result.success).to.equal(false)
        });
        it('fail2',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let result = await dataBase.GetItem(res.data);
            result = await dataBase.ItemCheckin(result.data[0].item_uuid);
            expect(result.success).to.equal(false);
        });
    })
    describe('ItemPaySuccess',()=>{
        it('success',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[1].phoneNumber);
            let now_date = new Date();
            now_date.setDate(now_date.getDate())
            now_date.setHours(now_date.getHours())
            let date = now_date.getFullYear()+'-'+now_date.getMonth()+'-'+now_date.getDate()+' '+now_date.getHours()+':'+now_date.getMinutes()+':'+now_date.getSeconds();
            let result = await dataBase.InsertItem(date,res.data,3,3,0,50,10,0,'4fc7520005ab11e99aab63509163csda');
            expect(result.success).to.equal(true);

            res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            result = await dataBase.GetItem(res.data);
            result = await dataBase.ItemPaySuccess(result.data[0].item_uuid);
            expect(result.success).to.equal(true);
            result = await dataBase.GetItem(res.data);
            expect(result.data[0].item_type).to.equal(1);
        });
        it('fail1',async () =>{
            let result = await dataBase.ItemPaySuccess("");
            expect(result.success).to.equal(false)
        });
    })
    describe('SearchItem',()=>{
        it('success',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            console.log(res)
            let result = await dataBase.SearchItem(10,0,res.data,"","",1,"",null);
            expect(result.count).to.equal(1)
        });
        it('fail1',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let result = await dataBase.SearchItem(10,0,"","","","","","");
            expect(result.count).to.equal(0)
        });
    })
    describe('GetItemByUuid',()=>{
        it('success',async () =>{
            let result = await dataBase.GetItemByUuid(uuid[0]);
            expect(result.data.item_uuid).to.equal(uuid[0])
        });
        it('fail1',async () =>{
            let result = await dataBase.GetItemByUuid("");
            expect(result.data).to.equal(null)
        });
    })
    describe('preparePianoForDel',()=>{
        it('success',async () =>{
            let now_date = new Date()
            let result = await dataBase.GetItemByUuid(uuid[0]);
            result = await dataBase.preparePianoForDel(result.data.item_roomId,result.data.item_begin,result.data.item_duration,now_date);
            expect(result.success).to.equal(true)
        });
        it('fail1',async () =>{
            let now_date = new Date()
            let result = await dataBase.GetItemByUuid(uuid[0]);
            result = await dataBase.preparePianoForDel(10,result.data.item_begin,result.data.item_duration,now_date);
            expect(result.success).to.equal(false)
        });
    })
    describe('DeleteItem',()=>{
        it('success',async () =>{
            let result = await dataBase.DeleteItem(uuid[0]);
            expect(result.success).to.equal(true)
            result = await dataBase.GetItemByUuid(uuid[0]);
            expect(result.data.item_type).to.equal(0)
        });
    })
    describe('GetNoticeAll',()=>{
        it('success',async () =>{
            let result = await dataBase.GetNoticeAll();
            expect(result.data.length).to.equal(2);
        });
    })
    describe('SearchNotice',()=>{
        it('success1',async () =>{
            let result = await dataBase.SearchNotice(10,0,null,null,null);
            expect(result.count).to.equal(2);
        });
        it('success2',async () =>{
            let result = await dataBase.SearchNotice(10,0,null,'小吴同学',null);
            expect(result.count).to.equal(2);
            for(let i = 0; i<result.count; i++){
                expect(result.data[i].notice_auth).to.equal('小吴同学');
            }
        });
        it('fail1',async () =>{
            let result = await dataBase.SearchNotice(10,0,null,"to test",null);
            expect(result.count).to.equal(0);
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
    describe('SearchLongItem',()=>{
        it('success',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let result = await dataBase.AddLongItem(res.data,0,1,4,20,10);
            result = await dataBase.SearchLongItem(10,0,res.data,"","","");
            expect(result.count).to.equal(1);
        });
    })
    describe('AddLongItem',()=>{
        it('success',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let result = await dataBase.AddLongItem(res.data,0,1,4,40,10);
            expect(result.success).to.equal(true);
        });
    })
    describe('DeleteLongItem',()=>{
        it('success',async () =>{
            let res = await dataBase.GetUserUuidByNumber(testUser[0].phoneNumber);
            let result1 = await dataBase.SearchLongItem(10,0,res.data,"","","");
            let result = await dataBase.DeleteLongItem(1);
            let result2 = await dataBase.SearchLongItem(10,0,res.data,"","","");
            expect(result1.count).to.equal(result2.count+1);
        });
    })
});
