import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

require('@/assets/css/scoreboard.css');

Vue.config.productionTip = false

var contestsDataMixin = {
  data (){
    return {
      contests_data : null
    }
  },
  methods : {
    retrieveContestsData(onSuccess){
      const url = "/scoreboard_data/contests_data.json";

      console.log("retrieveContestsData");

      if (this.contests_data){
        if (onSuccess) onSuccess();
      } else {
        this.axios.get(url)
          .then((response) => {
              this.contests_data = response.data;
              console.log(response.data);

              if (onSuccess) onSuccess();
          })
          .catch((errors) => {
              console.log(errors);
              console.log("Fetch contests data failed, retrying..");
          });
      }
    }
  }
}

Vue.mixin(contestsDataMixin);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

// console.log(router);