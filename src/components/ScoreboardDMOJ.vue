<template>
    <v-simple-table v-if="scoreboard_data && problems && rankings" style="width:100%;">
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
                    <td v-for="(solution, index) in rank.solutions" :key="'problem-header-' + index">
                        <template v-if="solution">
                            <p>
                                {{ solution.score }}
                            </p>
                            <p>
                                {{ solution.time }}
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
        },
        populateTable(){
            console.log("PopulateTableAsDMOJ");
            this.scoreboard_data = this.data.data.object;
            this.problems = this.scoreboard_data.problems;
            this.rankings = this.scoreboard_data.rankings;

            this.$parent.start_time = new Date(this.scoreboard_data.start_time);
            this.$parent.end_time = new Date(this.scoreboard_data.end_time);
        }
    }
}
</script>