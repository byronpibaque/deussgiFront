<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esObrero || esSecretaria || esTesorero">
          <v-list-tile  :to="{name:'home'}">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Inicio</v-list-tile-title>
          </v-list-tile>
        </template>
        <template>
          <v-list-group >
            <v-list-tile slot="activator">
                <v-list-tile-action>
                <v-icon>admin_panel_settings</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Administración</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="pink--text" :to="{name: 'rol'}" v-if="esAdministrador">
              <v-list-tile-action>
                <v-icon>supervised_user_circle</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Roles</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="green--text" :to="{name: 'cargo'}" v-if="esAdministrador">
              <v-list-tile-action>
                <v-icon>work</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Cargos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{name: 'congregacion'}">
              <v-list-tile-action>
                <v-icon>roofing</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Congregaciones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'carteras'}" v-if="esAdministrador">
              <v-list-tile-action>
                <v-icon>account_balance_wallet</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Carteras</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="orange--text" :to="{name: 'membresia'}">
              <v-list-tile-action>
                <v-icon>groups</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Membresia</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="pink--text" :to="{name: 'usuario'}" v-if="esAdministrador">
              <v-list-tile-action>
                <v-icon>groups</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Usuarios</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="esAdministrador|| esObrero || esSecretaria || esTesorero">
          <v-list-group >
            <v-list-tile slot="activator">
                <v-list-tile-action>
                <v-icon>monetization_on</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Ingresos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="pink--text" :to="{name: 'ingresodiario'}">
              <v-list-tile-action>
                <v-icon>attach_money</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Ingresos Diarios</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="orange--text" :to="{name: 'misiones'}">
              <v-list-tile-action>
                <v-icon>card_travel</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Misiones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{name: 'cringresos'}">
              <v-list-tile-action>
                <v-icon>request_quote</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consultas y Reportes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="esAdministrador|| esObrero || esSecretaria || esTesorero">
          <v-list-group >
            <v-list-tile slot="activator">
                <v-list-tile-action>
                <v-icon>point_of_sale</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Egresos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'egresos'}">
              <v-list-tile-action>
                <v-icon>payments</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Egresos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{name: 'congregacion'}">
              <v-list-tile-action>
                <v-icon>request_quote</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Consultas y Reportes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="esAdministrador|| esObrero || esSecretaria || esTesorero">
          <v-list-group >
            <v-list-tile slot="activator">
                <v-list-tile-action>
                <v-icon>toll</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Transferencias</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           <v-list-tile class="pink--text" :to="{name: 'misionestransferencias'}">
              <v-list-tile-action>
                <v-icon>card_travel</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Misiones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
              <v-list-tile class="green--text" :to="{name: 'porcentaje'}">
              <v-list-tile-action>
                <v-icon>calculate</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Porcentajes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        
       <template v-if="esAdministrador|| esObrero || esSecretaria || esTesorero">
          <v-list-group >
            <v-list-tile slot="activator">
                <v-list-tile-action>
                <v-icon>account_balance_wallet</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Cartera</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'carteraingresos'}">
              <v-list-tile-action>
                <v-icon>monetization_on</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Ingresos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="blue--text" :to="{name: 'carteraegresos'}">
              <v-list-tile-action>
                <v-icon>request_quote</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Egresos</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="pink--text" :to="{name: 'carteramisiones'}">
              <v-list-tile-action>
                <v-icon>card_travel</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Misiones</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile class="orange--text" :to="{name: 'carteraporcentaje'}">
              <v-list-tile-action>
                <v-icon>price_check</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Porcentaje</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
         
       <template v-if="esAdministrador|| esObrero || esSecretaria || esTesorero">
          <v-list-group >
            <v-list-tile slot="activator">
                <v-list-tile-action>
                <v-icon>query_stats</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Reportes</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="green--text" :to="{name: 'balance'}">
              <v-list-tile-action>
                <v-icon>monetization_on</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Balances</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           </v-list-group>
        </template>
       
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue darken-4" dark app :clipped-left="$vuetify.breakpoint.mdAndUp" fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down" v-if="$store.state.token" >{{$store.state.usuario.nombres}}</span>
      </v-toolbar-title>
       
    
      <v-spacer></v-spacer>
      <v-btn icon @click="salir()" v-if="logueado">
        <v-icon>logout</v-icon>
      </v-btn>
      <v-btn icon :to="{name:login}" v-else>
        <v-icon>apps</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <v-footer dark height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="blue darken-4" class="white--text">
            <v-card-text class="white--text pt-0">Sistema de gestión para Iglesias. &copy;2021</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: "App",
  data() {
    return {
      login:"",
      drawer: true,
   
     
    };
  },
  
 
  computed: {
    
    logueado() {
      return this.$store.state.usuario;
    },
    esAdministrador() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "5ff86c9fe04cdc30f4805fe2"
      );
    },
    esObrero() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "5ff886627e7f622aa802fa36"
      );
    },
    esSecretaria() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "600762432aeeb8107477afda"
      );
    },
    esTesorero() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "6007624d2aeeb8107477afdb"
      );
    }
  },
  created() {
    this.$store.dispatch("autoLogin");
    
   
  },
 
  methods: {
    
    isMobile(){
      if( (navigator.userAgent.match(/Android/i)) ||
            (navigator.userAgent.match(/webOS/i)) ||
            (navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i)) ||
            (navigator.userAgent.match(/BlackBerry/i)))
            {              
              return true
            }
             else{
              return false
            }
       
    },  
    salir() {
      this.$store.dispatch("salir");
     
    },
   
  }
  
};
</script>
