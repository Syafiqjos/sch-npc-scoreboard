<template>
    <v-simple-table v-if="scoreboard_data && contest_details && problems && rankings && users && organizations_images" class="scoreboard" fixed-header>
        <template v-slot:default>
            <thead>
                <tr>
                    <th>Rank</th>
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
                <tr v-for="(rank, index) in rankings" :key="'ranking-' + index">
                    <td :class="rank.is_disqualified ? 'verdict-disqualified' : ''">{{ index + 1 }}</td>
                    <!-- <td :class="rank.is_disqualified ? 'verdict-disqualified' : ''">{{ rank.user }}</td> -->

                    <td style="width:250px;" :class="rank.is_disqualified ? 'verdict-disqualified' : ''">
                        <v-layout>
                            <!-- Iki img sek salah lho -->
                            <span class="institute-logo-box" v-if="users[rank.user] == null || organizations_images[users[rank.user].school_id] == null"></span>
                            <img v-else class="institute-logo" :src="organizations_images[users[rank.user].school_id].image" /> 

                            <p v-if="rank.is_disqualified" class="verdict-disqualified" style="margin:auto;">{{ rank.user }}</p>
                            <p v-else style="margin:auto;">{{ rank.user }}</p>
                        </v-layout>
                    </td>
                   

                    <td :class="rank.is_disqualified ? 'verdict-disqualified' : ''">
                        <p style="text-align:center;">
                            {{ rank.cumulative_time | normalizeTime }}
                        </p>
                        <p style="text-align:center;" class="solution solution-points verdict-ac">
                            {{ rank.score }}
                        </p>
                    </td>
                    
                    <!-- Problems -->
                    <template v-for="(solution, index) in rank.solutions">
                        <template v-if="!rank.is_disqualified">
                            <td :key="'problem-header-' + index"
                            :class="solution ? (solution.points >= 100 ? 'verdict-ac-vivid' : 'verdict-wa-vivid') : 'verdict-neutral'">
                                <template v-if="solution">
                                    <p class="solution solution-time">
                                        {{ solution.time | normalizeTime }}
                                    </p>
                                    <p :class="(solution ? (solution.points >= 100 ? ['solution', 'solution-points','verdict-ac'] : ['solution', 'solution-points','verdict-wa']) : ['solution', 'solution-points','verdict-neutral'])">
                                        {{ solution.points + ".0" }}
                                    </p>
                                </template>
                                <template v-else>
                                    <p class="solution">
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
            organizations_images : null,
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
            this.retrieveOrganizationImages();

            document.title = this.$parent.contest_name + " " + this.$parent.class_type + " - Schematics NPC 2021";
        },
        populateTable(){
            if (process.env.DEBUG_MODE == true) {
                console.log("PopulateTableAsDMOJ");
            }
            this.scoreboard_data = this.data.data.object;
            this.problems = this.scoreboard_data.problems;
            this.rankings = this.scoreboard_data.rankings;

            this.$parent.start_time = new Date(this.scoreboard_data.start_time);
            this.$parent.end_time = new Date(this.scoreboard_data.end_time);
        },
        retrieveUsers(){
            let url = this.contest_details.scoreboard_dmoj_api_users;

            this.axios.get(url)
            .then((response) => {
                let users = response.data;

                // After Update JSON from Back-End
                users = users.data.data.objects;

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

                console.log(errors);

                // Sleep then, Call Recursive if fail
                await this.sleep(1000);
                this.retrieveUsers();
            });
        },
        retrieveOrganizationImages(){
            this.axios.get("/scoreboard_data/school_images.json")
            .then((response) => {
                this.organizations_images = response.data;

                if (process.env.DEBUG_MODE == true) {
                    console.log(this.organizations_images);
                }
            })
            .catch(async (errors) => {
                if (process.env.DEBUG_MODE == true) {
                    console.log(errors);
                }

                // Sleep then, Call Recursive if fail
                await this.sleep(1000);
                this.retrieveOrganizations();
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