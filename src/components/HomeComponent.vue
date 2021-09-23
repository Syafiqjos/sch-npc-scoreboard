<template v-if="$parent.app_config.active">
    <div v-if="$parent.app_config" class="center-relative home-component">
      <img class="center-block" style="margin-top: 20px;" alt="Schematics logo" :src="$parent.app_config.homepage_logo_url" />
      <h1 class="center-block" align="center" >{{ $parent.app_config.event_display_name }}</h1>
      <slot name="content"></slot>
      <SponsorComponent style="margin-left: 2rem; margin-right: 2rem;" v-if="$parent.app_config.sponsor && $parent.app_config.sponsor.active" :app_config="$parent.app_config"></SponsorComponent>
    </div>
</template>

<script>
import SponsorComponent from '@/components/SponsorComponent.vue'

export default {
  name: 'HomeComponent',
  components: {
    SponsorComponent
  }
}
</script>