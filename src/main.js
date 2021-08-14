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
      contests_portal : null,
      contests_data : null
    }
  },
  methods : {
    retrieveContestsPortal(){
      const url = "/scoreboard_data/contests_portal.json";

      if (process.env.DEBUG_MODE == true) {
        console.log("retrieveContestsPortal");
      }

      if (!this.contests_portal){
        this.axios.get(url)
          .then((response) => {
              this.contests_portal = response.data;
              if (process.env.DEBUG_MODE == true) {
                console.log(response.data);
              }
          })
          .catch(async(errors) => {
            if (process.env.DEBUG_MODE == true) {
              console.log(errors);
              console.log("Fetch contests data failed, retrying..");
            }

            // Sleep then, Call Recursive if fail
            await this.sleep(1000);
            this.retrieveContestsPortal();
          });
      }
    },
    retrieveContestsData(onSuccess){
      const url = "/scoreboard_data/contests_data.json";

      if (process.env.DEBUG_MODE == true) {
        console.log("retrieveContestsData");
      }

      if (this.contests_data){
        if (onSuccess) onSuccess();
      } else {
        this.axios.get(url)
          .then((response) => {
              this.contests_data = response.data;
              if (process.env.DEBUG_MODE == true) {
                console.log(response.data);
              }

              if (onSuccess) onSuccess();
          })
          .catch(async(errors) => {
            if (process.env.DEBUG_MODE == true) {
              console.log(errors);
              console.log("Fetch contests data failed, retrying..");
            }

            // Sleep then, Call Recursive if fail
            await this.sleep(1000);
            this.retrieveContestsData(onSuccess);
          });
      }
    },
    getContestData(id){
      if (this.contests_data){
        for (let index in this.contests_data){
          let element = this.contests_data[index];

          if (element.id == id){
            return element;
          }
        }
      }

      return null;
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
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