import Vue from 'vue'
import * as validate from '@/utils/validate'
import * as utils from '@/utils/utils'

describe('check the validate in utils functions', function () {

  it('test url', () => {
    let validateURL = validate.validateURL
    let inputs = ['https://www.google.com', 'fasddfsa:f//fsadf.com', 'https::::/com.']
    let outputs = [true, false, false]
    let number = inputs.length

    for(let i = 0;i < number; ++i){
      expect(validateURL(inputs[i])).to.equal(outputs[i])
    }
  })

  it('test low case', () => {
    let validateLowerCase = validate.validateLowerCase
    let inputs = ['AFdasfsafsdfASF', 'fadfwqegsWRF', 'EFSFAF', 'fass']
    let outputs = [false, false, false, true]
    let number = inputs.length

    for(let i = 0; i < number; ++i){
      expect(validateLowerCase(inputs[i])).to.equal(outputs[i])
    }
  })

  it('test upper case', () => {
    let validateUpperCase = validate.validateUpperCase
    let inputs = ['AFdasfsafsdfASF', 'fadfwqegsWRF', 'EFSFAF', 'fass']
    let outputs = [false, false, true, false]
    let number = inputs.length

    for(let i = 0; i < number; ++i){
      expect(validateUpperCase(inputs[i])).to.equal(outputs[i])
    }
  })

  it('test user type', () => {
    let setUserTypeDiscription = utils.setUserTypeDiscription;
    let inputs = [0, 1, 2, 3, -1, 4]
    let outputs = ['学生', '教职工', '校外人士', '多人', '信息获取错误', '信息获取错误']
    let number = inputs.length

    for (let i = 0; i < number; ++i){
      expect(setUserTypeDiscription(inputs[i])).to.equal(outputs[i])
    }
  })

  it('test reservation type', () => {
    let setRsvStateDiscription = utils.setRsvStateDiscription;
    let inputs = [0, 1, 2, 3, -1, 4, -2]
    let outputs = ['已取消', '未使用', '已使用', '普通预约未支付', '长期预约未支付', '信息获取错误', '信息获取错误']
    let number = inputs.length

    for (let i = 0; i < number; ++i){
      expect(setRsvStateDiscription(inputs[i])).to.equal(outputs[i])
    }
  })

});
