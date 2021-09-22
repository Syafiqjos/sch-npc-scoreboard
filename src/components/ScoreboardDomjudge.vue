<template>
    <v-simple-table v-if="scoreboard_data && contest_details && problems && rankings && teams && organizations && organizations_images" class="scoreboard" fixed-header>
        <template v-slot:default>
            <thead>
                <tr>
                    <th style="width: 20px;">Rank</th>
                    <th>Team</th>
                    <th>Score</th>
                    <!-- Problems -->
                    <th v-for="(problem, index) in problems" :key="'problem-header-' + index" class="text-center tooltip">
                        {{ String.fromCharCode(65 + index) }}
                        <span class="tooltip-text" style="display:block;">{{ problem.problem_id }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rank, index) in rankings" :key="'ranking-' + index">
                    <td>{{ rank.rank }}</td>
                    <td style="width:250px;" class="tooltip">
                        <v-layout>
                             <!-- <span class="institute-logo-box" v-if="organizations[teams[rank.team_id].organization_id] == null || organizations_images[organizations[teams[rank.team_id].organization_id].id] == null"></span> -->
                             <!-- <img class="institute-logo" v-if="organizations[teams[rank.team_id].organization_id] == null || organizations_images[organizations[teams[rank.team_id].organization_id].id] == null" src="/null.png" /> -->
                             <!-- <img v-else class="institute-logo" :src="organizations_images[organizations[teams[rank.team_id].organization_id].id].image" />  -->
                             <img v-image-fall-back class="institute-logo" :src="`https://senior.schematics-npc.com/images/affiliations/${teams[rank.team_id].organization_id}.png`" /> 
                             
                             <p style="margin:auto; margin-left: 10px;"> {{ teams[rank.team_id].name }} </p>

                             <span class="tooltip-text" style="display:block;margin:0px;margin-left:200px;">{{ teams[rank.team_id].member || 'Member not specified' }}</span>
                        </v-layout>
                    </td>
                    <td>
                        <p style="text-align:center;">
                            {{ rank.score.total_time }}
                        </p>
                        <p style="text-align:center;" class="solution solution-points verdict-ac">
                            {{ rank.score.num_solved }}
                        </p>
                    </td>
                    <!-- Problems -->
                    <td v-for="(problem, index) in rank.problems" :key="'problem-header-' + index"
                        :class="problem.num_pending > 0 ? 'verdict-pending-vivid' : (problem.num_judged != 0 ? (problem.solved ? (problem.first_to_solve ? 'verdict-ac-first-vivid' : 'verdict-ac-vivid') : 'verdict-wa-vivid') : 'verdict-neutral')"
                    >
                        <template v-if="problem.num_judged != 0 || problem.num_pending != 0">
                            <p class="solution solution-time">
                                {{ problem.solved ? problem.time : '-' }}
                            </p>
                                
                            <p  :class="
                                problem.num_pending != 0 
                                ? ['solution', 'solution-points','verdict-pending'] 
                                : (problem.num_judged != 0 
                                    ? (problem.solved 
                                        ? (problem.first_to_solve 
                                            ? ['solution', 'solution-points','verdict-ac-first'] 
                                            : ['solution', 'solution-points','verdict-ac']) 
                                        : ['solution', 'solution-points','verdict-wa']) 
                                    : ['solution', 'solution-points','verdict-neutral'])"
                            >
                            
                                {{ problem.num_judged + (problem.num_judged == 1 ? " try" : " tries") }}
                            </p>
                        </template>
                        <template v-else>
                            <p class="solution">
                                -
                            </p>
                        </template>
                    </td>
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
            teams : null,
            organizations : null,
            organizations_images : null
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
            this.retrieveTeams();
            this.retrieveOrganizations();
            this.retrieveOrganizationImages();

            document.title = this.$parent.contest_name + " " + this.$parent.class_type + " - Schematics NPC 2021";
        },
        populateTable(){
            if (process.env.DEBUG_MODE == true) {
                console.log("PopulateTableAsDomjudge");
            }
            this.scoreboard_data = this.data;
            let row = this.scoreboard_data.rows[0];
            if (row){
                let lis = row.problems;
                for (let i = 0;i < lis.length;i++){
                    lis.name = lis.problem_id;
                }

                this.problems = lis;
                this.rankings = this.scoreboard_data.rows;

                this.$parent.start_time = new Date(this.scoreboard_data.state.started);
                this.$parent.end_time = new Date(this.scoreboard_data.state.ended);

                if (process.env.DEBUG_MODE == true) {
                    console.log(this.problems);
                }
            }
        },
        retrieveTeams(){
            let url = this.contest_details.scoreboard_domjudge_api_teams;

            this.axios.get(url)
            // this.axios.get("/scoreboard_data/domjudge_api_teams_example.json")
            // this.axios.get("http://192.168.233.131/domjudge/api/contests/2/teams")
            .then((response) => {
                let teams = response.data;

                // After Update JSON from Back-End
                teams = teams.data;

                let teams_new = {};
                
                teams.forEach((item) => { teams_new[item.id] = item; });

                this.teams = teams_new;
                if (process.env.DEBUG_MODE == true) {
                    console.log(this.teams);
                }
            })
            .catch(async (errors) => {
                if (process.env.DEBUG_MODE == true) {
                    console.log(errors);
                }

                // Sleep then, Call Recursive if fail
                await this.sleep(1000);
                this.retrieveTeams();
            });
        },
        retrieveOrganizations(){
            let url = this.contest_details.scoreboard_domjudge_api_organizations;

            this.axios.get(url)
            // this.axios.get("/scoreboard_data/domjudge_api_organizations_example.json")
            // this.axios.get("http://192.168.233.131/domjudge/api/contests/2/organizations")
            .then((response) => {
                let organizations = response.data;

                // After Update JSON from Back-End
                organizations = organizations.data;

                let organizations_new = {};

                organizations.forEach((item) => { organizations_new[item.id] = item; });

                this.organizations = organizations_new;
                if (process.env.DEBUG_MODE == true) {
                    console.log(this.organizations);
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
        },
        retrieveOrganizationImages(){
            this.axios.get("/scoreboard_data/institute_images.json")
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
    }
}
</script>