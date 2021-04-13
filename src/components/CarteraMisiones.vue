<template>
<v-layout align-start>
    <v-flex>
      
        <span class="blue--text" style="font-size: 30px">Misiones</span>
        <v-flex xs12 sm12 md12>
          <v-autocomplete :items="congregaciones"
           v-if="$store.state.usuario.rol=='5ff86c9fe04cdc30f4805fe2'"
            v-model="codigoC" v-on:change="listarAdmin(),listarMisionesAdmin(),consultarDatosAdmin()" 
             label="Congregacion"></v-autocomplete>
        </v-flex>
         <v-container grid-list-md>
          <v-layout wrap>
            <v-flex  xs12 sm12 md12 lg6 xl6>
              <canvas id="grafico12meses"></canvas>
            </v-flex>
              <v-flex  xs12 sm12 md12 lg6 xl6>
              <canvas id="grafico12mesesM"></canvas>
            </v-flex>
              </v-layout>
        </v-container>
         <span v-if="bandera" class="green--text" style="font-size: 15px">Las graficas estan basadas en los valores recolectados tanto de Ofrendas Misioneras y Misiones.</span>
        <v-flex  xs12 sm12 md12 lg12 xl12>
          <span class="headline" style="font-size: 30px" >Total:</span> <span  style="font-size: 20px">${{this.total}}</span>
        </v-flex>
       


    </v-flex>
</v-layout>
</template>
<script>
    import axios from 'axios'
    import Swal from "sweetalert2";
    import Chart from 'chart.js'
    import moment from "moment"

