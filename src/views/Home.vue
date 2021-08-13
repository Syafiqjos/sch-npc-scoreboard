<template>
    <HomeComponent>
      <template v-slot:content>
        <v-btn class="button-list" href="https://schematics.its.ac.id/sch-npc/portal/junior">Portal Junior</v-btn>
        <v-btn class="button-list" to="/scoreboard/warmup/senior">Portal Senior</v-btn>
        <v-btn class="button-list" to="/scoreboard">Scoreboard</v-btn>
      </template>
    </HomeComponent>
</template>

<script>
// @ is an alias to /src
import HomeComponent from '@/components/HomeComponent.vue'

export default {
  name: 'Home',
  components : {
    HomeComponent
  },
  mounted(){
    this.retrieveContestsData();
  }
}
</script>