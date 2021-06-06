<template>
    <v-container fill-height fluid>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Schematics NPC - Penyisihan Senior</v-toolbar-title>
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
                            <th v-for="(problem, index) in scoreboard_data.problems" :key="'problem-header-' + index" class="text-left">
                                {{ String.fromCharCode(65 + index) }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(rank, index) in scoreboard_data.rankings" :key="'ranking-' + index">
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
        }
    },
    mounted(){
        this.axios.get("http://192.168.43.131:8080/data/domjudge_api_example.json")
        .then((response) => {
            this.scoreboard_data = response.data.data.object;
            console.log(this.scoreboard_data);
        })
        .catch((errors) => {
            console.log(errors);
        });
    }
}
</script>