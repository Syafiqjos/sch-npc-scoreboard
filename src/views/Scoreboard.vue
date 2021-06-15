<template>
    <v-container fill-height fluid>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Schematics NPC - {{ contest_name }} {{ class_type }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn :to="juniorLink" @click="refreshScoreboard()" class="mr-2">
                Junior
            </v-btn>
            <v-btn :to="seniorLink" @click="refreshScoreboard()">
                Senior
            </v-btn>
        </v-app-bar>
        <template v-if="show_scoreboard">
            <ScoreboardDomjudge ref="scoreboardDomjudge" :data="scoreboard_data" v-if="judge_type == 'domjudge'"></ScoreboardDomjudge>
            <ScoreboardDMOJ ref="scoreboardDMOJ" :data="scoreboard_data" v-else-if="judge_type == 'dmoj'"></ScoreboardDMOJ>
            <div class="countdown">
                <h2>{{ countdown }}</h2>
            </div>
        </template>
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
            class_type : null,
            contest_name : null,
            start_time : new Date(),
            end_time : new Date(),
            countdown_timer : null,
            countdown : null
        }
    },
    components : {
        ScoreboardDomjudge,
        ScoreboardDMOJ
    },
    mounted(){
        this.retrieveScoreboard();

        this.countdown_timer = setInterval(() => {
            this.refreshCountdown();
        }, 1000);
    },
    destroyed(){
        clearInterval(this.countdown_timer);
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
                this.class_type = 'Junior';
                if (contest == 'penyisihan'){
                    this.contest_name = 'Penyisihan';
                    return "/scoreboard_data/dmoj_api_example.json";
                }
            } else if (classs == 'senior'){
                this.class_type = 'Senior';
                 if (contest == 'penyisihan'){
                     this.contest_name = 'Penyisihan';
                    return "/scoreboard_data/domjudge_api_example.json";
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
        refreshCountdown(){
            //let time = (this.end_time - this.start_time) / 1000;
            let time = Math.floor((new Date("2021-06-21") - new Date()) / 1000);

            let day = (Math.floor(time / (24 * 60 * 60))).toString().padStart(2, '0');
            let hour = (Math.floor(time / (60 * 60)) % 60).toString().padStart(2, '0');
            let minute = (Math.floor(time / (60)) % 60).toString().padStart(2, '0');
            let second = Math.floor(time % 60).toString().padStart(2, '0');

            let o = day + ":" + hour + ":" + minute + ":" + second;

            this.countdown = o;
        }
    }
}
</script>

<style>
    /*
        figma : https://www.figma.com/file/UgtbqYN1VhFH6ygHMURUAb/schematics?node-id=0%3A1
    */
    
    .countdown {
        position : sticky;
        bottom : 10px;

        padding: 20px;
        margin: auto;
        margin-bottom: 20px;

        width : 200px;

        border-radius: 5px;

        text-align: center;

        background-color: rgb(18, 18, 18, 0.8);
    }
    .wide {
        width : 100%;
    }
</style>