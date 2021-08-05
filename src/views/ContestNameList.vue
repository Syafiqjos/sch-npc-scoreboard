<template>
    <HomeComponent>
      <template v-slot:content>
        <v-btn style="width:100%;" class="center-block" to="/scoreboard/warmup">Warm-Up</v-btn>
        <v-btn style="width:100%;" class="center-block" to="/scoreboard/penyisihan">Penyisihan</v-btn>
      </template>
    </HomeComponent>
</template>

<script>
// @ is an alias to /src
import HomeComponent from '@/components/HomeComponent.vue'

export default {
  name: 'ContestNameList',
  components : {
    HomeComponent
  }
}
</script>