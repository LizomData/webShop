import Vue from 'vue'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import VueParticles from 'vue-particles'  


import App from './App.vue'
// import indexPage from '@/components/indexPage.vue'
import TestPage from '@/components/test.vue'
import hw from "@/components/HelloWorld.vue"
// import ExPage from './components/exPage.vue'
// import captchaPage from './components/captchaPage.vue'
import LoginPage from './components/loginPage2.vue'
import GoodsPage from './components/goodsPage.vue'

Vue.config.productionTip = false


const routes =[
  {
    path:'/',
    component:GoodsPage
  },
  {
    path:'/login',
    component:LoginPage
  },
    {
      path:'/test',
      
      component:TestPage
    },
   
    {
      path:'/hw',
      component:hw
    },

    
]

const router =new VueRouter(
  {
    mode:"history",
    routes
  }
)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueParticles)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
