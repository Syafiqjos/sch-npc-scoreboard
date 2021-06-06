import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ScoreboardDMOJ from '../views/ScoreboardDMOJ.vue'
import ScoreboardDomjudge from '../views/ScoreboardDomjudge.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    //path: '/event/npc/scoreboard/penyisihan/junior',
    path: '/scoreboard/penyisihan/junior',
    name: 'ScoreboardDMOJ',
    component: ScoreboardDMOJ
  },
  {
    //path: '/event/npc/scoreboard/penyisihan/senior',
    path: '/scoreboard/penyisihan/senior',
    name: 'ScoreboardDomjudge',
    component: ScoreboardDomjudge
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
