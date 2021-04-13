<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white" v-if="verNuevo == 0">
        <v-toolbar-title>Consultas y Reportes </v-toolbar-title>
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
        v-if="verNuevo==0" 
      >
        <v-flex xs12 sm3 md3 lg3 xl3  v-if="$store.state.usuario.rol == '5ff86c9fe04cdc30f4805fe2'">
          <v-autocomplete
            v-on:change="listarXcongregacion()"
            :items="congregaciones"
            v-model="codigoCongregacion"
            placeholder="Seleccione una congregacion"
          ></v-autocomplete>
        </v-flex>
        <v-flex xs12 sm3 md3 lg3 xl3 >
         <v-btn @click="mostarfiltro()" >Filtrar</v-btn>
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
          
          </td>

          <td>{{ props.item.numeroRegistro }}</td>
          <td v-if="props.item.fecha">{{ props.item.fecha }}</td>
          <td v-else>Sin fecha</td>
          <td>{{ props.item.codigoUsuario.nombres }}</td>
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
      <v-dialog v-model="modalMiembros" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Registrar nuevo miembro</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-autocomplete
                    :items="congregacionesM"
                    v-model="codigoCongregacionM"
                    label="Congregacion"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-autocomplete
                    :items="cargos"
                    v-model="codigoCargo"
                    label="Cargo"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-autocomplete
                    :items="Sex"
                    v-model="sexo"
                    label="Sexo"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    v-model="nombres"
                    label="Nombres"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="cedula" label="Cedula"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    v-model="direccion"
                    label="Direccion"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    v-model="telefono"
                    label="Telefono"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="correo" label="Correo"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="cerrarModalMiembros"
              >Cancelar</v-btn
            >
            <v-btn color="blue darken-1" flat @click="guardarMiembros"
              >Guardar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="filtro" max-width="500px">
      <v-card>
        <v-card-title>
         <span class="headline blue--text">Filtrar por fechas:</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-dialog
                      ref="dialog2"
                      v-model="modalc1"
                      :return-value.sync="finicio"
                      persistent
                      width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="finicio"
                          label="Fecha de inicio"
                          prepend-icon="event"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="finicio" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modalc1 = false">Cancelar</v-btn>
                      <v-btn
                          text
                          color="success"
                          @click="$refs.dialog2.save(finicio)"
                      >Aceptar</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-dialog
                      ref="dialog3"
                      v-model="modalc2"
                      :return-value.sync="ffin"
                      persistent
                      width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="ffin"
                          label="Fecha de fin"
                          prepend-icon="event"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="ffin" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modalc2 = false">Cancelar</v-btn>
                      <v-btn
                          text
                          color="success"
                          @click="$refs.dialog3.save(ffin)"
                      >Aceptar</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-flex xs12 sm12 md12 v-show="valida">
                  <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                </v-flex>
              </v-layout>
            </v-container>

          </v-card-text>
         <v-card-actions>
            <v-btn color="primary" @click="filtrarporfecha()">Buscar</v-btn>
            <v-btn color="secundary" @click="ocultarfiltro()">Cancelar</v-btn>
          </v-card-actions>
      </v-card>
      </v-dialog>
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <span class="blue--text" style="font-size: 30px">Ingresos Diarios</span>
        <v-layout row wrap>
          <v-flex xs12 sm3 md3 lg3 xl3>
            <v-text-field
              v-model="numeroRegistro"
              label="Numero de registro"
            ></v-text-field>
          </v-flex>
          <!-- Calendario -->
          <v-flex xs12 sm3 md3 lg3 xl3>
            <v-dialog
              ref="dialog"
              v-model="modalCalendario"
              :return-value.sync="fecha"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fecha"
                  label="Fecha de registro"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fecha" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalCalendario = false"
                  >Cancelar</v-btn
                >
                <v-btn text color="success" @click="$refs.dialog.save(fecha)"
                  >Aceptar</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <span class="blue--text" style="font-size: 25px">-Ofrendas</span>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field
              v-model="ofrenda"
              prefix="$"
              label="Total Ofrendas"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field
              v-model="ofrendaEspecial"
              prefix="$"
              label="Total Ofrendas especiales"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field
              v-model="ofrendaMisionera"
              prefix="$"
              label="Total Ofrendas Misionera"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field
              v-model="ofrendaPrimicia"
              prefix="$"
              label="Total Ofrendas Primicia"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-text-field
              v-model="otrasOfrendas"
              prefix="$"
              label="Total otras Ofrendas"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <span class="blue--text" style="font-size: 25px">-Diezmos</span>
          </v-flex>

          <v-flex xs12 sm6 md6 lg6 xl6 v-if="verDetalle==0">
            <v-autocomplete
              :items="miembros"
              v-model="codigoMiembro"
              label="Miembro"
              v-on:change="buscarDetalle()"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm1 md1 lg1 xl1 v-if="verDetalle==0">
            <v-btn small fab dark color="primary" @click="abrirModalMiembros">
              <v-icon dark>edit</v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="cabeceraDetalles"
                :items="detalles"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>
                    <v-icon
                      small
                      class="mr-2"
                      @click="eliminarDetalle(detalles, props.item)"
                      >delete</v-icon
                    >
                  </td>
                  <td class="text-xs-center blue--text">
                    {{ props.item.nombres }}
                  </td>
                  <td class="text-xs-center">
                    <v-text-field
                      v-model="props.item.valor"
                      type="number"
                    ></v-text-field>
                  </td>
                </template>
                <template slot="no-data">
                  <h3>No hay artículos agregados al detalle.</h3>
                </template>
              </v-data-table>

              <v-flex class="text-xs-right">
                <strong>Total de diezmos:</strong>
                $ {{ (totalDiezmo = calcularTotal) }}
              </v-flex>
            </template>
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
      finicio:"",
      ffin:"",
      modalc1:false,
      modalc2:false,
      filtro:0,
      nombres: "",
      cedula: "",
      cargos: [],
      Sex: ["HOMBRE", "MUJER"],
      sexo: "",
      codigoCargo: "",
      congregacionesM: [],
      codigoCongregacionM: "",
      congregaciones: [],
      codigoCongregacion: "",
      direccion: "",
      telefono: "",
      correo: "",
      modalMiembros: 0,
      totalDiezmo: 0.0,
      diezmo: 0.0,
      miembros: [],
      codigoMiembro: "",
      ofrenda: 0.0,
      ofrendaMisionera: 0.0,
      ofrendaEspecial: 0.0,
      ofrendaPrimicia: 0.0,
      otrasOfrendas: 0.0,
      numeroRegistro: "",

      modalCalendario: false,
      fecha: "",
      cabeceraDetalles: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Miembro", value: "nombres", sortable: false },
        { text: "Diezmo", value: "diezmo", sortable: false },
      ],
      detalles: [],
      verDetalle: 0,
      verNuevo: 0,
      dialog: false,
      search: "",
      arry: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Numero de boleta", value: "numeroRegistro", sortable: false },
        { text: "Fecha de registro", value: "fecha", sortable: false },
        { text: "Usuario", value: "codigoUsuario", sortable: false },
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
  computed: {
    calcularTotal: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado = parseFloat(resultado) + parseFloat(this.detalles[i].valor);
      }
      return resultado;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
   
    this.ConsultarCongregacion();
    this.ConsultarMembresia();
    this.ConsultarCongregacionM();
    this.ConsultarCargos();
  },
  methods: {
    filtrarporfecha(){
      this.arry = []
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      
      var fechainicial = moment(this.finicio+' 07:00:00');
      var fechafinal = moment(this.ffin+'  23:59:59');
      let fi = new Date(fechainicial)
      let ff = new Date(fechafinal)
    //  console.log(fi.toISOString());
    //   console.log(ff.toISOString());
     axios
        .get("ingresos/listxfechas?codigoCongregacion="+this.$store.state.usuario.codigoCongregacion+
           "&start=" +
            fi.toISOString() +
            "&end=" +
            ff.toISOString()
            , configuracion)
        .then(function (response) {
          me.arry = response.data;
         
        })
        .catch(function (error) {
          console.log(error);
        });
              this.ocultarfiltro()
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("ingresos/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.diezmos;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verIngreso(item) {
      this.limpiar();

      this.fecha = item.fecha;
      this.numeroRegistro = item.numeroRegistro;
      this.ofrendaEspecial = item.ofrendaEspecial;
      this.ofrenda = item.ofrenda;
      this.ofrendaMisionera = item.ofrendaMisionera;
      this.ofrendaPrimicia = item.ofrendaPrimicias;
      this.otrasOfrendas = item.otrasofrendas;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetalle = 1;
     
    },
    guardarMiembros() {
      let me = this;
      //Código para guardar
      axios
        .post("membresia/add", {
          codigoCargo: this.codigoCargo,
          codigoCongregacion: this.codigoCongregacionM,
          nombres: this.nombres,
          cedula: this.cedula,
          telefono: this.telefono,
          direccion: this.direccion,
          sexo: this.sexo,
          correo: this.correo,
        })
        .then(function (response) {
          me.limpiarM();
          me.cerrarModalMiembros();
          me.ConsultarMembresia();
        })
        .catch(function (error) {
          console.log(error);
        });
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
    ConsultarCongregacionM() {
      let me = this;
      let arryRes = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("congregacion/list", configuracion)
        .then(function (response) {
          arryRes = response.data;
          arryRes.map(function (x) {
            me.congregacionesM.push({ text: x.abreviatura, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    ConsultarCargos() {
      let me = this;
      let arryRes = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("cargo/list", configuracion)
        .then(function (response) {
          arryRes = response.data;
          arryRes.map(function (x) {
            me.cargos.push({ text: x.descripcion, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    encuentra(id) {
      let sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i].codigoMiembro == id) {
          sw = true;
        }
      }
      return sw;
    },
    eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },
    agregarDetalle(data) {
      if (this.encuentra(data._id) == true) {
        Swal.fire(
          "Ya existe!",
          "El miembro seleccionado ya existe en el detalle.",
          "error"
        );
      } else {
        this.detalles.push({
          codigoMiembro: data._id,
          nombres: data.nombres,
          valor: 0,
        });
        this.codigoBarras = "";
      }
    },
    buscarDetalle() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("membresia/query?_id=" + me.codigoMiembro, configuracion)
        .then(function (response) {
          me.agregarDetalle(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
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
    // ConsultarCongregacion(){
    //           let me = this;
    //           let arryRes = [];
    //           let header = { Token: this.$store.state.token };
    //           let configuracion = { headers: header };
    //           if(me.$store.state.usuario.rol=="5ff86c9fe04cdc30f4805fe2"){ //si es administrador
    //               axios
    //               .get("congregacion/list", configuracion)
    //               .then(function(response) {
    //               arryRes = response.data;
    //               arryRes.map(function(x) {
    //                   me.congregaciones.push({ text: x.abreviatura, value: x._id });
    //               });
    //               })
    //               .catch(function(error) {
    //               console.log(error);
    //               });
    //           }else{
    //                axios
    //               .get("congregacion/query?_id="+me.$store.state.usuario.codigoCongregacion, configuracion)
    //               .then(function(response) {
    //               arryRes = response.data;

    //                   me.congregaciones.push({ text: arryRes.abreviatura, value: arryRes._id });
    //                   me.codigoCongregacion=arryRes._id

    //               })
    //               .catch(function(error) {
    //               console.log(error);
    //               });
    //           }

    //       },
    listarXcongregacion(){
      this.arry=[]
      let me = this
        let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
       axios
        .get("ingresos/listxcongregacion?codigoCongregacion="+this.codigoCongregacion, configuracion)
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
        .get("ingresos/listxcongregacion?codigoCongregacion="+this.$store.state.usuario.codigoCongregacion, configuracion)
        .then(function (response) {
          me.arry = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      }
        
     
    },
    limpiarM() {
      this._id = "";
      this.codigoCargo = "";

      // this.miembros=[]

      this.cedula = "";
      this.nombres = "";
      this.direccion = "";
      this.telefono = "";
      this.correo = "";
    },
    limpiar() {
      this._id = "";
      this.detalles=[]
      this.verDetalle=0
      this.fecha = "";
      this.numeroRegistro = "";
      this.ofrendaEspecial = "";
      this.ofrenda = "";
      this.ofrendaMisionera = "";
      this.ofrendaPrimicia = "";
      this.otrasOfrendas = "";
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
      if (!this.fecha) {
        this.validaMensaje.push("Ingrese la fecha.");
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

      //Código para guardar
      axios
        .post("ingresos/add", {
          fecha: this.fecha,
          numeroRegistro: this.numeroRegistro,
          diezmos: this.detalles,
          ofrendaEspecial: parseFloat(this.ofrendaEspecial),
          ofrenda: parseFloat(this.ofrenda),
          ofrendaMisionera: parseFloat(this.ofrendaMisionera),
          ofrendaPrimicias: parseFloat(this.ofrendaPrimicia),
          otrasofrendas: parseFloat(this.otrasOfrendas),
          codigoCongregacion: this.$store.state.usuario.codigoCongregacion,
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
      this.abreviatura = item.abreviatura;
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
        .put("ingresos/activate", { _id: this.adId })
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
        .put("ingresos/deactivate", { _id: this.adId })
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
    mostarfiltro(){
      this.filtro=1
    },
    ocultarfiltro(){
      this.filtro=0
    },
  },
};
</script>
