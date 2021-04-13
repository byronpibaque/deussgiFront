<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white" v-if="verNuevo == 0">
        <v-toolbar-title>Egresos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          v-if="verNuevo == 0"
          @click="mostrarNuevo(),consultarCartera()"
          dark
          class="mb-2"
          >Nuevo</v-btn
        >
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1">
              Activar Item
            </v-card-title>
            <v-card-title class="headline" v-if="adAccion == 2">
              Desactivar Item
            </v-card-title>
            <v-card-text>
              Estás a punto de <span v-if="adAccion == 1">activar </span>
              <span v-if="adAccion == 2">desactivar </span> el item
              {{ adNombre }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="activarDesactivarCerrar()"
                color="green darken-1"
                flat="flat"
              >
                Cancelar
              </v-btn>
              <v-btn
                v-if="adAccion == 1"
                @click="activar()"
                color="orange darken-4"
                flat="flat"
              >
                Activar
              </v-btn>
              <v-btn
                v-if="adAccion == 2"
                @click="desactivar()"
                color="orange darken-4"
                flat="flat"
              >
                Desactivar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <v-toolbar
        flat
        color="white"
        v-if="$store.state.usuario.rol == '5ff86c9fe04cdc30f4805fe2' && verNuevo==0" 
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
        v-if="verNuevo == 0"
      >
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="verIngreso(props.item)"
              >tab</v-icon
            >
            <template v-if="props.item.estado">
              <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                block
              </v-icon>
            </template>
            <template v-else>
              <v-icon small @click="activarDesactivarMostrar(1, props.item)">
                check
              </v-icon>
            </template>
          </td>

          <td>{{ props.item.numeroRegistro }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td >{{ formatearFecha(props.item.createdAt) }}</td>
   
          <td>${{ props.item.valor }}</td>
            <td v-if="props.item.codigoMembresia!=null">{{ props.item.codigoMembresia.nombres }}</td>
          <td v-else>Anónimo</td>
         
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
    
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <span class="blue--text" style="font-size: 30px">Registre nuevo egreso:</span>
        <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
          <span style="font-size: 30px" class="green--text" >Cartera: ${{cartera}}</span>
          </v-flex>
          <v-flex  xs12 sm12 md12 lg12 xl12>
            <v-checkbox
              v-model="flat"
              label="A algun hermano?"
            ></v-checkbox>
          </v-flex>
          <v-flex xs12 sm3 md3 lg3 xl3>
            <v-text-field
              v-model="numeroRegistro"
              label="Numero de registro"
            ></v-text-field>
          </v-flex>
           <v-flex xs12 sm5 md5 lg5 xl5 v-if="flat">
          <v-autocomplete
            :items="miembros"
            v-model="codigoMembresia"
            placeholder="Seleccione miembro"
          ></v-autocomplete>
        </v-flex>
         
           <v-flex xs12 sm8 md8 lg8 xl8>
            <v-text-field
              v-model="descripcion"
              label="Descripcion"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field
              v-model="valor"
              prefix="$"
              label="Monto a egresar"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div
              class="red--text"
              v-for="v in validaMensaje"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="cerrarNuevo()"
              >Cancelar</v-btn
            >
            <v-btn
              color="success"
              v-if="verDetalle == 0"
              @click.native="guardar()"
              >Guardar</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
import moment, { now } from "moment";
export default {
  data() {
    return {
      flat: false,
      cartera: 0.0,
      descripcion: "",
      numeroRegistro:"",
      
      congregaciones: [],
      codigoCongregacion: "",
     
      miembros: [],
      codigoMembresia: "",
      valor:0.0,
     
      verDetalle: 0,
      verNuevo: 0,
      dialog: false,
      search: "",
      arry: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Numero de boleta", value: "numeroRegistro", sortable: true },
        { text: "Descripcion", value: "descripcion", sortable: false },
           { text: "Fecha", value: "createdAt", sortable: true },
        { text: "Valor", value: "valor", sortable: false },
         { text: "Miembro?", value: "codigoMembresia", sortable: false },
       // { text: "Usuario", value: "codigoUsuario", sortable: false },
        { text: "Congregacion", value: "codigoCongregacion", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      editedIndex: -1,
      _id: "",

      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.ConsultarMembresia()
    this.listar();
    this.ConsultarCongregacion();
   
  },
  methods: { 
     formatearFecha(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY hh:mm");
      }
    },
    consultarCartera(){
     let codeF = this.$store.state.usuario.codigoCongregacion;
     let datos1=[]
    let datos2=[]
    let totalD=0.0
    let totalI=0.0
    let nombre = "INGRESOS"
     let nombre2= "DIEZMOS"
    let me = this;
    let header = { Token: this.$store.state.token };
    let configuracion = { headers: header };
    if(this.$store.state.usuario.rol!="5ff86c9fe04cdc30f4805fe2"){//si no es administrador
    axios
      .get("cartera/listxcongregacion?codigoCongregacion="+codeF+"&nombre="+nombre, configuracion)
      .then(function (response) {
       datos1 = response.data;
       datos1.forEach(element => {
           totalI = element.total
            me.cartera=parseFloat(me.cartera)+parseFloat(totalI)
        });
        
      })
      .catch(function (error) {
        console.log(error);
      });


       axios
      .get("cartera/listxcongregacion?codigoCongregacion="+codeF+"&nombre="+nombre2, configuracion)
      .then(function (response) {
       datos2 = response.data;
       datos2.forEach(element => {
            totalD = element.total
              me.cartera=parseFloat(me.cartera)+parseFloat(totalD)
        });
        
      })
      .catch(function (error) {
        console.log(error);
      });
    
    
    }
    },
    ConsultarMembresia() {
      let me = this;
      let arryRes = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("membresia/listxcongregacion?codigoCongregacion="+this.$store.state.usuario.codigoCongregacion, configuracion)
        .then(function (response) {
          arryRes = response.data;
          arryRes.map(function (x) {
            me.miembros.push({ text: x.nombres, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
      verIngreso(item) {
      this.limpiar();

      this.fecha = item.fecha;
      this.numeroRegistro = item.numeroRegistro;
      this.valor = item.valor;
      this.descripcion = item.descripcion;
     
      
      this.verNuevo = 1;
      this.verDetalle = 1;
    },   
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
        .get("egresos/listxcongregacion?codigoCongregacion="+this.codigoCongregacion, configuracion)
        .then(function (response) {
          
          me.arry = response.data;

        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if(this.$store.state.usuario.rol!="5ff86c9fe04cdc30f4805fe2"){//si no es administrador
    axios
        .get("egresos/listxcongregacion?codigoCongregacion="+this.$store.state.usuario.codigoCongregacion, configuracion)
        .then(function (response) {
          me.arry = response.data;
                 
        })
        .catch(function (error) {
          console.log(error);
        });
      }
        
     
    },
   
    limpiar() {
      this._id = "";
    this.cartera=0
      this.numeroRegistro = "";
      this.valor = "";
      this.descripcion="";  

      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.numeroRegistro.length > 13) {
        this.validaMensaje.push(
          "EL numero de registro no debe ser mayor a 13 digitos.."
        );
      }
      if (parseFloat(this.valor)>parseFloat(this.cartera)) {
        this.validaMensaje.push(
          "El valor a egresar, es mayor que la cartera."
        );
      }
    
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    guardar() {
      let me = this;
      if (this.validar()) {
        return;
      }
      let anonimo=""
      if(!this.codigoMembresia){
        anonimo=null
      }else{
        anonimo=this.codigoMembresia
      }

      //Código para guardar
      axios
        .post("egresos/add", {
          numeroRegistro: this.numeroRegistro,
          descripcion:this.descripcion,
          valor: parseFloat(this.valor),
          codigoCongregacion: this.$store.state.usuario.codigoCongregacion,
          codigoMembresia:anonimo,
          codigoUsuario: this.$store.state.usuario._id,
        })
        .then(function (response) {
          me.limpiar();
          me.cerrarNuevo();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    editItem(item) {
      this._id = item._id;

      this.descripcion = item.descripcion;
      this.valor = item.valor;
      this.fecha=item.fecha
      this.numeroRegistro=item.numeroRegistro
      this.codigoCongregacion=item.ConsultarCongregacion._id
      this.dialog = true;
      this.editedIndex = 1;
    },
    activarDesactivarMostrar(accion, item) {
  
      this.adModal = 1;
      this.adNombre = item.descripcion;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    activar() {
      let me = this;
    
      axios
        .put("egresos/activate", { _id: this.adId })
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    desactivar() {
     
      let me = this;
      axios
        .put("egresos/deactivate", { _id: this.adId })
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
    },
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    cerrarNuevo() {
      this.limpiar();
      this.verNuevo = 0;
    },
    abrirModalMiembros() {
      this.modalMiembros = 1;
    },
    cerrarModalMiembros() {
      this.modalMiembros = 0;
    },
  },
};
</script>
