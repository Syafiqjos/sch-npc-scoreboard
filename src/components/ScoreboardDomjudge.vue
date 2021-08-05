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
                    <td style="width:250px;">
                        <v-layout>
                             <img class="institute-logo" :src="organizations_images[organizations[teams[rank.team_id].organization_id].id] == null 
                             ? '' : organizations_images[organizations[teams[rank.team_id].organization_id].id].image" /> 
                             <p style="margin:auto;"> {{ teams[rank.team_id].name }} </p>
                        </v-layout>
                    </td>
                    <td>{{ rank.score.num_solved * 100 }}</td>
                    <!-- Problems -->
                    <td v-for="(problem, index) in rank.problems" :key="'problem-header-' + index"
                        :class="problem.num_judged != 0 ? (problem.solved ? (problem.first_to_solve ? 'verdict-ac-first-vivid' : 'verdict-ac-vivid') : 'verdict-wa-vivid') : 'verdict-neutral'"
                    >
                        <template v-if="problem.num_judged != 0">
                            <p class="solution solution-time">
                                {{ problem.solved ? problem.time : '-' }}
                            </p>
                            <!-- // Default, bagian nilai 0 atau 100 kalo AC
                            <p  :class="(problem.num_judged != 0 ? (problem.solved ? ['solution', 'solution-points','verdict-ac'] : ['solution', 'solution-points','verdict-wa']) : ['solution', 'solution-points','verdict-neutral'])">
                                {{ problem.solved ? 100 : 0 }}
                            </p>
                            -->

                                <p  :class="(problem.num_judged != 0 ? (problem.solved ? (problem.first_to_solve ? ['solution', 'solution-points','verdict-ac-first'] : ['solution', 'solution-points','verdict-ac']) : ['solution', 'solution-points','verdict-wa']) : ['solution', 'solution-points','verdict-neutral'])">
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
            organizations_images : {
                'its' : { 'name' : 'Institut Teknologi Sepuluh Nopember', 'image' : '/institute_images/its.png' } ,
                'unair' : { 'name' : 'Universitas Airlangga', 'image' : 'unair.png' } ,
                'itb' : { 'name' : 'Institut Teknologi Bandung', 'image' : 'itb.png' } ,
                'ui' : { 'name' : 'Universitars Indonesia', 'image' : 'ui.png' } ,
                'unsyiah' : { 'name' : 'Universitas Syiah Kuala', 'image' : 'unsyiah.png' } ,
                'unimal' : { 'name' : 'Universitas Malikussaleh', 'image' : 'unimal.png' } ,
                'unsam' : { 'name' : 'Universitas Samudra', 'image' : 'unsam.png' } ,
                'utu' : { 'name' : 'Universitas Teuku Umar', 'image' : 'utu.png' } ,
                'uinar' : { 'name' : 'UIN Ar-Raniry', 'image' : 'uinar.png' } ,
                'iain_langsa' : { 'name' : 'IAIN Langsa', 'image' : 'iain_langsa.png' } ,
                'poltekkes_aceh' : { 'name' : 'Politeknik Kesehatan Banda Aceh', 'image' : 'poltekkes_aceh.png' } ,
                'usm' : { 'name' : 'Universitas Serambi Mekkah', 'image' : 'usm.png' } ,
                'usu' : { 'name' : 'Universitas Sumatera Utara', 'image' : 'usu.png' } ,
                'unimed' : { 'name' : 'Universitas Negeri Medan', 'image' : 'unimed.png' } ,
                'polmed' : { 'name' : 'Politeknik Negeri Medan', 'image' : 'polmed.png' } ,
                'polimedia' : { 'name' : 'Politeknik Negeri Media Kreatif', 'image' : 'polimedia.png' } ,
                'uinsu' : { 'name' : 'UIN Sumatera Utara', 'image' : 'uinsu.png' } ,
                'iain_padangsidimpuan' : { 'name' : 'IAIN Padang Sidempuan', 'image' : 'iain_padangsidimpuan.png' } ,
                'unand' : { 'name' : 'Universitas Andalas', 'image' : 'unand.png' } ,
                'unp' : { 'name' : 'Universitas Negeri Padang', 'image' : 'unp.png' } ,
                'pnp' : { 'name' : 'Politeknik Negeri Padang', 'image' : 'pnp.png' } ,
                'unri' : { 'name' : 'Universitas Riau', 'image' : 'UNRI.png' } ,
                'UGM' : { 'name' : 'Universitas Gadjah Mada', 'image' : 'UGM.png' }
            }
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
            // this.axios.get("http://192.168.233.131/domjudge/api/contests/2/teams")
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
            // this.axios.get("http://192.168.233.131/domjudge/api/contests/2/organizations")
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