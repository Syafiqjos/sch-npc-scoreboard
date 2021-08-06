<template>
    <HomeComponent>
      <template v-slot:content>
        <v-btn class="button-list" to="/scoreboard">Portal Junior</v-btn>
        <v-btn class="button-list" to="/scoreboard">Portal Senior</v-btn>
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
  }
}
</script>