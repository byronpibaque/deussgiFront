<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Congregacion</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-autocomplete :items="tipoC" v-model="tipocongregacion" label="Tipo congregacion"></v-autocomplete>
                                </v-flex>
                                  <v-flex xs12 sm12 md12 v-if="tipocongregacion=='HIJA'">
                                    <v-autocomplete :items="congregaciones" v-model="codigoCongregacion" label="Congregacion madre:"></v-autocomplete>
                                </v-flex>
                                 <v-flex xs12 sm12 md12>
                                    <v-autocomplete :items="miembros" v-model="codigoMiembro" label="Obrero"></v-autocomplete>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="abreviatura" label="Abreviatura"></v-text-field>
                                </v-flex>
                                  <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="direccion" label="Sector/Dirección"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                  <v-text-field v-model="parroquia" label="Parroquia"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="provincia" label="Provincia"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="ciudad" label="Ciudad/Cantón"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">

                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>            
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
            <v-data-table
                :headers="headers"
                :items="arry"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:items="props">
                <td class="justify-center layout px-0">
                    <v-icon
                    small
                    class="mr-2"
                    @click="editItem(props.item)"
                    >
                    edit
                    </v-icon>
                    <template v-if="props.item.estado">
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(2,props.item)"
                        >
                        block
                        </v-icon>
                    </template>
                    <template v-else>
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(1,props.item)"
                        >
                        check
                        </v-icon>
                    </template>
                </td>   
                        <td class="blue--text" v-if="props.item.codigoMadre">{{ props.item.codigoMadre.abreviatura }}</td>
                        <td class="green--text" v-else>IGLESIA MADRE</td>
                        <td>{{ props.item.codigoMiembro.nombres }}</td>
                        <td>{{ props.item.descripcion }}</td>
                        <td>{{ props.item.abreviatura }}</td>
                        <td>{{ props.item.direccion }}</td>
                        <td>{{ props.item.provincia }}</td>
                        <td v-if="props.item.parroquia">{{ props.item.parroquia }}</td>
                        <td v-else class="red--text">NO HAY</td>
                        <td>{{ props.item.ciudad }}</td>
                     
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
                parroquia:"",
                congregaciones:[],
                codigoCongregacion:"",
                tipoC:["MADRE","HIJA"],
                tipocongregacion:"",
                dialog: false,
                search:'',
                arry:[],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Dependencia', value: 'codigoMadre', sortable: true },
                    { text: 'Obrero', value: 'codigoMiembro', sortable: true },
                    { text: 'Descripción', value: 'descripcion', sortable: false },
                    { text: 'Abreviatura', value: 'abreviatura', sortable: true },
                    { text: 'Dirección', value: 'direccion', sortable: false },
                    { text: 'Provincia', value: 'provincia', sortable: true },
                  { text: 'Parroquia', value: 'parroquia', sortable: true },
                    { text: 'Ciudad', value: 'ciudad', sortable: true },
                    { text: 'Estado', value: 'estado', sortable: true },
                ],
                editedIndex: -1,
                _id:'',
                abreviatura:'',
                descripcion:'',
                miembros:[],
                codigoMiembro:'',
                direccion:'',
                ciudad:'',
                provincia:'',
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:''
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.listar();
            this.ConsultarMembresia();
            this.ConsultarCongregacionM()
        },
        methods: {
              ConsultarCongregacionM() {
                let me = this;
                let arryRes = [];
                let header = { Token: this.$store.state.token };
                let configuracion = { headers: header };
                axios
                    .get("congregacion/listmadre", configuracion)
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
            ConsultarMembresia(){
                let me = this;
                let arryRes = [];
                let header = { Token: this.$store.state.token };
                let configuracion = { headers: header };
                axios
                    .get("membresia/list", configuracion)
                    .then(function(response) {
                    arryRes = response.data;
                    arryRes.map(function(x) {
                        me.miembros.push({ text: x.nombres, value: x._id });
                    });
                    })
                    .catch(function(error) {
                    console.log(error);
                    });
            },
            listar(){
                let me=this;
                let header={"Token":this.$store.state.token};
                let configuracion = {headers:header};
                axios.get('congregacion/list',configuracion).then(function (response){
                    me.arry=response.data;
                }).catch(function(error){
                    console.log(error);
                });

            },
            limpiar(){
                this._id='';
                this.codigoMiembro=""
                this.codigoCongregacion=""
                this.tipocongregacion=""
                // this.miembros=[]
                this.abreviatura='';
                this.descripcion='';
                this.ciudad=""
                this.provincia=""
                this.direccion=""
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(!this.abreviatura){
                    this.validaMensaje.push('Elija un obrero.');
                }
                if(this.descripcion.length>100){
                    this.validaMensaje.push('La descripción  no debe tener más de 255 caracteres.');
                }
                if(this.abreviatura.length>25){
                    this.validaMensaje.push('La descripción  no debe tener más de 10 caracteres.');
                }
                if(this.ciudad.length>100){
                    this.validaMensaje.push('La descripción  no debe tener más de 255 caracteres.');
                }
                if(this.provincia.length>100){
                    this.validaMensaje.push('La descripción  no debe tener más de 255 caracteres.');
                }
                if(this.direccion.length>100){
                    this.validaMensaje.push('La descripción  no debe tener más de 255 caracteres.');
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            guardar(){
                let me=this;
                if (this.validar()){
                    return;
                }
                let anonimo=""
                if(this.tipocongregacion=="MADRE"){
                    anonimo=null
                }else{
                    anonimo=this.codigoCongregacion
                }
                if (this.editedIndex >-1){
                    //Código para editar
                    axios.put('congregacion/update',
                    {'_id':this._id,
                    'tipocongregacion':this.tipocongregacion,
                    'codigoMiembro':this.codigoMiembro,
                    'codigoMadre':anonimo,
                    'descripcion':this.descripcion,
                    'abreviatura':this.abreviatura,
                    'direccion':this.direccion,
                      'parroquia':this.parroquia,
                    'ciudad':this.ciudad,
                    'provincia':this.provincia
                    })
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }else{
                    //Código para guardar
                    axios.post('congregacion/add',
                    {'codigoMiembro':this.codigoMiembro,
                    'tipocongregacion':this.tipocongregacion,
                    'codigoMadre':anonimo,
                    'descripcion':this.descripcion,
                    'abreviatura':this.abreviatura,
                    'direccion':this.direccion,
                    'parroquia':this.parroquia,
                    'ciudad':this.ciudad,
                    'provincia':this.provincia})
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }
            },
            editItem (item) {
            
                this._id=item._id;
                this.tipocongregacion=item.tipocongregacion;
                if(item.codigoMadre){
                      this.codigoCongregacion=item.codigoMadre._id
                }
              
                this.descripcion=item.descripcion;
                this.abreviatura=item.abreviatura;
                this.codigoMiembro=item.codigoMiembro._id;
                this.direccion=item.direccion
                this.ciudad=item.ciudad
              this.parroquia=item.parroquia
                this.provincia=item.provincia
                this.dialog = true;
                this.editedIndex=1;
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
                axios.put('congregacion/activate',{'_id':this.adId})
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
                axios.put('congregacion/deactivate',{'_id':this.adId})
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
                this.limpiar()
            }
        }
    }
</script>
