<template v-if="app_config && app_config.active">
    <HomeComponent>
      <template v-slot:content>
        <div style="width:90%;">
          <span></span>
          <template v-if="contests_portal">
            <span></span>
            <template v-for="(portal, index) in contests_portal">
              <v-btn :key="'portal-' + index" v-if="portal && portal.active" class="button-list" :href="portal.url">{{ portal.text }}</v-btn>
            </template>
            <v-btn class="button-list" to="/scoreboard">Scoreboard</v-btn>
          </template>
        </div>
      </template>
    </HomeComponent>
</template>

<script>
// @ is an alias to /src
import HomeComponent from '@/components/HomeComponent.vue'

export default {
  name: 'Home',
  data(){
    return {
      app_config : null
    }
  },
  components : {
    HomeComponent
  },
  mounted(){
    this.app_config = this.retrieveAppConfig(
      () => { 
        this.retrieveContestsPortal();
        this.retrieveContestsData();
      }
    );
  }
}
</script>