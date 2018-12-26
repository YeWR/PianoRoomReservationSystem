import Vue from 'vue'
import vux from 'vuex'
import ItemAll from '@/views/item/itemAll'
import lang from '@/lang/en'
import i18n from '@/lang' // Internationalization
import Element from 'element-ui'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})


describe('check the itemAll.vue', function () {

  let vm = new Vue(ItemAll).$mount();

  // it('test item type', () => {
  //   console.log(vm.toItemType(''))
  //   expect(vm.toItemType('')).toEqual(lang.item['item_']);
  //   for (let i = 0; i < 4; ++i){
  //     expect(vm.toItemType('' + i)).toEqual(lang.item['item_' + i]);
  //   }
  // })
  //
  // it('test formatJson', () => {
  //   let filterVal = ['itemId', 'idNumber', 'userType',
  //     'time', 'room', 'pianoType', 'itemType',
  //     'status', 'price']
  //   let jsonData = [{
  //     'itemId': '123', 'idNumber': '1', 'userType': '1',
  //     'time': '1234', 'room': '123', 'pianoType': '1', 'itemType': '1',
  //     'status': '1', 'price': '10'
  //   }]
  //   let ans = vm.formatJson(filterVal, jsonData)
  //
  // })
});
