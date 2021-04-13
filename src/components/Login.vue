<template>
 <v-layout align-center justify-center>
 <v-flex xs12 sm8 md6 lg5 xl4>
 <v-card>
 <v-toolbar dark color="blue darken-4">
 <v-toolbar-title>
 INICIO DE SESIÓN
 </v-toolbar-title>
 </v-toolbar>
 <v-card-text>
 <v-text-field autofocus color="accent" v-model="email" label="Ingrese su usuario/correo" required>
 </v-text-field>
  <v-flex xs6 sm6 md6 lg6 xl6>
    <v-text-field type="password" color="accent" v-on:keyup.enter="ingresar"  v-model="password" label="Ingrese su contraseña" required>
        
    </v-text-field>
  </v-flex>
  


 <v-flex class="red--text" v-if="errorM">
     {{errorM}}
 </v-flex>
 </v-card-text>
 <v-card-actions class="px-3 pb-3">
 <v-flex text-xs-right>
 <v-btn @click="ingresar" color="blue darken-4" class="white--text">Ingresar</v-btn>
 </v-flex>
 </v-card-actions>
 </v-card>
 </v-flex>
 </v-layout>
</template>

<script>
 import axios from 'axios'
export default {
   
    data() {
 return {
 email: '',
 password: '',
 errorM:null
 }
},
 
methods: {
    
    ingresar(){
        axios.post('usuario/login',{correo:this.email, clave:this.password})
        .then(
            respuesta =>{
                return respuesta.data;
            }).then( data=>{
                this.$store.dispatch("guardarToken",data.tokenReturn);
                this.$router.push({name:'home'})
             
            }).catch(err=>{
               this.errorM=null;
               if (err.response.status==500) {
                   this.errorM=err.response.data.message
               }else if (err.response.status==404) {
                   this.errorM=err.response.data.message
               }else if (err.response.status==403) {
                   this.errorM=err.response.data.message
               }else{
                     this.errorM="Ocurrió un error en el servidor.";
               }

            })
    }
},
}
</script>