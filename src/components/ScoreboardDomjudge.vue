<template>
    <v-simple-table v-if="scoreboard_data && problems && rankings && teams && organizations" class="scoreboard" fixed-header>
        <template v-slot:default>
            <thead>
                <tr>
                    <th>Rank</th>
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
                    <td>{{ index + 1 }}</td>
                    <td>{{ teams[rank.team_id].name }}</td>
                    <td>{{ rank.score.num_solved * 100 }}</td>
                    <!-- Problems -->
                    <td v-for="(problem, index) in rank.problems" :key="'problem-header-' + index"
                        :class="problem.num_judged != 0 ? (problem.solved ? 'verdict-ac-vivid' : 'verdict-wa-vivid') : 'verdict-neutral'"
                    >
                        <template v-if="problem.num_judged != 0">
                            <p class="solution solution-time">
                                {{ problem.solved ? problem.time : '-' }}
                            </p>
                            <p  :class="(problem.num_judged != 0 ? (problem.solved ? ['solution', 'solution-points','verdict-ac'] : ['solution', 'solution-points','verdict-wa']) : ['solution', 'solution-points','verdict-neutral'])">
                                {{ problem.solved ? 100 : 0 }}
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
        'data'
    ],
    mounted(){
        this.initialization();
    },
    methods : {
        initialization(){
            this.populateTable();
            this.retrieveTeams();
            this.retrieveOrganizations();
        },
        populateTable(){
            console.log("PopulateTableAsDomjudge");
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

                console.log(this.problems);
            }
        },
        retrieveTeams(){
            this.axios.get("/scoreboard_data/domjudge_api_teams_example.json")
            .then((response) => {
                let teams = response.data;
                let teams_new = {};
                
                teams.forEach((item) => { teams_new[item.id] = item; });

                this.teams = teams_new;
                console.log(this.teams);
            })
            .catch((errors) => {
                console.log(errors);
            });
        },
        retrieveOrganizations(){
            this.axios.get("/scoreboard_data/domjudge_api_organizations_example.json")
            .then((response) => {
                let organizations = response.data;
                let organizations_new = {};
                
                organizations.forEach((item) => { organizations_new[item.id] = item; });

                this.organizations = organizations_new;
                console.log(this.organizations);

                this.show_scoreboard = true;
            })
            .catch((errors) => {
                console.log(errors);
            });
        }
    }
}
</script>