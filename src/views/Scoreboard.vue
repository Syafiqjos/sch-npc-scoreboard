<template>
    <v-container fill-height fluid>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Schematics NPC - Penyisihan Junior</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn to="/home/exams" class="mr-2">
                Junior
            </v-btn>
            <v-btn to="/home/history"  >
                Senior
            </v-btn>
        </v-app-bar>
        <v-layout>
            <template v-if="show_scoreboard">
                <ScoreboardDomjudge :scoreboard_data="scoreboard_data" v-if="judge_type == 'domjudge'"></ScoreboardDomjudge>
                <ScoreboardDMOJ :scoreboard_data="scoreboard_data" v-else-if="judge_type == 'dmoj'"></ScoreboardDMOJ>
            </template>
        </v-layout>
    </v-container>
</template>

<script>
import ScoreboardDomjudge from '@/components/ScoreboardDomjudge.vue'
import ScoreboardDMOJ from '@/components/ScoreboardDMOJ.vue'

export default {
    data(){
        return {
            show_scoreboard : false,
            scoreboard_data : null,
            judge_type : null,
        }
    },
    components : {
        ScoreboardDomjudge,
        ScoreboardDMOJ
    },
    mounted(){
        this.retrieveScoreboard();
    },
    methods : {
        checkJudgeType(data){
            if (data.api_version){
                return 'dmoj';
            } else if (data.event_id){
                return 'domjudge';
            }
            return null;
        },
        retrieveScoreboard(){
            this.axios.get("http://192.168.43.131:8080/data/domjudge_api_example.json")
            .then((response) => {
                this.scoreboard_data = response.data;
                this.judge_type = this.checkJudgeType(this.scoreboard_data);
                this.show_scoreboard = true;
                console.log(response.data);
            })
            .catch((errors) => {
                console.log(errors);
            });
        },
    }
}
</script>