<template v-if="app_config.active">
    <v-container fill-height fluid>
        <template v-if="contests_data 
                        && contest_name 
                        && contest_details 
                        && (    judge_type == 'dmoj' 
                                && contest_details.scoreboard_dmoj_api 
                                && contest_details.scoreboard_dmoj_api_users
                            || judge_type == 'domjudge' 
                                && contest_details.scoreboard_domjudge_api
                                && contest_details.scoreboard_domjudge_api_teams
                                && contest_details.scoreboard_domjudge_api_organizations)">
            <v-app-bar app color="primary" height="80px" dark>
                <router-link style="display: inline-block;" to="."><img style="height:50px;padding-left:10px;" :src="app_config.scoreboard_logo_url" /></router-link>
                <!-- <v-app-bar-nav-icon @click.stop="drawer = true"></v-app-bar-nav-icon> -->
                <!-- <v-toolbar-title>Schematics NPC - {{ contest_name }} {{ class_type }}</v-toolbar-title> -->
                <v-spacer></v-spacer>
                <v-btn v-if="contest_details 
                            && (contest_details.scoreboard_dmoj_api
                                && contest_details.scoreboard_dmoj_api_users)" 
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
                <h1 class="title wide">{{ app_config.scoreboard_title_text }}</h1>
                <h2 class="subtitle wide">{{ contest_name }} {{ class_type }}</h2>
                <ScoreboardDomjudge ref="scoreboardDomjudge" :data="scoreboard_data" :contest_details="contest_details" v-if="judge_type == 'domjudge'"></ScoreboardDomjudge>
                <ScoreboardDMOJ ref="scoreboardDMOJ" :data="scoreboard_data" :contest_details="contest_details" v-else-if="judge_type == 'dmoj'"></ScoreboardDMOJ>
                <div class="countdown">
                    <h2>{{ countdown }}</h2>
                </div>
                <h3 class="subtitle text-center wide">{{ endTimeFull }}</h3>
            </template>
        </template>
        <template v-else>
            <HomeComponent>
                <template v-slot:content>
                    <p class="button-list" style="text-align:center;">{{ app_config.homepage_fallback_contest_text }}</p>
                    <v-btn to=".">
                        {{ app_config.homepage_back_text }}
                    </v-btn>
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
            countdown_refresher : null,
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

        this.retrieveAppConfig(
            () => { 
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
                            // Refresh Scoreboard Countdown
                            this.countdown_timer = setInterval(() => {
                                this.refreshCountdown();
                            }, 1000);

                            // Refresh Scoreboard every minute
                            this.countdown_refresher = setInterval(() => {
                                this.refreshScoreboard();
                                // console.log("Refresh Me");
                                // console.log(this.scoreboard_data);
                            }, 60 * 1000);

                            document.title = this.contest_name + " " + this.class_type + " - Schematics NPC 2021";
                        }
                        else {
                            this.contest_name = null;
                            this.contest_details = null;
                        }
                    }
                });
            }
        );
    },
    destroyed(){
        clearInterval(this.countdown_timer);
        clearInterval(this.countdown_refresher);
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
                let day = dayName[targetDate.getDay()];
                let date = targetDate.getDate();
                let month = monthName[targetDate.getMonth()];
                let year = (1900 + targetDate.getYear());
                let hour = targetDate.getHours().toString().padStart(2, "0");
                let minute = targetDate.getMinutes().toString().padStart(2, "0");
                let second = targetDate.getSeconds().toString().padStart(2, "0");

                let format = day + ", " + date + " " + month + " " + year + " pukul " + hour + ":" + minute + ":" + second + " WIB";

                if (this.app_config){
                    format = this.app_config.scoreboard_contest_time_format
                        .replace('{contest}', this.contest_name)
                        .replace('{day}', day)
                        .replace('{date}', date)
                        .replace('{month}', month)
                        .replace('{year}', year)
                        .replace('{hour}', hour)
                        .replace('{minute}', minute)
                        .replace('{second}', second)
                        ;
                }

                return format;
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
        fetchScoreboard(fetch_link, config = { limit: 5 }){
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
            .catch(async(errors) => {
                if (process.env.DEBUG_MODE == true) {
                    console.log(errors);
                    console.log("Fetch scoreboard failed, retrying..");
                }

                // Sleep then, Call Recursive if fail
                await this.sleep(1000);
                if (config.limit > 0) {
                    this.fetchScoreboard(fetch_link, { limit: config.limit - 1 });
                }
            });
        },
        refreshCountdown(){
            //let time = (this.end_time - this.start_time) / 1000;
            // this.end_time = new Date("2021-06-21");
            let time = Math.floor((this.end_time - new Date()) / 1000);

            if (time < 0){
                time = 0;
                // this.countdown = "- Contest Over -";
                this.countdown = this.app_config.scoreboard_contest_over_text;
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