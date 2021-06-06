<template>
    <v-container fill-height fluid>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Schematics NPC - Scoreboard Public - Penyisihan</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn to="/home/exams" class="mr-2">
                Junior
            </v-btn>
            <v-btn to="/home/history"  >
                Senior
            </v-btn>
        </v-app-bar>
        <v-layout>

        </v-layout>
    </v-container>
</template>

<script>
export default {
    data(){
        return {
            scoreboard_data : null,
        }
    },
    mounted(){
        //this.axios.defaults.headers.get['Content-Type'] ='application/json;charset=utf-8';
        //this.axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';

        this.axios.get("http://localhost:8080/api/v2/contest/bts19", {
            crossdomain : true,
            crossDomain : true
        })
        .then((response) => {
            console.log(response);
        })
        .catch((errors) => {
            console.log(errors);
        });
    }
}
</script>