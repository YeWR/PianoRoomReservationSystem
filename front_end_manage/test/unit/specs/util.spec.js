import Vue from 'vue'
import * as validate from '@/utils/validate'

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

});
