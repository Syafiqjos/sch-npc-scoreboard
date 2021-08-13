<template>
    <HomeComponent>
      <template v-slot:content>
        <template v-if="contests_data">
          <template v-if="contestName != null">
            <v-btn v-if="contestDetails && contestDetails.scoreboard_dmoj_api" class="button-list" :to="'/scoreboard/' + contestName + '/junior'">Junior</v-btn>
            <v-btn v-if="contestDetails 
                        && contestDetails.scoreboard_domjudge_api 
                        && contestDetails.scoreboard_domjudge_api_teams
                        && contestDetails.scoreboard_domjudge_api_organizations" class="button-list" :to="'/scoreboard/' + contestName + '/senior'">Senior</v-btn>
          </template>
          <template v-else>
            <p class="button-list" style="text-align:center;">Contest tidak ada atau belum dimulai!</p>
          </template>

          <v-btn class="button-list" :to="'/scoreboard/'">&lt; Kembali</v-btn>
        </template>
        <template v-else>
          <p class="button-list" style="text-align:center;">Contest tidak ada atau belum dimulai!</p>
        </template>
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
      contestDetails : null
    }
  },
  components : {
    HomeComponent
  },
  mounted(){
    let param = this.$route.params.contest;

    this.retrieveContestsData(
      () => {
        let contest_details = this.getContestData(param);

        this.contestName = null;

        if (contest_details && contest_details.active){
          this.contestName = contest_details.id;
          this.contestDetails = contest_details;
        }
      }
    );
  }
}
</script>