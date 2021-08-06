import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ContestNameList from '../views/ContestNameList.vue'
import ClassTypeList from '../views/ClassTypeList.vue'
import Scoreboard from '../views/Scoreboard.vue'
import PageNotFound from '../views/PageNotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/scoreboard',
    name: 'ContestNameList',
    component: ContestNameList
  },
  {
    path: '/scoreboard/:contest',
    name: 'ClassTypeList',
    component: ClassTypeList
  },
  /*
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" '../views/About.vue')
  },
  */
  {
    //path: '/event/npc/scoreboard/penyisihan/junior',
    //path: '/scoreboard/penyisihan/junior',
    path: '/scoreboard/:contest/:class',
    name: 'Scoreboard',
    component: Scoreboard
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
