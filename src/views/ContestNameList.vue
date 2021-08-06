<template>
    <HomeComponent>
      <template v-slot:content>
        <div>
          <v-btn class="button-list" to="/scoreboard/warmup">Warm-Up</v-btn>
          <v-btn class="button-list" to="/scoreboard/penyisihan">Penyisihan</v-btn>
          
          <v-btn class="button-list" to="/">&lt; Kembali</v-btn>
        </div>
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