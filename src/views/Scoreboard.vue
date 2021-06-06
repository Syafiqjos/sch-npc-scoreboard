<template>
    <v-container fill-height fluid>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Schematics NPC - Penyisihan Junior</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn to="/home/exams" class="mr-2">
                Junior
            </v-btn>
            <v-btn to="/home/history"  >
                Senior
            </v-btn>
        </v-app-bar>
        <v-layout>
            <v-simple-table style="width:100%;">
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
                            <td>{{ rank.user }}</td>
                            <td>{{ rank.score }}</td>
                            <!-- Problems -->
                            <td v-for="(problem, index) in rank.solutions" :key="'problem-header-' + index">
                                <template v-if="problem">
                                    <p>
                                        {{ problem.points }}
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
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data(){
        return {
            scoreboard_data : null,
            judge_type : null,
            problems : [],
            rankings : [],
            teams : [],
            organizations : []
        }
    },
    mounted(){
        this.retrieveScoreboard();
    },
    methods : {
        checkJudgeType(data){
            if (data.api_version){
                return 'dmoj';
            } else if (data.event_id){
                return 'domjudge';
            }
            return null;
        },
        populateTable(data){
            this.judge_type = this.checkJudgeType(data);
            if (this.judge_type == 'dmoj'){
                this.populateTableAsDMOJ(data);
            } else if (this.judge_type == 'domjudge'){
                this.populateTableAsDomjudge(data);
                this.retrieveDomjudgeTeams();
                this.retrieveDomjudgeOrganizations();
            }
        },
        populateTableAsDMOJ(data){
            console.log("PopulateTableAsDMOJ");
            this.scoreboard_data = data.data.object;
            this.problems = this.scoreboard_data.problems;
            this.rankings = this.scoreboard_data.rankings;
        },
        populateTableAsDomjudge(data){
            console.log("PopulateTableAsDomjudge");
            this.scoreboard_data = data;
            let problem = data.rows[0];
            if (problem){
                let lis = problem.problems;
                for (let i = 0;i < lis.length;i++){
                    lis.name = lis.problem_id;
                }

                this.problems = lis;


            }
        },
        retrieveScoreboard(){
            this.axios.get("http://192.168.43.131:8080/data/domjudge_api_example.json")
            .then((response) => {
                this.populateTable(response.data);
                console.log(response.data);
            })
            .catch((errors) => {
                console.log(errors);
            });
        },
        retrieveDomjudgeTeams(){
            this.axios.get("http://192.168.43.131:8080/data/domjudge_api_teams_example.json")
            .then((response) => {
                
                console.log(response.data);
            })
            .catch((errors) => {
                console.log(errors);
            });
        },
        retrieveDomjudgeOrganizations(){
            this.axios.get("http://192.168.43.131:8080/data/domjudge_api_organizations_example.json")
            .then((response) => {
                
                console.log(response.data);
            })
            .catch((errors) => {
                console.log(errors);
            });
        }
    }
}
</script>