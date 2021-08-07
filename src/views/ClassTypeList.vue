<template>
    <HomeComponent>
      <template v-slot:content>
        <template v-if="contests_data">
          <template v-if="contestName != null">
            <v-btn class="button-list" :to="'/scoreboard/' + contestName + '/junior'">Junior</v-btn>
            <v-btn class="button-list" :to="'/scoreboard/' + contestName + '/senior'">Senior</v-btn>
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
      contestName : null
    }
  },
  components : {
    HomeComponent
  },
  mounted(){
    let param = this.$route.params.contest;

    this.retrieveContestsData(
      () => {
        let exist = false;

        this.contests_data.forEach(element => {
          if (element.active && element.id == param){
            exist = true;
          }
        });

        this.contestName = null;

        if (exist){
          if (param == 'warmup'){
            this.contestName = 'warmup';
          } else if (param == 'penyisihan'){
            this.contestName = 'penyisihan';
          } else if (param == 'final'){
            this.contestName = 'final';
          }
        }
      }
    );
  }
}
</script>