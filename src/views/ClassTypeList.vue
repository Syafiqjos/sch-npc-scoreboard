<template v-if="app_config && app_config.active">
    <HomeComponent>
      <template v-slot:content>
        <div style="width:90%;">
          <template v-if="contests_data">
            <span></span>
            <template v-if="contestName != null">
              <span></span>
              <v-btn v-if="contestDetails 
                          && contestDetails.scoreboard_dmoj_api 
                          && contestDetails.scoreboard_dmoj_api_users" class="button-list" :to="'/scoreboard/' + contestName + '/junior'">{{ app_config.judge.dmoj.contest_type }}</v-btn>
              <v-btn v-if="contestDetails 
                          && contestDetails.scoreboard_domjudge_api 
                          && contestDetails.scoreboard_domjudge_api_teams
                          && contestDetails.scoreboard_domjudge_api_organizations" class="button-list" :to="'/scoreboard/' + contestName + '/senior'">{{ app_config.judge.domjudge.contest_type }}</v-btn>
            </template>
            <template v-else>
              <p class="button-list" style="text-align:center;">{{ app_config.homepage_fallback_contest_text }}</p>
            </template>

            <v-btn class="button-list" :to="'/scoreboard/'">{{ app_config.homepage_back_text }}</v-btn>
          </template>
          <template v-else>
            <p class="button-list" style="text-align:center;">{{ app_config.homepage_fallback_contest_text }}</p>
            <v-btn class="button-list" :to="'/scoreboard/'">{{ app_config.homepage_back_text }}</v-btn>
          </template>
        </div>
      </template>
    </HomeComponent>
</template>

<script>
// @ is an alias to /src
import HomeComponent from '@/components/HomeComponent.vue'

export default {
  name: 'ClassTypeList',
  data() {
    return {
      contestName : null,
      contestDetails : null,
      app_config: null
    }
  },
  components : {
    HomeComponent
  },
  mounted(){
    let param = this.$route.params.contest;

    this.app_config = this.retrieveAppConfig(
      () => { 
        this.retrieveContestsData(
          () => {
            let contest_details = this.getContestData(param);

            this.contestName = null;

            // console.log(contest_details);

            if (contest_details && contest_details.active){
              this.contestName = contest_details.id;
              this.contestDetails = contest_details;

              // console.log("success");
            }
          }
        );
      }
    );
  }
}
</script>