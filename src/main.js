import Vue from 'vue'
import App from './App.vue'
import Language from './models/Language'
import I18n from './components/I18n'

Vue.config.productionTip = false

Vue.prototype.$lang = new Language("de");
Vue.component('i18n', I18n);

new Vue({
  render: h => h(App),
}).$mount('#app')
