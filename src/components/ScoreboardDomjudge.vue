<template>
    <v-simple-table v-if="scoreboard_data && problems && rankings && teams && organizations" style="width:100%;">
        <template v-slot:default>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Score</th>
                    <!-- Problems -->
                    <th v-for="(problem, index) in problems" :key="'problem-header-' + index" class="text-left">
                        {{ String.fromCharCode(65 + index) }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rank, index) in rankings" :key="'ranking-' + index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ teams[rank.team_id].name }}</td>
                    <td>{{ rank.score.num_solved }}</td>
                    <!-- Problems -->
                    <td v-for="(problem, index) in rank.problems" :key="'problem-header-' + index">
                        <template v-if="problem">
                            <p>
                                {{ problem.solved ? 100 : 0 }}
                            </p>
                            <p>
                                {{ problem.time }}
                            </p>
                        </template>
                        <template v-else>
                            <p>
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

                console.log(this.problems);
            }
        },
        retrieveTeams(){
            this.axios.get("/data/domjudge_api_teams_example.json")
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
            this.axios.get("/data/domjudge_api_organizations_example.json")
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