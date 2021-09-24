<template v-if="$parent.app_config && $parent.app_config.active">
    <v-simple-table v-if="scoreboard_data && contest_details && problems && rankings && teams && organizations" class="scoreboard" fixed-header>
        <template v-slot:default>
            <thead>
                <tr>
                    <th style="width: 20px;">Rank</th>
                    <th>Team</th>
                    <th>Score</th>
                    <!-- Problems -->
                    <th v-for="(problem, index) in problems" :key="'problem-header-' + index" class="text-center tooltip">
                        {{ String.fromCharCode(65 + index) }}
                        <span class="tooltip-text" style="display:block;">Problem {{ problem.label }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rank, index) in rankings" :key="'ranking-' + index">
                    <td>{{ rank.rank }}</td>
                    <td style="width:250px;" class="tooltip">
                        <v-layout>
                             <img v-image-fall-back="$parent.app_config.judge.domjudge.scoreboard_fallback_image" class="institute-logo" :src="`${$parent.app_config.judge.domjudge.scoreboard_images_url}/${teams[rank.team_id].organization_id}${$parent.app_config.judge.domjudge.scoreboard_images_ext}`" /> 
                             
                             <div style="margin-top: auto; margin-bottom: auto">
                                <p style="margin:auto; margin-left: 10px;"> <b>{{ teams[rank.team_id].name }}</b> </p>
                                <p style="margin:auto; margin-left: 10px; font-size: 0.8em; color: hsla(0, 100%, 100%, 0.75)">{{ organizations[teams[rank.team_id].organization_id].formal_name }}</p>
                             </div>

                             <span class="tooltip-text" style="margin:0px;position:absolute;transform:translateY(-4em);width: auto;min-width:250px;z-index: 2">
                                 <span v-if="!teams[rank.team_id].members">Member not specified</span>
                                 <span v-else>
                                     <span>Anggota tim:</span>
                                     <li v-for="member in teams[rank.team_id].members" :key="member" style="list-style-type: none">
                                        {{ member }}
                                    </li>
                                 </span>
                             </span>
                        </v-layout>
                    </td>
                    <td>
                        <p style="text-align:center;">
                            {{ rank.score.num_solved }}
                        </p>
                        <p style="text-align:center;" class="solution solution-points verdict-ac">
                            {{ rank.score.total_time }}
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
                            
                                {{ problem.num_judged + (problem.num_pending > 0 ? ` + ${problem.num_pending}` : '') + ((problem.num_judged + problem.num_pending) == 1 ? " try" : " tries") }}
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
            organizations : null
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

            document.title = this.$parent.contest_name + " " + this.$parent.class_type + " - " + this.$parent.app_config.event_title;
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

                if (!this.scoreboard_data.state.started){
                    this.scoreboard_data.state.started = '2021-09-24T14:00:00';
                }

                if (!this.scoreboard_data.state.ended){
                    this.scoreboard_data.state.ended = '2021-09-25T02:00:00';
                }

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
            .then((response) => {
                let teams = response.data;

                // After Update JSON from Back-End
                if (this.$parent.app_config.custom_backend_api){
                    teams = teams.data;
                }

                let teams_new = {};
                
                teams.forEach((item) => {
                    teams_new[item.id] = item;
                    if(teams_new[item.id].members) {
                        teams_new[item.id].members = teams_new[item.id].members.split('\n')
                    }
                });

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
            .then((response) => {
                let organizations = response.data;

                // After Update JSON from Back-End
                if (this.$parent.app_config.custom_backend_api){
                    organizations = organizations.data;
                }

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
        }
    }
}
</script>