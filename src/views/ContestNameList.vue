<template v-if="app_config && app_config.active">
    <HomeComponent>
      <template v-slot:content>
        <div style="width:90%;">
          <template v-if="contests_data">
            <span></span>
            <template v-for="(contest, index) in contests_data" >
              <v-btn 
                v-if="contest.active" 
                :key="'contest_button-' + index" 
                class="button-list" 
                :to="'/scoreboard/' + contest.id">
                  
                  {{contest.name}}
              
              </v-btn>
            </template>
          </template>
          
          <v-btn class="button-list" to="/">{{ app_config.homepage_back_text }}</v-btn>
        </div>
      </template>
    </HomeComponent>
</template>

<script>
// @ is an alias to /src
import HomeComponent from '@/components/HomeComponent.vue'

export default {
  name: 'ContestNameList',
  data(){
    return {
      app_config: null
    }
  },
  components : {
    HomeComponent
  },
  mounted(){
    this.app_config = this.retrieveAppConfig(
      () => { 
        this.retrieveContestsData();
      }
    );
  }
}
</script>