<template v-if="$parent.app_config && $parent.app_config.active">
    <v-simple-table v-if="scoreboard_data && contest_details && problems && rankings && users" class="scoreboard" fixed-header>
        <template v-slot:default>
            <thead>
                <tr>
                    <th style="width: 20px;">Rank</th>
                    <th>Team</th>
                    <th>Score</th>
                    <!-- Problems -->
                    <th v-for="(problem, index) in problems" :key="'problem-header-' + index" class="text-center tooltip">
                        {{ String.fromCharCode(65 + index) }}
                        <span class="tooltip-text" style="display:block;">{{ problem.name }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rank, index) in rankings" :key="'ranking-' + index" style="height: 5rem">
                    <td :class="rank.is_disqualified ? 'verdict-disqualified' : ''">{{ index + 1 }}</td>

                    <td style="width:400px;" :class="rank.is_disqualified ? 'verdict-disqualified' : '' + ' tooltip'">
                        <v-layout>
                            <img v-image-fall-back="$parent.app_config.judge.domjudge.scoreboard_fallback_image" class="institute-logo" :src="`${$parent.app_config.judge.dmoj.scoreboard_images_url}/${users[rank.user].school_id}${$parent.app_config.judge.dmoj.scoreboard_images_ext}`" /> 

                            <div>
                                <p v-if="rank.is_disqualified" class="verdict-disqualified" style="margin:auto; margin-left: 10px;">{{ users[rank.user].fullname }}</p>
                                <p v-else style="margin:auto; margin-left: 10px;"><b>{{ users[rank.user].fullname }}</b></p>

                                <p style="margin:auto; margin-left: 10px; font-size: 0.8em; color: hsla(0, 100%, 100%, 0.75)">{{ users[rank.user].school_name }}</p>
                            </div>
                            
                        </v-layout>
                    </td>
                   

                    <td :class="rank.is_disqualified ? 'verdict-disqualified' : (rank.score / problems.length >= 100 ? 'verdict-ac-100' :
                                (rank.score / problems.length >= 80 ? 'verdict-wa-80' : 
                                (rank.score / problems.length >= 60 ? 'verdict-wa-60' : 
                                (rank.score / problems.length >= 50 ? 'verdict-wa-50' : 
                                (rank.score / problems.length >= 40 ? 'verdict-wa-40' : 
                                (rank.score / problems.length >= 20 ? 'verdict-wa-20' : 'verdict-wa-0'))))))">
                        <!-- <p style="text-align:center;">
                            {{ rank.cumulative_time | normalizeTime }}
                        </p> -->
                        <p style="text-align:center; margin: auto">
                            {{ rank.score }}
                        </p>
                    </td>
                    
                    <!-- Problems -->
                    <template v-for="(solution, index) in rank.solutions">
                        <template v-if="!rank.is_disqualified">
                            <td :key="'problem-header-' + index"
                            :class="solution ? (solution.points >= 100 ? 'verdict-ac-100' :
                                (solution.points >= 80 ? 'verdict-wa-80' : 
                                (solution.points >= 60 ? 'verdict-wa-60' : 
                                (solution.points >= 50 ? 'verdict-wa-50' : 
                                (solution.points >= 40 ? 'verdict-wa-40' : 
                                (solution.points >= 20 ? 'verdict-wa-20' : 'verdict-wa-0')))))) : 'verdict-neutral'">
                                <template v-if="solution">
                                    <p align="center" style="margin: auto">
                                        {{ solution.points + "" }}
                                    </p>
                                </template>
                                <template v-else>
                                    <p align="center" style="margin: auto">
                                        -
                                    </p>
                                </template>
                            </td>
                        </template>
                        <template v-else>
                            <td :key="'problem-header-' + index"
                            class="verdict-disqualified">
                                DISQUALIFIED
                            </td>
                        </template>
                    </template>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>
export default {
    data(){
        return {
            scoreboard_data : null,
            problems : null,
            rankings : null,
            users: null
        }
    },
    props : [
        'data', 'contest_details'
    ],
    mounted(){
        this.initialization();
    },
    methods : {
        initialization(){
            this.populateTable();
            this.retrieveUsers();

            document.title = this.$parent.contest_name + " " + this.$parent.class_type + " - " + this.$parent.app_config.event_title;
        },
        sortRanks(rankings) {
            rankings.forEach((ranking) => {
                ranking.last_ac_time = 0;
                ranking.solutions.forEach((solution) => {
                    if (solution?.points > 0.0) {
                        ranking.last_ac_time = Math.max(solution.time, ranking.last_ac_time);
                    }
                });
            });

            rankings.sort(function (a, b) {
                if (a.score > b.score) return -1
                    if (a.score == b.score && a.last_ac_time < b.last_ac_time) 
                        return -1
                    return 1
                });
            return rankings;
        },
        populateTable(){
            if (process.env.DEBUG_MODE == true) {
                console.log("PopulateTableAsDMOJ");
            }
            this.scoreboard_data = this.data.data.object;
            
            this.problems = this.scoreboard_data.problems;
            
            this.rankings = this.scoreboard_data.rankings;
            this.rankings = this.sortRanks(this.rankings);

            this.$parent.start_time = new Date(this.scoreboard_data.start_time);
            this.$parent.end_time = new Date(this.scoreboard_data.end_time);
        },
        retrieveUsers(){
            let url = this.contest_details.scoreboard_dmoj_api_users;

            this.axios.get(url)
            .then((response) => {
                let users = response.data;

                // After Update JSON from Back-End
                if (this.$parent.app_config.custom_backend_api){
                    users = users.data.data.objects;
                } else {
                    users = users.data.objects;
                }

                let users_new = {};

                users.forEach((item) => { users_new[item.username] = item; });

                this.users = users_new;
                if (process.env.DEBUG_MODE == true) {
                    console.log(this.users);
                }
            })
            .catch(async (errors) => {
                if (process.env.DEBUG_MODE == true) {
                    console.log(errors);
                }

                // Sleep then, Call Recursive if fail
                await this.sleep(1000);
                this.retrieveUsers();
            });
        }
    },
    filters : {
        normalizeTime(time){
            return Number.parseInt(time / 60)
        }
    }
}
</script>