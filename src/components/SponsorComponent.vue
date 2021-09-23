<template v-if="app_config && app_config.active && app_config.sponsor.active">
    <div class="sponsor-container">
        <div class="sponsor-title">{{app_config.sponsor.sponsor_text}}</div>
        <div><img class="sponsor-banner" :src="app_config.sponsor.sponsor_banner_image_url" alt="" /></div>
        <v-layout align-center justify-center>
            <img v-for="(sponsor, index) in app_config.sponsor.sponsors" :key="'sponsor-' + index"
             :style="sponsor.height == '' ? '' : ('height: ' + sponsor.height + ';')" class="sponsor-img" :src="sponsor.image_url" :alt="sponsor.image_alt" />
        </v-layout>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    props: [
        'app_config'
    ],
    mounted(){

    }
}
</script>