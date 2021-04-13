<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Carteras</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
            
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">
                            Activar Item
                        </v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">
                            Desactivar Item
                        </v-card-title>
                        <v-card-text>
                            Estás a punto de <span v-if="adAccion==1">activar </span>
                            <span v-if="adAccion==2">desactivar </span> el item {{adNombre}}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="activarDesactivarCerrar()" color="green darken-1" flat="flat">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion==1" @click="activar()" color="orange darken-4" flat="flat">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion==2" @click="desactivar()" color="orange darken-4" flat="flat">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
              <v-toolbar
                flat
                color="white"
                v-if="$store.state.usuario.rol == '5ff86c9fe04cdc30f4805fe2'" 
            >
                <v-flex xs12 sm3 md3 lg3 xl3>
                <v-autocomplete
                    v-on:change="listarXcongregacion()"
                    :items="congregaciones"
                    v-model="codigoCongregacion"
                    placeholder="Seleccione una congregacion"
                ></v-autocomplete>
                </v-flex>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="arry"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:items="props">
              
                 <td class="green--text">{{ props.item.nombre }}</td>
                <td>{{ props.item.descripcion }}</td>
                 <td class="blue--text">{{ props.item.total }}</td>
                <td>{{ props.item.codigoCongregacion.abreviatura }}</td>
                <td>
                    <div v-if="props.item.estado">
                        <span class="blue--text">Activo</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Inactivo</span>
                    </div>
                </td>                
                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return{
                codigoCongregacion:"",
                congregaciones:[],
                dialog: false,
                search:'',
                arry:[],
                headers: [
                   
                    { text: 'Nombre', value: 'nombre', sortable: false },
                    { text: 'Descripción', value: 'descripcion', sortable: false },
                    { text: 'Total', value: 'total', sortable: false },
                     { text: 'Congregacion', value: 'idCongregacion', sortable: false },
                    { text: 'Estado', value: 'estado', sortable: false },
                ],
               
                _id:'',
              
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:''
            }
        },
        computed: {
       
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.listar()
            this.ConsultarCongregacion()
        },
        methods: {
              ConsultarCongregacion() {
                let me = this;
                let arryRes = [];
                let header = { Token: this.$store.state.token };
                let configuracion = { headers: header };
                axios
                    .get("congregacion/list", configuracion)
                    .then(function (response) {
                    arryRes = response.data;
                    arryRes.map(function (x) {
                        me.congregaciones.push({ text: x.abreviatura, value: x._id });
                    });
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                },
            listarXcongregacion(){
                this.arry=[]
                let me = this
                    let header = { Token: this.$store.state.token };
                let configuracion = { headers: header };
                axios
                    .get("cartera/listxcode?codigoCongregacion="+this.codigoCongregacion, configuracion)
                    .then(function (response) {
                    me.arry = response.data;
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                },
            listar(){
                let me=this;
                let header={"Token":this.$store.state.token};
                let configuracion = {headers:header};
                 if(this.$store.state.usuario.rol!="5ff86c9fe04cdc30f4805fe2"){//si no es administrador
                    axios
                        .get("cartera/listxcode?codigoCongregacion="+this.$store.state.usuario.codigoCongregacion, configuracion)
                        .then(function (response) {
                        me.arry = response.data;
                        })
                        .catch(function (error) {
                        console.log(error);
                        });
                    }

            },
         
         
          
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.descripcion;
                this.adId=item._id;
                if (accion==1){
                    this.adAccion=1;
                } else if(accion==2){
                    this.adAccion=2;
                } else{
                    this.adModal=0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal=0;
            },
            activar(){
                let me=this;
                axios.put('cartera/activate',{'_id':this.adId})
                    .then(function(response){
                        me.adModal=0;
                        me.adAccion=0;
                        me.adNombre='';
                        me.adId='';
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            desactivar(){
                let me=this;
                axios.put('cartera/deactivate',{'_id':this.adId})
                    .then(function(response){
                        me.adModal=0;
                        me.adAccion=0;
                        me.adNombre='';
                        me.adId='';
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            close () {
                this.dialog = false;
            }
        }
    }
</script>
