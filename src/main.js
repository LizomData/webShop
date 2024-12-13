import Vue from 'vue'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import VueParticles from 'vue-particles'
import axios from "axios";

import App from './App.vue'
// import indexPage from '@/components/indexPage.vue'
import TestPage from '@/components/test.vue'
import hw from "@/components/HelloWorld.vue"
// import ExPage from './components/exPage.vue'
// import captchaPage from './components/captchaPage.vue'
import LoginPage from './components/loginPage2.vue'
import GoodsPage from './components/goodsPage.vue'
import CartsPage from './components/cartsPage.vue'
import CartsPage2 from './components/cartsPage2.vue'
import OrdersPage from './components/ordersPage.vue'

Vue.config.productionTip = false


const routes = [
  {
    path: '/',
    component: GoodsPage
  },
  {
    path: '/goods',
    component: GoodsPage
  },
  {
    path: '/carts2',
    component: CartsPage2
  },
  {
    path: '/orders',
    component: OrdersPage
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/carts',
    component: CartsPage
  },

  {
    path: '/test',

    component: TestPage
  },

  {
    path: '/hw',
    component: hw
  },


]

const router = new VueRouter(
  {
    mode: "history",
    routes
  }
)
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('userId') !== null;

//   if (to.path === '/login') {
//     next();
//   } else if (!isAuthenticated) {
//     next('/login');
//   } else {
//     next();
//   }
// });
Vue.prototype.axiosIns = axios.create({
  baseURL: "/api",
  tiemout: 5000,
});

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueParticles)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
