import Vue from 'vue'
import Router from 'vue-router'
import Game from './views/Game.vue'
import Register from './views/Register.vue'
import Scores from './views/Scores.vue'
import Login from './views/Login.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/scores',
      name: 'scores',
      component: Scores,
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
