<template>
    <v-container fill-height fluid>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Schematics NPC - Penyisihan Junior</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn :to="juniorLink" @click="refreshScoreboard()" class="mr-2">
                Junior
            </v-btn>
            <v-btn :to="seniorLink" @click="refreshScoreboard()">
                Senior
            </v-btn>
        </v-app-bar>
        <v-layout>
            <template v-if="show_scoreboard">
                <ScoreboardDomjudge ref="scoreboardDomjudge" :data="scoreboard_data" v-if="judge_type == 'domjudge'"></ScoreboardDomjudge>
                <ScoreboardDMOJ ref="scoreboardDMOJ" :data="scoreboard_data" v-else-if="judge_type == 'dmoj'"></ScoreboardDMOJ>
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
    computed : {
        juniorLink(){
            return '/scoreboard/' + this.$route.params.contest + '/junior';
        },
        seniorLink(){
            return '/scoreboard/' + this.$route.params.contest + '/senior';
        }
    },
    methods : {
        getFetchLinkFromParams(){
            let classs = this.$route.params.class;
            let contest = this.$route.params.contest;
            console.log(classs);
            console.log(contest);
            if (classs == 'junior'){
                if (contest == 'penyisihan'){
                    return "/data/dmoj_api_example.json";
                }
            } else if (classs == 'senior'){
                 if (contest == 'penyisihan'){
                    return "/data/domjudge_api_example.json";
                }
            }
            return null;
        },
        checkJudgeType(data){
            if (data.api_version){
                return 'dmoj';
            } else if (data.event_id){
                return 'domjudge';
            }
            return null;
        },
        refreshScoreboard(){
            this.retrieveScoreboard();
            this.$refs.scoreboardDomjudge?.initialization();
            this.$refs.scoreboardDMOJ?.initialization();
        },
        retrieveScoreboard(){
            let fetch_link = this.getFetchLinkFromParams();
            this.axios.get(fetch_link)
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