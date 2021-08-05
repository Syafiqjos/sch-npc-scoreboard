<template>
    <HomeComponent>
      <template v-slot:content>
        <v-btn style="width:100%;" class="center-block" to="./scoreboard">Scoreboard</v-btn>
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