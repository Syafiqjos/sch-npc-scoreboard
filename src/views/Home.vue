<template>
    <div class="center-absolute">
      <img class="center-block" alt="Schematics logo" src="https://schematics.its.ac.id/favicon/apple-icon-180x180.png" />
      <h1 class="center-block" align="center" >Schematics NPC 2021</h1>
      <v-btn style="width:100%;" class="center-block" to="./scoreboard">Scoreboard</v-btn>
    </div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home'
}
</script>

<style>
.center-absolute {
  position:absolute;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
}
.center-block {
  margin: auto;
  display:block;
}
.center-block {
  margin: auto;
}
</style>