<template>
    <div class="center-absolute home-component">
      <img class="center-block" alt="Schematics logo" src="https://schematics.its.ac.id/favicon/apple-icon-180x180.png" />
      <h1 class="center-block" align="center" >Schematics NPC 2021</h1>
      <slot name="content"></slot>
    </div>
</template>

<script>
export default {
  name: 'HomeComponent'
}
</script>