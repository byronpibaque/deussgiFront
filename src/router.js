import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Login from './components/Login.vue'
import Rol from './components/Rol.vue'
import Cargo from './components/Cargo.vue'
import Congregacion from './components/Congregacion.vue'
import Membresia from './components/Membresia.vue'
import Usuario from './components/Usuario.vue'
import IngresoDiario from './components/IngresoDiario.vue'
import Egresos from './components/Egresos.vue'
import Misiones from './components/Misiones.vue'
import CarteraMisiones from './components/CarteraMisiones.vue'
import CarteraIngresos from './components/CarteraIngresos.vue'
import CarteraEgresos from './components/CarteraEgresos.vue'
import Carteras from './components/Carteras.vue'
import Porcentaje from './components/Porcentaje.vue'
import CRingresos from './components/ConsultayReporteIngresos.vue'
import Mtranferencias from './components/MisionesTransferencias.vue'
import CarteraPorcentaje from './components/CarteraPorcentaje.vue'
import Balance from './components/Balances.vue'
Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/Mtransferencias',
      name: 'misionestransferencias',
      component: Mtranferencias,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/balance',
      name: 'balance',
      component: Balance,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/porcentaje',
      name: 'porcentaje',
      component: Porcentaje,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/carteraporcentaje',
      name: 'carteraporcentaje',
      component: CarteraPorcentaje,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/carteraegresos',
      name: 'carteraegresos',
      component: CarteraEgresos,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/cr_ingresos',
      name: 'cringresos',
      component: CRingresos,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/carteraingresos',
      name: 'carteraingresos',
      component: CarteraIngresos,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/carteramisiones',
      name: 'carteramisiones',
      component: CarteraMisiones,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/misiones',
      name: 'misiones',
      component: Misiones,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/egresos',
      name: 'egresos',
      component: Egresos,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/ingresodiario',
      name: 'ingresodiario',
      component: IngresoDiario,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario,
      meta:{
        administrador:true
      }
    },
    {
      path: '/membresia',
      name: 'membresia',
      component: Membresia,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/congregacion',
      name: 'congregacion',
      component: Congregacion,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/carteras',
      name: 'carteras',
      component: Carteras,
      meta:{
        administrador:true
      }
    },
    {
      path: '/cargo',
      name: 'cargo',
      component: Cargo,
      meta:{
        administrador:true
      }
    },
    {
      path: '/rol',
      name: 'rol',
      component: Rol,
      meta:{
        administrador:true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{
        administrador:true,
        secretaria:true,
        tesorero:true,
        obrero:true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{
        libre:true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next()
  }else if (store.state.usuario && store.state.usuario.rol=='5ff86c9fe04cdc30f4805fe2') {
    if (to.matched.some(record => record.meta.administrador)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='5ff886627e7f622aa802fa36') {
    if (to.matched.some(record => record.meta.obrero)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='600762432aeeb8107477afda') {
    if (to.matched.some(record => record.meta.secretaria)) {
      next()
    }
  }
  else if (store.state.usuario && store.state.usuario.rol=='6007624d2aeeb8107477afdb') {
    if (to.matched.some(record => record.meta.tesorero)) {
      next()
    }
  
  }
  else{
    next({name:'login'})
  }
})

export default router
