<template v-if="$parent.app_config">
    <div v-if="$parent.app_config" class="center-absolute home-component">
      <img class="center-block" alt="Schematics logo" :src="$parent.app_config.homepage_logo_url" />
      <h1 class="center-block" align="center" >{{ $parent.app_config.event_display_name }}</h1>
      <slot name="content"></slot>
    </div>
</template>

<script>
export default {
  name: 'HomeComponent'
}
</script>