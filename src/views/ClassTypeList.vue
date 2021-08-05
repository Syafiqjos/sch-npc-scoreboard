<template>
    <HomeComponent>
      <template v-slot:content>
        <template v-if="contestName != null">
        <v-btn style="width:100%;" class="center-block" :to="'/scoreboard/' + contestName + '/junior'">Junior</v-btn>
        <v-btn style="width:100%;" class="center-block" :to="'/scoreboard/' + contestName + '/senior'">Senior</v-btn>
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
    this.contestName = null;
    if (this.$route.params.contest == 'penyisihan'){
      this.contestName = 'penyisihan';
    }
  }
}
</script>