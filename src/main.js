import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import ImageFallBack from "./functions/ImageFallBack";

require('@/assets/css/scoreboard.css');

Vue.config.productionTip = false;

Vue.prototype.app_config = {
  event_title : "Schematics NPC 2021",
  event_display_name : "Schematics NPC 2021",
  
  homepage_logo_url : "https://schematics.its.ac.id/favicon/apple-icon-180x180.png",
  homepage_back_text : "< Kembali",
  homepage_fallback_contest_text : "Contest tidak ada atau belum dimulai!"
};

var contestsDataMixin = {
  data (){
    return {
      contests_portal : null,
      contests_data : null
    }
  },
  methods : {
    retrieveAppConfig(onSuccess = null, config = { limit: 5 }){
      const url = "/scoreboard_data/config.json";

      const debug = false;
      if (debug) {
        console.log("retrieveAppConfig");
      }

      const run = this.app_config.active == null;
      
      if (run) {
        this.axios.get(url)
          .then((response) => {
              this.app_config = response.data;
              if (this.app_config.debug_mode) {
                console.log(response.data);
              }
              document.title = this.app_config.event_title;
              if (onSuccess){
                onSuccess();
              }
          })
          .catch(async(errors) => {
            if (debug) {
              console.log(errors);
              console.log("Fetch contests data failed, retrying..");
            }

            // Sleep then, Call Recursive if fail
            await this.sleep(1000);
            if (config.limit > 0){
              this.retrieveAppConfig(null, { limit: config.limit - 1 });
            }
          });
      } else {
        document.title = this.app_config.event_title;
        if (onSuccess){
          onSuccess();
        }
      }
    },
    retrieveContestsPortal(config = { limit: 5 }){
      if (this.app_config){
        const url = "/scoreboard_data/contests_portal.json";

        if (this.app_config.debug_mode == true) {
          console.log("retrieveContestsPortal");
        }

        if (!this.contests_portal){
          this.axios.get(url)
            .then((response) => {
                this.contests_portal = response.data;
                if (this.app_config.debug_mode == true) {
                  console.log(response.data);
                }
            })
            .catch(async(errors) => {
              if (this.app_config.debug_mode == true) {
                console.log(errors);
                console.log("Fetch contests data failed, retrying..");
              }

              // Sleep then, Call Recursive if fail
              await this.sleep(1000);
              if (config.limit > 0){
                this.retrieveContestsPortal({ limit: config.limit - 1 });
              }
            });
        }
      }
    },
    retrieveContestsData(onSuccess, config = { limit: 5 }){
      if (this.app_config){
        const url = "/scoreboard_data/contests_data.json";

        if (this.app_config.debug_mode == true) {
          console.log("retrieveContestsData");
        }

        if (this.contests_data){
          if (onSuccess) onSuccess();
        } else {
          this.axios.get(url)
            .then((response) => {
                this.contests_data = response.data;
                if (this.app_config.debug_mode == true) {
                  console.log(response.data);
                }

                if (onSuccess) onSuccess();
            })
            .catch(async(errors) => {
              if (this.app_config.debug_mode == true) {
                console.log(errors);
                console.log("Fetch contests data failed, retrying..");
              }

              // Sleep then, Call Recursive if fail
              await this.sleep(1000);
              if (config.limit > 0){
                this.retrieveContestsData(onSuccess, { limit: config.limit - 1 });
              }
            });
        }
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

Vue.directive("image-fall-back", ImageFallBack);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

// console.log(router);