<template>
    <v-simple-table v-if="scoreboard_data && problems && rankings" class="scoreboard" fixed-header>
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
                    <td>{{ index + 1 }}</td>
                    <td style="width:250px;">{{ rank.user }}</td>
                    <td>{{ rank.score }}</td>
                    <!-- Problems -->
                    <td v-for="(solution, index) in rank.solutions" :key="'problem-header-' + index"
                        :class="solution ? (solution.points >= 100 ? 'verdict-ac-vivid' : 'verdict-wa-vivid') : 'verdict-neutral'"
                    >
                        <template v-if="solution">
                            <p class="solution solution-time">
                                {{ solution.time }}
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