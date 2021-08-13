<template>
    <v-simple-table v-if="scoreboard_data && contest_details && problems && rankings && organizations_images" class="scoreboard" fixed-header>
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
                    <td :class="rank.is_disqualified ? 'verdict-disqualified' : ''">{{ rank.user }}</td>

                    <!-- 
                    <td v-if="rank.is_disqualified" class="verdict-disqualified">{{ rank.user }}</td>
                    <td v-else style="width:250px;">
                        <v-layout>
                            <!- Iki img sek salah lho --
                            <img class="institute-logo" :src="organizations_images[organizations[teams[rank.team_id].organization_id].id] == null 
                            ? '' : organizations_images[organizations[teams[rank.team_id].organization_id].id].image" /> 
                            <p style="margin:auto;">{{ rank.user }}</p>
                        </v-layout>
                    </td>
                    -->

                    <td :class="rank.is_disqualified ? 'verdict-disqualified' : ''">
                        <p style="text-align:center;">
                            {{ rank.cumulative_time }}
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
        retrieveOrganizationImages(){
            this.axios.get("/scoreboard_data/school_images.json")
            .then((response) => {
                this.organizations_images = response.data;

                if (process.env.DEBUG_MODE == true) {
                    console.log(this.organizations_images);
                }
            })
            .catch((errors) => {
                if (process.env.DEBUG_MODE == true) {
                    console.log(errors);
                }
            });
        }
    }
}
</script>