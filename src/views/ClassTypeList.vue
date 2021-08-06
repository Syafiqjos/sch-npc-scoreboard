<template>
    <HomeComponent>
      <template v-slot:content>
        <template v-if="contestName != null">
          <v-btn class="button-list" :to="'/scoreboard/' + contestName + '/junior'">Junior</v-btn>
          <v-btn class="button-list" :to="'/scoreboard/' + contestName + '/senior'">Senior</v-btn>
        </template>
        <template v-else>
          <p class="button-list" style="text-align:center;">Contest tidak ada atau belum dimulai!</p>
        </template>

        <v-btn class="button-list" :to="'/scoreboard/'">&lt; Kembali</v-btn>
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
    this.contestName = null;
    if (this.$route.params.contest == 'penyisihan'){
      this.contestName = 'penyisihan';
    }
  }
}
</script>