export default {
  data () {
    return {
      bandera: false,
      codigoC: "",
      congregaciones: [],
      totales: [],
      meses: [],
      valores: [],
      totalesM: [],
      mesesM: [],
      valoresM: [],
      total: 0,
      arry: [],
    }
  },
  methods: {
    listarMisionesAdmin () { 
    this.limpiar()

    let me=this;
    let header={"Token":this.$store.state.token};
    let configuracion = {headers:header};

    if(this.$store.state.usuario.rol=="5ff86c9fe04cdc30f4805fe2"){//es administrador
        axios.get('misiones/grafico12meses',configuracion)
        .then(function (response){
            me.valoresM=response.data;
            me.graficarM(me.codigoC);
        }).catch(function(error){
            console.log(error);
        });
    }
    },
    listarMisiones () { 
    this.limpiar()
     let codeF = this.$store.state.usuario.codigoCongregacion;
    let me=this;
    let header={"Token":this.$store.state.token};
    let configuracion = {headers:header};

    if(this.$store.state.usuario.rol!="5ff86c9fe04cdc30f4805fe2"){//no es administrador
        axios.get('misiones/grafico12meses',configuracion)
        .then(function (response){
            me.valoresM=response.data;
            me.graficarM(codeF);
        }).catch(function(error){
            console.log(error);
        });
    }
    },
    ConsultarCongregacion(){
            let me = this;
            let arryRes = [];
            let header = { Token: this.$store.state.token };
            let configuracion = { headers: header };
            axios
                .get("congregacion/list", configuracion)
                .then(function(response) {
                arryRes = response.data;
                arryRes.map(function(x) {
                    me.congregaciones.push({ text: x.abreviatura, value: x._id });
                });
                })
                .catch(function(error) {
                console.log(error);
                });
    },
    listarAdmin(){
    this.limpiar()

    let me=this;
    let header={"Token":this.$store.state.token};
    let configuracion = {headers:header};

    if(this.$store.state.usuario.rol=="5ff86c9fe04cdc30f4805fe2"){//es administrador
        axios.get('ingresos/grafico12Meses',configuracion)
        .then(function (response){
            me.valores=response.data;
            me.graficar(me.codigoC);
        }).catch(function(error){
            console.log(error);
        });
    }

    },
    listar(){
    let codeF = this.$store.state.usuario.codigoCongregacion;
    let me=this;
    let header={"Token":this.$store.state.token};
    let configuracion = {headers:header};

    if(this.$store.state.usuario.rol!="5ff86c9fe04cdc30f4805fe2"){//no es administrador
      axios.get('ingresos/grafico12Meses',configuracion)
      .then(function (response){
          me.valores=response.data;
            me.graficar(codeF);
      }).catch(function(error){
          console.log(error);
      });
    }

    },
    graficar(code){
    this.bandera=true
    let me = this;
    let mesn='';

      me.valores.map(function (x){
        if(code==x._id.codigo){
              switch (parseInt(x._id.mes)) {
              case 1:
                mesn='Enero';
                break;
                case 2:
                mesn='Febrero';
                break;
                case 3:
                mesn='Marzo';
                break;
                case 4:
                mesn='Abril';
                break;
                case 5:
                mesn='Mayo';
                break;
                case 6:
                mesn='Junio';
                break;
                case 7:
                mesn='Julio';
                break;
                case 8:
                mesn='Agosto';
                break;
                case 9:
                mesn='Septiembre';
                break;
                case 10:
                mesn='Octubre';
                break;
                case 11:
                mesn='Noviembre';
                break;
                case 12:
                mesn='Diciembre';
                break;
                              
            
              default:
                mesn='Error';
            }
            me.meses.push(mesn+'/'+x._id.year)
            me.totales.push(x.total)
        }
        
      })
        var ctx = document.getElementById('grafico12meses');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: me.meses,
                datasets: [
                  {
                    label: 'Ofrendas misioneras.',
                    data: me.totales,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                  }
                  
                  ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },
    graficarM(code){

    let me = this;
    let mesn='';

      me.valoresM.map(function (x){
        if(code==x._id.codigo){
              switch (parseInt(x._id.mes)) {
              case 1:
                mesn='Enero';
                break;
                case 2:
                mesn='Febrero';
                break;
                case 3:
                mesn='Marzo';
                break;
                case 4:
                mesn='Abril';
                break;
                case 5:
                mesn='Mayo';
                break;
                case 6:
                mesn='Junio';
                break;
                case 7:
                mesn='Julio';
                break;
                case 8:
                mesn='Agosto';
                break;
                case 9:
                mesn='Septiembre';
                break;
                case 10:
                mesn='Octubre';
                break;
                case 11:
                mesn='Noviembre';
                break;
                case 12:
                mesn='Diciembre';
                break;
                              
            
              default:
                mesn='Error';
            }
            me.mesesM.push(mesn+'/'+x._id.year)
            me.totalesM.push(x.total)
        }
        
      })
        var ctx = document.getElementById('grafico12mesesM');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: me.mesesM,
                datasets: [
                  {
                    label: 'Misiones.',
                    data: me.totalesM,
                    backgroundColor: [
                        'rgba(150, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 80, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                  }
                  
                  ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },
    consultarDatosAdmin () { 
    this.limpiar()
    let nombre = "MISIONES"
    let me = this;
    let header = { Token: this.$store.state.token };
    let configuracion = { headers: header };
    if(this.$store.state.usuario.rol=="5ff86c9fe04cdc30f4805fe2"){//si  es administrador
    axios
      .get("cartera/listxcongregacion?codigoCongregacion="+me.codigoC+"&nombre="+nombre, configuracion)
      .then(function (response) {
        me.arry = response.data;
        me.arry.forEach(element => {
            me.total = element.total
        });
        
      })
      .catch(function (error) {
        console.log(error);
      });
    }
      
    },
    consultarDatos () { 
    let nombre = "MISIONES"
    let me = this;
    let header = { Token: this.$store.state.token };
    let configuracion = { headers: header };
    if(this.$store.state.usuario.rol!="5ff86c9fe04cdc30f4805fe2"){//si no es administrador
    axios
      .get("cartera/listxcongregacion?codigoCongregacion="+this.$store.state.usuario.codigoCongregacion+"&nombre="+nombre, configuracion)
      .then(function (response) {
        me.arry = response.data;
        me.arry.forEach(element => {
          console.log(element);
            me.total = element.total
        });
        
      })
      .catch(function (error) {
        console.log(error);
      });
    }
      
    },
    limpiar(){
    this.arry=[]
    this.valores=[]
    this.meses=[]
    this.totales=[]
    this.valoresM=[]
    this.mesesM=[]
    this.totalesM=[]
    }
    },
    created () {
    this.ConsultarCongregacion()
    this.listar()
    this.listarMisiones()
    this.consultarDatos()
    },
    
}
</script>