<template>
    <v-container fill-height fluid>
        <template v-if="contests_data 
                        && contest_name 
                        && contest_details 
                        && (judge_type == 'dmoj' && contest_details.scoreboard_dmoj_api 
                            || judge_type == 'domjudge' 
                                && contest_details.scoreboard_domjudge_api
                                && contest_details.scoreboard_domjudge_api_teams
                                && contest_details.scoreboard_domjudge_api_organizations)">
            <v-app-bar app color="primary" height="80px" dark>
                <img style="height:50px;padding-left:10px;" src="https://schematics.its.ac.id/image/white-logo.svg" />
                <!-- <v-app-bar-nav-icon @click.stop="drawer = true"></v-app-bar-nav-icon> -->
                <!-- <v-toolbar-title>Schematics NPC - {{ contest_name }} {{ class_type }}</v-toolbar-title> -->
                <v-spacer></v-spacer>
                <v-btn v-if="contest_details 
                            && (contest_details.scoreboard_dmoj_api)" 
                        :to="juniorLink" @click="refreshScoreboard()" class="mr-2">
                    Junior
                </v-btn>
                <v-btn v-if="contest_details 
                            && (contest_details.scoreboard_domjudge_api
                                && contest_details.scoreboard_domjudge_api_teams
                                && contest_details.scoreboard_domjudge_api_organizations)"
                        :to="seniorLink" @click="refreshScoreboard()">
                    Senior
                </v-btn>
            </v-app-bar>
            <template v-if="show_scoreboard && contest_details">
                <h1 class="title wide">Schematics NPC</h1>
                <h2 class="subtitle wide">{{ contest_name }} {{ class_type }}</h2>
                <ScoreboardDomjudge ref="scoreboardDomjudge" :data="scoreboard_data" :contest_details="contest_details" v-if="judge_type == 'domjudge'"></ScoreboardDomjudge>
                <ScoreboardDMOJ ref="scoreboardDMOJ" :data="scoreboard_data" :contest_details="contest_details" v-else-if="judge_type == 'dmoj'"></ScoreboardDMOJ>
                <div class="countdown">
                    <h2>{{ countdown }}</h2>
                </div>
                <h3 class="subtitle text-center wide">Contest {{ contest_name }} berakhir pada {{ endTimeFull }}</h3>
            </template>
        </template>
        <template v-else>
            <HomeComponent>
                <template v-slot:content>
                    <p class="button-list" style="text-align:center;">Contest tidak ada atau belum dimulai!</p>
                </template>
            </HomeComponent>
        </template>
    </v-container>
</template>

<script>
import ScoreboardDomjudge from '@/components/ScoreboardDomjudge.vue'
import ScoreboardDMOJ from '@/components/ScoreboardDMOJ.vue'
import HomeComponent from '@/components/HomeComponent.vue'

export default {
    data(){
        return {
            show_scoreboard : false,
            scoreboard_data : null,
            judge_type : null,
            class_type : null,
            contest_name : null,
            contest_details : null,
            start_time : new Date(),
            end_time : new Date(),
            countdown_timer : null,
            countdown : null
        }
    },
    components : {
        ScoreboardDomjudge,
        ScoreboardDMOJ,
        HomeComponent
    },
    mounted(){
        let param = this.$route.params.contest;

        this.retrieveContestsData(() => {
            let contest_details = this.getContestData(param);

            if (process.env.DEBUG_MODE == true) {
                console.log(this.contests_data);
                console.log(param);
                console.log(contest_details);
            }

            if (contest_details && contest_details.active){
                this.contest_details = contest_details;

                let isRetrieveSuccess = this.retrieveScoreboard();

                if (isRetrieveSuccess){
                    this.countdown_timer = setInterval(() => {
                        this.refreshCountdown();
                    }, 1000);

                    document.title = this.contest_name + " " + this.class_type + " - Schematics NPC 2021";
                }
                else {
                    this.contest_name = null;
                    this.contest_details = null;
                }
            }
        });
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
        },
        endTimeFull(){
            const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            const monthName = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            if (this.end_time){
                let targetDate = this.end_time;
                return dayName[targetDate.getDay()] + ", " + targetDate.getDate() + " " + monthName[targetDate.getMonth()] + " " + (1900 + targetDate.getYear()) + " pukul " + targetDate.getHours().toString().padStart(2, "0") + ":" + targetDate.getMinutes().toString().padStart(2, "0") + ":" + targetDate.getSeconds().toString().padStart(2, "0") + " WIB";
            }
            return "-";
        }
    },
    methods : {
        getFetchLinkFromParams(){
            let classs = this.$route.params.class;
            let contest = this.$route.params.contest;

            if (process.env.DEBUG_MODE == true) {
                console.log(classs);
                console.log(contest);
            }

            if (classs == 'junior'){
                this.class_type = 'Junior';

                this.contest_name = this.contest_details.name;
                return this.contest_details.scoreboard_dmoj_api;
            } else if (classs == 'senior'){
                this.class_type = 'Senior';

                this.contest_name = this.contest_details.name;
                return this.contest_details.scoreboard_domjudge_api;
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
            // this.axios.get(fetch_link, { headers: { 'Content-Type': 'application/json'} })

            if (fetch_link) {
                this.fetchScoreboard(fetch_link);

                return true;
            }

            return false;
        },
        fetchScoreboard(fetch_link){
            this.axios.get(fetch_link)
            .then((response) => {
                this.scoreboard_data = response.data;
                
                // After Update JSON from Back-End
                this.scoreboard_data = this.scoreboard_data.data;

                this.judge_type = this.checkJudgeType(this.scoreboard_data);
                this.show_scoreboard = true;
                if (process.env.DEBUG_MODE == true) {
                    console.log(response.data);
                }
            })
            .catch((errors) => {
                if (process.env.DEBUG_MODE == true) {
                    console.log(errors);
                    console.log("Fetch scoreboard failed, retrying..");
                }

                this.fetchScoreboard(fetch_link);
            });
        },
        refreshCountdown(){
            //let time = (this.end_time - this.start_time) / 1000;
            // this.end_time = new Date("2021-06-21");
            let time = Math.floor((this.end_time - new Date()) / 1000);

            if (time < 0){
                time = 0;
                this.countdown = "- Contest Over -";
                return;
            }

            let day = (Math.floor(time / (24 * 60 * 60))).toString().padStart(2, '0');
            let hour = (Math.floor(time / (60 * 60)) % 24).toString().padStart(2, '0');
            let minute = (Math.floor(time / (60)) % 60).toString().padStart(2, '0');
            let second = Math.floor(time % 60).toString().padStart(2, '0');

            let o = day + ":" + hour + ":" + minute + ":" + second;

            this.countdown = o;
        }
    }
}
</script>