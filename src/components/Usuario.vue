<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Usuarios</v-toolbar-title>
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
                                    <v-autocomplete :items="congregaciones" v-model="codigoCongregacion" label="Congregacion"></v-autocomplete>
                                </v-flex>
                                 <v-flex xs12 sm12 md12>
                                    <v-autocomplete :items="roles" v-model="codigoRol" label="Cargo"></v-autocomplete>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-autocomplete :items="Sex" v-model="sexo" label="Sexo"></v-autocomplete>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="nombres" label="Nombres"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="cedula" label="Cedula"></v-text-field>
                                </v-flex>
                                  <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="direccion" label="Direccion"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="correo" label="Correo"></v-text-field>
                                </v-flex>
                                  <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="usuario" label="Usuario"></v-text-field>
                                </v-flex>
                                  <v-flex xs12 sm12 md12>
                                    <v-text-field
                                        v-model="clave"
                                        color="cyan darken"
                                        label="Clave"
                                        placeholder="Ingrese la clave"
                                        loading
                                    >
                                        <template v-slot:progress>
                                        <v-progress-linear
                                            :value="progress"
                                            :color="color"
                                            absolute
                                            height="7"
                                        ></v-progress-linear>
                                       </template>
                                    </v-text-field>     
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
                      <v-icon
                    small
                    class="mr-2"
                    @click="eliminarItem(props.item)"
                    >
                    delete
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
                        <td v-if="props.item.codigoCongregacion">{{ props.item.codigoCongregacion.abreviatura}}</td>
                        <td v-else><span class="red--text">Indefinida</span></td>
                        <td class="green--text">{{ props.item.codigoRol.descripcion}}</td>
                        <td>{{ props.item.nombres }}</td>
                        <td>{{ props.item.cedula }}</td>
                        <td>{{ props.item.direccion }}</td>
                        <td>{{ props.item.telefono }}</td>
                        <td>{{ props.item.correo }}</td>
                        <td class="blue--text">{{ props.item.usuario }}</td>
                        <td class="blue--text">{{ props.item.clave }}</td>
                        <td>{{ props.item.sexo }}</td>
                     
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
    import axios from 'axios';
    import Swal from 'sweetalert2';
    export default {
        data(){
            return{
                dialog: false,
                search:'',
                arry:[],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Congregacion', value: 'codigoCongregacion', sortable: false },
                    { text: 'Rol', value: 'codigoRol', sortable: false },
                    { text: 'Nombres', value: 'nombres', sortable: true },
                    { text: 'Cédula', value: 'cedula', sortable: false },
                    { text: 'Dirección', value: 'direccion', sortable: false },
                    { text: 'Teléfono', value: 'telefono', sortable: false },
                    { text: 'Correo', value: 'correo', sortable: true },
                    { text: 'Usuario', value: 'usuario', sortable: false },
                    { text: 'Contraseña', value: 'clave', sortable: false },
                    { text: 'Sexo', value: 'sexo', sortable: true },
                    { text: 'Estado', value: 'estado', sortable: true },
                ],
                editedIndex: -1,
                _id:'',
                abreviatura:'',
                nombres:'',
                cedula:'',
                roles:[],
                Sex:["HOMBRE","MUJER"],
                sexo:"",
                codigoRol:'',
                congregaciones:[],
                codigoCongregacion:"",
                direccion:'',
                telefono:'',
                correo:'',
                usuario:'',
                clave:'',
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
            },
            progress () {
            return Math.min(100, this.clave.length * 10)
            },
            color () {
            return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
            },
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.listar();
            this.ConsultarCargos();
            this.ConsultarCongregacion();
        },
        methods: {
            eliminarItem(item){
                let me = this;
                Swal.fire({
                title: 'Seguro quieres eliminar este registro?',
                text: "No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!'
                }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .delete("usuario/remove?_id="+item._id)
                        .then(function(response) {
                            if(response.status==200){
                                    Swal.fire(
                                        'Eliminado!',
                                        'El registro fue eliminado.',
                                        'success'
                                        )
                                   
                                        me.listar()
                            }else{
                                 Swal.fire(
                                        'Ocurrio un problema!',
                                        'Hubo un problema en el servidor.',
                                        'error'
                                        )
                                        console.log(response);

                            }
                            
                        })
                        .catch(function(error) {
                        console.log(error);
                        });
                    

                }
                })
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
            ConsultarCargos(){
                let me = this;
                let arryRes = [];
                let header = { Token: this.$store.state.token };
                let configuracion = { headers: header };
                axios
                    .get("rol/list", configuracion)
                    .then(function(response) {
                    arryRes = response.data;
                    arryRes.map(function(x) {
                        me.roles.push({ text: x.descripcion, value: x._id });
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
                axios.get('usuario/list',configuracion).then(function (response){
                    me.arry=response.data;
                }).catch(function(error){
                    console.log(error);
                });

            },
            limpiar(){
                this._id='';
                this.codigoRol=""
                this.codigoCongregacion=""
                // this.miembros=[]
                this.abreviatura='';
                this.cedula=""
                this.nombres='';
                this.direccion=""
                this.telefono=""
                this.correo=""
                this.usuario=''
                this.clave=''
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
               
                 if(!this.codigoRol){
                    this.validaMensaje.push('Seleccine un rol.');
                }
                if(!this.codigoCongregacion){
                    this.validaMensaje.push('Seleccine una congregacion.');
                }
                 if(!this.sexo){
                    this.validaMensaje.push('Seleccine un tipo de sexo.');
                }   
                if(this.nombres.length>100){
                    this.validaMensaje.push('El nombre no puede contener mas de 100 caracteres.');
                }
                if(this.cedula.length>10){
                    this.validaMensaje.push('La cedula  no debe tener más de 10 caracteres.');
                }
                if(this.direccion.length>100){
                    this.validaMensaje.push('La direccion no puede contener mas de 100 caracteres.');
                }
                if(this.telefono.length>10){
                    this.validaMensaje.push('El telefono no debe tener más de 10 caracteres.');
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
                if (this.editedIndex >-1){
                    //Código para editar
                    axios.put('usuario/update',
                    {'_id':this._id,
                    'codigoRol':this.codigoRol,
                    'codigoCongregacion':this.codigoCongregacion,
                    'nombres':this.nombres,
                    'cedula':this.cedula,
                    'telefono':this.telefono,
                    'direccion':this.direccion,
                    'sexo':this.sexo,
                    'correo':this.correo,
                    'usuario':this.usuario,
                    'clave':this.clave
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
                    axios.post('usuario/add',
                    {'codigoRol':this.codigoRol,
                    'codigoCongregacion':this.codigoCongregacion,
                    'nombres':this.nombres,
                    'cedula':this.cedula,
                    'telefono':this.telefono,
                    'direccion':this.direccion,
                    'sexo':this.sexo,
                    'correo':this.correo,
                    'usuario':this.usuario,
                    'clave':this.clave})
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
               
                this.nombres=item.nombres;
                this.cedula=item.cedula;
                this.codigoRol=item.codigoRol._id;
                this.codigoCongregacion=item.codigoCongregacion._id;
                this.direccion=item.direccion
                this.sexo=item.sexo
                this.correo=item.correo
                this.telefono=item.telefono
                this.usuario=item.usuario
                this.clave=item.clave

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
                axios.put('usuario/activate',{'_id':this.adId})
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
                axios.put('usuario/deactivate',{'_id':this.adId})
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
