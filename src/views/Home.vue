<template>

     <div class="imagen">
         <v-flex xs12 sm12 xl12 l12>
            <v-container grid-list-md>
                <v-layout wrap>
                    <img v-bind:src="require('../assets/D.png')" alt="">
                </v-layout>
            </v-container> 
         </v-flex>
    </div>  
  


 
</template>
<style lang="stylus">
.imagen{
  display:block;
  margin-left: auto;
  margin-right: auto;
}
</style>
<script>

import axios from 'axios'
import Chart from 'chart.js'
export default{
  data(){return{
     
  }},
  methods:{
    
   
  },
  
  mounted() {
    
 
 }
}
</script>
