<template>
    <v-simple-table v-if="scoreboard_data && problems && rankings" style="width:100%;">
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-center">Rank</th>
                    <th class="text-center">Team</th>
                    <th class="text-center">Score</th>
                    <!-- Problems -->
                    <th v-for="(problem, index) in problems" :key="'problem-header-' + index" class="text-center tooltip">
                        {{ String.fromCharCode(65 + index) }}
                        <span class="tooltip-text">{{ problem.name }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rank, index) in rankings" :key="'ranking-' + index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ rank.user }}</td>
                    <td>{{ rank.score }}</td>
                    <!-- Problems -->
                    <td v-for="(solution, index) in rank.solutions" :key="'problem-header-' + index"
                        :class="solution ? (solution.points >= 100 ? 'verdict-ac' : 'verdict-wa') : 'verdict-neutral'"
                    >
                        <template v-if="solution">
                            <p class="solution solution-time">
                                {{ solution.time }}
                            </p>
                            <p class="solution solution-points">
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

<style>
    .tooltip {
        visibility : visible;
    }

    .tooltip .tooltip-text {
        visibility : hidden;
        width : 160px;
        background-color: aliceblue;
        color : #121212;
        text-align : center;
        
        padding : 5px;
        border-radius: 4px;
        transform : translate(-50%, -40%);

        position : absolute;
        z-index : 1;
    }

    .tooltip:hover .tooltip-text{
        visibility : visible;
    }

    .verdict-ac {
        background-color : #18A488;
    }

    .verdict-wa {
        background-color : #C93D45;
    }

    .verdict-neutral {
        background-color : transparent;
    }

    .solution {
        padding : 4px;
        padding-top : 8px;

        margin: 2px;

        text-align : center;
    }

    .solution-time {
        font-size : 1.1em;
    }

    .solution-points {
        font-size : 0.7em;
        padding : 1px;

        background-color : rgb(18, 18, 18, 0.8);
        border-radius : 2px;
    }

    thead, tbody, tr, th, td {
        text-align : center;
    }
</style>