import Vue from 'vue'
import App from './App.vue'
import Language from './models/Language'
import I18n from './components/I18n'

Vue.config.productionTip = false

Vue.prototype.$lang = new Language("de");
Vue.component('i18n', I18n);

Vue.filter('currencyDisplay', {
  // model -> view
  // formats the value when updating the input element.
  read: function(val) {
    return val.toFixed(2) + ' €'
  },
  // view -> model
  // formats the value when writing to the data.
  write: function(val) {
    var number = +val.replace(',', '.').replace(/[^\d.]/g, '')
    return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
