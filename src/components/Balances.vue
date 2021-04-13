<template>
   <v-layout align-start>
        <v-flex>
          <v-layout row wrap>
            <v-toolbar flat color="white">
                <v-toolbar-title>Balances</v-toolbar-title>
            </v-toolbar>
             <!-- Calendario -->
          <v-flex xs12 sm3 md3 lg2 xl2>
            <v-dialog
              ref="dialog"
              v-model="modalCalendario1"
              :return-value.sync="fechaInicio"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field

                  v-model="fechaInicio"
                  label="Fecha inicial"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fechaInicio" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalCalendario1 = false"
                  >Cancelar</v-btn
                >
                <v-btn text color="success" @click="$refs.dialog.save(fechaInicio)"
                  >Aceptar</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-flex>
            <!-- Calendario -->
          <v-flex xs12 sm3 md3 lg2 xl2>
            <v-dialog
              ref="dialog2"
              v-model="modalCalendario2"
              :return-value.sync="fechaFin"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fechaFin"
                  label="Fecha final"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fechaFin" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalCalendario2 = false"
                  >Cancelar</v-btn
                >
                <v-btn text color="success" @click="$refs.dialog2.save(fechaFin)"
                  >Aceptar</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs12 sm6 md6 lg5 xl5>
            <v-autocomplete
             prepend-icon="query_stats"
              :items="balances"
              v-model="balance"
              label="Tipo de balance"
              ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm3 md3 lg2 xl2>
              <v-btn
              color="success"
              @click.native="generarR()"
              >Generar</v-btn
            >
            </v-flex>
          </v-layout>
           <v-container grid-list-sm class="pa-4 white" v-if="generar">
            <div id="factura">
                <header>
                    <div id="logo">
                        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QCARXhpZgAASUkqAAgAAAAFABIBAwABAAAAAQAAABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAAGmHBAABAAAAWgAAAAAAAABgAAAAAQAAAGAAAAABAAAAAgACoAQAAQAAAPQBAAADoAQAAQAAAPQBAAAAAAAA/+EN42h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDIxLTAyLTI1PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjJiMzUwYTgyLWI0ZjQtNGNmMS05ZjZmLTc3NGJiMjI2ZWExMjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5EPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpwZGY9J2h0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8nPgogIDxwZGY6QXV0aG9yPkJ5cm9uIFBpYmFxdWU8L3BkZjpBdXRob3I+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnhtcD0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyc+CiAgPHhtcDpDcmVhdG9yVG9vbD5DYW52YTwveG1wOkNyZWF0b3JUb29sPgogPC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAH0AfQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6pooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoorlPGPjvR/C0ZW8mMt2RlbeL5nPv7D3NTKagryZrRoVK81TpRu32OrzTTIg6so/GvnLxD8X9e1B3XTBFp0B6bRvf8AM8fpXE3viHWL5mN3ql7Lu6hpmx+WcVwzzGnH4dT6vC8GYyqlKq1H8WfYXmx/31/OnBlPQg/jXxel9dowZLqdWHQiQg1s6X408R6YwNrq93gfwyv5g/Js1Eczi90dNXgfERX7uon8rf5n1xRXh3hX40yK6w+I7QFCcfaLcHj6qf6H8K9i0bV7HWbJLvTbmO4gfoyH9D6H2rtpV4VV7rPl8flWKwErV4WXfoX6KKK2POCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK5nx94hHh/RmeIj7XN8kIPr3P0H+FZVqsaMHUnsjWjRlXqKnBasveJbq5GiaiujujamkDGJAQSGwccH+tfIl7JcS3cz3rSvclj5hlJL7u+c85ru7LVLyz1IX8E7i63Fi5OSxPXPrmt7xJoVp47099W0VEg16Fc3NqDgTD1Hv6H8D2r55ZhHMPdjo107n6Bk9JZHU/fK8Z297s/PyPIKKdIjxyMkisjqSrKwwQR1BFNrFqx99GSkrrYKKKKRQV3/wVuNWj8Z28WmmQ2j5+1p/BswcE+hzjB6/gTXL+FvD194l1WOx06PLHl5D92NfU16XrGp2PhLSn8O+F3zMeL2+H3nbuoP8AnHQc11UF7P8AeydkvxPiuL89w2Dw0sPJKU5dO3me5wzRyhvLkV9p2ttOcH0qSvmzwZ4juPDerpcRsxtnIW4iHR19ceo7f/XNfR1pcR3VtFPA4eKRQ6MOhBGQa9jC4qOIWmjPybD4hV1dbktFFFdZ0hRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAE4FeD/E3VTqXieaNWzDa/ukGeM/xH8+Pwr3O7kEVtLI3RVJP5V8x3MzXFxLNJy8jFz9Sc185xFXcaUaa6n1HC2HU68qr+yvzI6tabfXGm3sd1ZyGOZDkEd/Y+oqrRXyEJuDUovU+6nCNSLjJXTOs8RaBa+PbB9V0ONIdfiUfaLXIAm9x7+h/A+tefN4N8RqxVtFvsg4/1RNehfC52XxjahTgMjg+425/pXd32p3b3cuJmUBiAF4AGa+kjjKU6CrVlrtoeB/aeLyyq8JRtKKV1fpfoeA/8If4i/wCgNff9+jV3R/h/4j1K+jt/7Nnt0YjdLOu1UHrz1+gr2n7fd/8APxJ+daml6hcyWWoJJIW227OrdwcetVhsThq1RQSZGK4nx9OlKXLH8TznWNTsfCWlP4d8LvmY8Xt8PvO3cA/5x0FcLRRSrVXUlrsfj+MxdXF1XVqu7YV7d8GdXN7oEthK2ZLJ8Ln+42SP13D8q8RrvfgxdGDxW8G75Z4GXGepBBH6ZrfAVHCsvMeCny1V5nulFFFfTHvhRRRQAUUUUAFFFFABRRRQAUUUUAFFFRXdzBaQNPdTRwwrjc8jBVGTgZJ96A2JaKyv+Ej0X/oL6f8A+BKf40f8JHov/QX0/wD8CU/xquSXYj2ke5q0Vlf8JHon/QX0/wD8CU/xq3Y6hZX6ubG7t7kJwxikD4+uKHFrdDU4vZlqiiopLmCOURSTRrIwyFZgCR9KlK420tyWikDA9CKWgdwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigChr246NeCMgN5T4J9cGvmmvqG4QSQyIeQykV8yXtu1peT27/fhkaM/UHFfK8SQfuS9T7HhOavUh10IaKKK+UPtDq/hh/yONp/uv/6Ca7C6/wCPmb/fP865P4VwSS+LoHRCUjRy7dlBGP5mvQr3Qbz7VIYgjozEg7gK9qnhqtXBxcI31Z8bmtenDHPmf2V+pi1paP8A6jUv+vV/5U7+wb//AJ5L/wB9itHTtHuYLO+MoXzJYWjRAc5JFa4DA4iNdSlBpHk47EUpUJRjK7PneinSI0bskilXU4ZWGCD6Gm1pLRn5zLcK6/4T5/4TixwR92TPH+wa5CvQfgrZtN4luLnblLeAjPozEAfoGrfBputGxthVerE9wooor6s+jCiiigAooooAKKKKACiiigAooooAK89+Pv8AySjWvrB/6Pjr0KvPfj7/AMkp1r6wf+j463wv8eHqvzMcR/Cl6HyDRRRX33Kux8ndhXr/AOzp4ln0zxH/AGNHDE8OpSjfIxO5NqORjtXkFd78EyV+IekEf89j/wCgNXl5wksLJ2O7Lm3XSPsOvmj9qP8A5GvSf+vM/wDoZr6XFfNH7Uf/ACNek/8AXmf/AEM14GUa4mNz1sx/gs8o0zXtX0sqdN1O+tMdBDOyD8ga9A8NfG7xTpTouoPDqtuDys6hHx7Ov8yDXltFfWVcHRqr34o8CGIqU/hZ9ieAvijoHi8pbwymz1I/8ulwQGb/AHD0b+ftXeV8Axu0bq8bFXU5VlOCD6ivpD4H/FKTWHi8P+I5t1+Bi1umPM4H8Lf7eOh7/Xr85mGUugvaUtV+R7GEzD2j5Km57dRRRXiHqhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAGvD/itpDaf4ia6RcQXg3g9gw4I/kfxr3CsPxjoMfiDRpbVsLMPmic/wALD/OPxrzs0wn1qg4rdbHp5TjfqWJVR7PRnztWloGjXeuaglpZJknl3P3UHqat2HhTV7vVvsBs5YpFbDu6kIg9c9CPp1qj8R/HNp4b0+bwr4NmzMcpf6ih+Yt0KIfXsSOnQc5I8LIeG8RmmIUGrRW59ZnXENHBUf3TvJ7B8RfHVr4ZsJfC/gub/SPu3+oofmLd0Qjv6kdOg55Hkf8Abeq/9BO+/wDAh/8AGs+iv33Lsow+AoqjTitD8mxOLq4mo6k3qzQ/tvVf+gnff+BD/wCNW9J8Wa7pWowXtnqt4JoW3DdMzKfYgnBB9KxKK7ZYajJOLirMwU5LqfRME2nfE/Rn1TR0jtvElug+2WWceb/tL6+x/A9jXEyI0bskilXU4ZWGCD6GvPNA1m+0DVoNR0qdoLuE5Vh0I7gjuD3Fe8282nfE/Rn1TRkjtvEluo+2WWceb/tL6+x/A9jX5ZxPwxLDSeIw6vF/gXOCrK6+L8zh693+EOjHTfDX2qZds163m89dn8P9T/wKvOfA/gu91nVwL+1mt7GBgZjKhQt/sDPOT39B+Gffo0WKNURQqqMAAYAFfOZbhmn7SSOnAYdp+0kOooor2j1QooooAKKKKACiiigAooooAKKKKACvPfj7/wAkp1r6wf8Ao+OvQq89+Pv/ACSnWvrB/wCj466MJ/Hh6r8zHE/wpeh8g0UUV9+fJBXefBX/AJKDpH/XY/8AoDVwdd58Ff8AkoOkf9dj/wCgNXlZ1/ukjvyz/eIn2JXzx+07o2oTanp+qw2kr6fDb+VJOoyqMXOAfTqK+hxWN4v0a21/w/dadeo7wSgEhG2nIIIIP1FfJ4bEvCzVVK9j3q9BV48jPhiivTfiT8NJvD9tJqWmyPcWSH96rjEkYJxk46j3GPp3rzOvs8Bj6eOpe0pnzeLws8LPkmJUlvNJbzxz28jRzRsHR0OCrA5BB7HNMortaTVmcydnc+zfhR4vTxj4St7yQgX8P7m7QdpAPvAejDB/EjtXZV8pfs7+IW0jxwthI5FrqS+Sw7eYOUP1zkf8Cr6tr4XH4f6vXlBbH1WEq+1pKTCkJCjJOBWf4g1mx0DSbjUtUnWC1gXczHv6ADuT0Ar5S+I/xS1fxfPJbwO9hpAJC20bYMg9ZCOv06D3608HgamLl7u3cWJxcMOtdz6A8TfFrwnoDyRSX5vblODDZr5hz6buF/Wu3t7kT2MdygIV4xIAevIzXwNX1j8B9Ru9S8C3ct/czXMy3TqHlcsQojTAGegHpXTmOAhhFHld2zDB4ueIcr9DzqT9oPWS37vR7BR6F3P9RU9r+0NqCn/StBtpB/0zuGT+YNeGUV70cqwrivdPJeOrp/EfTmi/H7QLp1TVLG9sCergCVB9SMN/47Xp3h/xHpHiG28/RdQt7yMfe8tuV/3l6j8RXwrVvS9SvNJvo7zTbqW1uozlZImKkf8A1vauSvkdOSvSdmdFLNJxfvq5960V5H8Hfiunihk0jXdkOshf3ci8LcgDnA7N3I6HqPQeuV85XoToT5JrU9qlVjVjzRMrxVrlv4b0C81a8jlkt7VQzrEAWIJA4yQO/rXmH/DQPhv/AKBusf8AfuL/AOOV1vxr/wCSYa9/1xX/ANDWvjavVyvL6WKpuVTozz8di6lCaUD6c/4aB8Nf9A3WP+/cX/xyj/hoHw1/0DdY/wC/cX/xyvmOivTeSYe3U4VmVY+8tC1KLWdGsdStldIbuFJ0WQAMFZQQDjIzzV6vHP2ar+6u/D+oxXV1POlu0SRLJIWEa7T8qgngcdBXsdfKVIqM3FdD6Cm+aKbOd8deLLLwboo1PUYbiaAyrFtgVS2Tn1IGOPWvPf8AhoHw1/0DdY/79xf/AByrn7S3/JPE/wCv2L+TV8r17eW5dSxNJznvc8vG4ypRqcsT6c/4aB8Nf9A3WP8Av3F/8co/4aB8Nf8AQN1j/v3F/wDHK+Y6K75ZJh0r6nIsyrNn3+jBlDDoRmlrzz4FX91qPgVZr+6nupxcyL5k8hdscYGSc4rrvFGu2XhvQ7rVdScrbW65IHLMegUD1JwK+U5W5csT6DmSjzM0bmeG2hea4lSKJBuZ3YKqj1JPSvN/EXxq8JaS7x21xNqUynBFomVz/vkgEe4Jr56+IHj7V/Gl87XszQ6erZhs0b5EHYn+83ufwx0rkK+hwuRprmrP5I8avmjvamj7C+F/xFj8ezaqIdOayjsvKwzyhzJv39sDGNnqetZPxj+JOoeBtR063sLO1uEuY2djMWyCCBxg+9eF/BuQp4/0fn5TdJkZ47/413P7U/8AyHNC/wCveT/0IVzRwlJY/wBhb3f+AbyxFT6p7S+o+1/aGv1cfatAtpF7iO4ZD+qmuq0T4+eHrtwmqWd7p5P8e0SoPxX5v/Ha+YaK9ieT4aS0Vjzo5jWju7n2xd39n4x8I6lH4X1W3ea4t3ijnjfmN2UgbsfMv5Zr4113RtQ0HUpbDV7WS1uo+qOOo9QehHuOKXRdWv8ARNQivtKupbW6jPyyRnH4EdCPY8V9GeBvEOh/FzRn0nxVYW7atbLuIGVLL/z0jI5XtkZ9OxxWeGc8lk5Jc0Hv3R1xxEcZaL0kfMVFe9eKP2fbhHaXwzqkboeRBeAgj6Oo5/ED6159qXwo8aWDN5miSzKOjQOkgP0AOf0r6HD5zg66uppeuhEsPUj0OGorqI/h94udwq+HdSyfWAgfma6LR/gr4yv2Xz7OCwjP8dzOv8k3H9K2nmeEpq7qL7yVRm9kea16t+z/AOF9avvGFnrdqr2+l2bN5tw3AlyCPLX+8TnnsMeuAfSPB/wI0XTHS41+4fVZxyIsGOEH3AOW/E49q9ftbeG0t44LaKOGGMBUSNQqqB2AHSvmc14hp1abo4dXv1f6Hbh8G0+aZKABRRRXyB6QUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV578ff8AklOtfWD/ANHx16FXnvx9/wCSU619YP8A0fHXRhP48PVfmY4n+FL0PkGiiivvz5IK7z4K/wDJQdI/67H/ANAauDrvPgr/AMlB0j/rsf8A0Bq8rOv90kd+Wf7xE+xKQgEYPQ0tFfGLY+kMfxBokGq6TeWbqNs8LxEH0YEf1r4YYFWKngg4NffzfdP0r4I1Di/ucdPNb+Zr6Hh5KLml5Hj5u21Fsr0UUV9OeIX9BvJNP1mzu4DiWCVZVPupyP1FfdtvMlxbxzxHMcih1PqCMivgi2/4+I/rX2Nb62dM+EFvq+R5sGkJKue7iIYH4tivlc7hfERS3aPeyyVqMm+h4R8f/Gcmv+KH0m1c/wBm6Y5jwDxJN0Zj9Puj8fWvK6dI7SyNJIxZ2JZmJyST1NNr6LC0I0KShE8avVdWbkwr6l/ZzUt4HvlHU3bD/wAhpXy1X1P+zd/yJd5/1+N/6AleHxA7ezPUynXnPnzxV4Qv/DGrNpupSW5uVRXbyWLKNwyBkgc1hy2kkYzwwHpX2hrnh+xvNVN5JY2klw6BWleMMxx0GSKzNS8IabewGO6060kUjHMQUj6Ecj8K8dcQ4qlOzhdI9D+yKE43UrM+OqK6j4k+H4/DXi670+33fZ8LJEGPIVhnH4HIrl6+2w9ZV6cai6nzVWm6U3B9CW1uJrW5iuLaRop4mDxyIcFWByCDX2X8LPF0fjLwnb3zbVvY/wBzdRj+GQDqPYjBH1x2r4wr1X9nTX20rxv/AGe74ttSTymBPG8ZKH69R/wKvMznDKpR9ot0duW1nCpydGe5/Gv/AJJhr3/XFf8A0Na+Nq+yfjX/AMkw17/riv8A6GtfG1ZZD/Cl6l5r/EXoFFFFe69jy1ufSH7MP/IM1f8A3ov5GvcK8P8A2Yf+QZq/+9F/I17hX55V/iz9T7Cn8EfQ8n/aW/5J4n/X7F/Jq+V6+qP2lv8Aknif9fsX8mr5Xr6rI/8Ad36ngZn/ABgooor2J/Czz47o+sf2ef8AkRW/6+X/AJCuE/ai115NS0rQo3YRRRm7lAPDMxKr+QDf99V3f7PP/Iit/wBfL/yFeQftHo6/EmQuDta0iK/TkfzBr43J4KeK16XPo8xk40NPI8tooor7Q+bOz+Ef/I+aR/18p/Wvdfj54Mj13QjrKPcteafGEigiXcJA0ig5GM8Ak8elfNnhjWZtA1yz1KCNJXt5BJ5b5w2O1e+WHx+0S8tzFqul39o7DBMJWVR+JKn9K+XzDCYqGJeIoK57mExFCVFUarPn3UNLubHmeKWMekiFT+tUK+mJvHHgXxBYS2d1qaCKZSrRXUDpwePvYwD7g8V5FeeCTd6xdx+GxBqFmHPktFdxsdvUZG7PHT8KeCzmtTi442DTXUWJy6nOSeGkmjhK1fC+t3Xh3X7LVbBts9tIGwejL0ZT7EZH410//CtvEH/QIk/7/J/8VR/wrbxB/wBAiT/v8n/xVaVeIMHOLhJ7kQyjERkpI+ttD1KDWdHs9RtCTBcxLKueoyOh9x0q9XDfBm0v9O8D29jqkJhnt5ZFVCwOFJ3DoT3Y13NfNKSlrHY9uzWjDA9KKKKYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFee/H3/klOtfWD/0fHXoVee/H3/klOtfWD/0fHXRhP48PVfmY4n+FL0PkGiiivvz5IK7z4K/8lB0j/rsf/QGrg67z4K/8lB0j/rsf/QGrys6/3SR35Z/vET7Eooor4xbH0g2VgkTM5AUAkk9q+BbmTzbiWT++xb8zX2L8YvEsXhrwNqEvmBbu6jNtbLnkuwxkfQZP4V8bV9NkNNpTm9meHms05Rj2CiiivojyCa0GblPrX0l42lMH7N9uuSGktbRR+Lof5V846cha4yBnAr6Z+LNi0HwLaDH/AB6rbA47YdV/rXy+Y1FLMKce1vzPcwkWsHOR8uUUUV9QeGFfUn7Ov/Ii3/8A19t/6LSvluvqX9nJd3ge+A6m7Yf+Q0r5zP8A/l36nsZT9s+Zv7U1D/n+uv8Av83+NH9qah/z/XX/AH+b/Gtjxb4P1DwtrL6ZqEtrJcIiuWhZiuCMjqoP6VjfYZfVPzNd8cZg7K7RyPDYi+zIJppZ33zyPI+MbnYk/rTKtfYZfVPzNH2GX+8n51qsxwqVlJEPB13vEqVr+E71tO8R6feIcNbzpKD/ALrA/wBKp/YZfVPzNS21q8UodiuPaufGY/Dzoyipa2NsNha0asW4n1z8av8Akl+vf9cV/wDQ1r42r7B+LTmT4Q6s7dWtYyf++lr4+rDIHejJ+Zpmv8RegUUUV7r2PLW59Ifsw/8AIM1f/ei/ka9wrw/9mH/kGav/AL0X8jXuFfnlX+LP1PsKfwR9Dyf9pb/knif9fsX8mr5Xr6q/aUVm+HYIBIW8iJ9uGH9a+Va+qyP/AHd+p4GZ/wAYKKKK9ifws8+O6PrD9nn/AJEVv+vl/wCQrn/2mPCsl7plp4itI9z2Q8m5x18tj8p+gYn/AL69q6H9nn/kRG/6+X/kK9G1O0jvtPuLWdFkimQoysMhgexr8/oYiWHq+1j0bPratFVocjPgilr0H4ifDq88O3k09mjy6aWJVwM+V/st6fXof0rgZIZI/voR719lg8zw+LinCWvY+cxGCq0JWkiOiiiu9NM5LNBSglSCCQRyCKSik4p7oabWx13hz4heIdCkUR3rXduOsF0TIuPQHOR+Br6D+G/jDSPG9uyQL9k1KIZltJHycf3kP8S/qO46Z+Tqv6Dq13oWsWmp6dJ5d1bOHQ9j6g+oIyCPQ14uYZHhsVFyUUpHpYTM61BpOV0fc1ha/ZVZQAATnrmrdY3g/X7XxP4dstWsjiOdAWTOTG/8Sn3B/wAa2a+TVP2Xudj6Dn5/e7hRRRTAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArz34+/wDJKda+sH/o+OvQq89+Pv8AySnWvrB/6Pjrown8eHqvzMcT/Cl6HyDRRRX358kFd58Ff+Sg6R/12P8A6A1cHXefBX/koOkf9dj/AOgNXlZ1/ukjvyz/AHiJ9iDpXnnxQ+J1r4GlhtGsJ7y9niMsYDBIwMkct16jsK9DFfNH7Uf/ACNek/8AXmf/AEM181l1GNevGE9j2sZVlSpOUdzzfxr4u1Xxhqv23V5QdoKxQpxHEvoo/mTya56iivt6dONOKjBWSPmJzc3zS3Ciip7WEzSf7I6mprVo0YOcnoh06cqklGJ1Pw30htU8S6db7NyvMJHH+wvJ/PGPxr6o8b6O2sfD/VtNiXfLLat5aju4G5f/AB4CvM/gV4YaCFtWuY9slwAsII6R56/iQPwHvXuYAC47YxX57LFPEYqVddD65UFSoKkfAFFd78afCreF/Gt0Io9un3rG4tyBwMnLJ+BP5EVwVfoGHrRrU1OPU+SrU3Sm4sK+nf2Y7tJvCWowBgZIrsMw9AUUD/0E18xV0ngjxlq3gzUnu9IlXEgCzQSDMcoHTI9Rzgjnk+prjzPBPF07R3R0YLErDzu9mfWXibw3pupagLm602wuJSgUvNArMcdOSKyP+EM0f/oDaX/4DJ/hXC2P7Q0BiAvtAlWQdTDcBgfzUYrO179oK8mt3i0PR47WQjAnuJfMK/RQAM/Un6V8fPh7FVJ3s18z6KOb0YRMv4x39v4b1200/RrHSYnEHmTgWML4JPyg5U4OBn8RXAf8JbqH/PvpP/gtt/8A4isjU7661S/nvdQne4up2LySOclj/ntVWvrcJlFChRjTnFNrqeBiMwq1KjlF2R0P/CW6h/z76T/4Lbf/AOIrovAXiW2ufEUaeJYtITTfLcsTpsQ+bHH3Uz1rzytrwtp76hqlrbqCWuJViH4kZNY5nhMLRw0nypGuBxFepWiuZs+q/itFv+E2sImMC1DDHoCp/pXx1X3N4m07+2vCOpaeB811aSRL7EqQP1xXw26sjsjgqynBBGCDWPD0l7OUEXm8XzqQ2iiivojyD6J/ZcuEey1qIMPMRoiVzzjDY/lXu9fBukatf6NeC70q8ntLgDHmQuVJHofUexr034e/FfWU8V2knirWbmbS0STfGsS/Mdh28KBnnHWvlcdlE4OVaD03PdwuYqSjTktdj2342WP2/wCGOuRgZaOJZwfTYwY/oDXxvX3drlqur+Hb60Ayl5avHz6OhH9a+EiCDgjBHaurIZ3hOBhmsfejISiiiven8LPKjuj6w/Z548CP/wBfL/yFUtS+O+gWGo3VnNpuqmW3leFyqR4JUkHHz+1Xf2eefAj/APXy/wDIV4X8bdAk0L4hallCLe9c3kLdiHOW/Jtw/Kvi8sw9LEVZQq+Z9Jja1SjBSgenah8b/DN3k/2ZqwJGDlI8H/x+uC1vxL4E1RmkXSNVs5m/jthGoP8AwHcR+QrzOkr2f9XsIpc0bp+p539r17crsz1mw+Gn9u6Pbano19E8FwpZEuotjLyRglS3cVlX/wALdft8lLFZlH8UEyn9CQf0qL4YfESXwfLNb3sEl9pk2P3Qk5hIJOUB45ycjjPHNetR/F7wXNCHdr6Fv7j25yP++SR+teDicLmmEqv2Lbj0PVo18DiIL2iszwHVfDepaZk3dncwennRFQfoehrE719r29lDqelwXUAL2t1Csqh1zlWAIyPoa+MdSUJqF0igALK4AHbk17GQ5hiMVzQxC1R52aYSjR5ZUnuVqKKXr0619E3ZXZ46V2fRn7LupSPpur6a7ZjjZLiMehbKt/6Cte514D+zNbPHd6tMR8nlxxA+pySf6fnXv1fn1eop1ZuPc+voxcacU+wUUUVkaBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFee/H3/klOtfWD/0fHXoVc94/wDDf/CW+E73RRdfZPtOz995fmbdrq/3cjP3cde9bYeahVjKWyaMq0XKnKK7HxBRWrfaT9lvbi38/d5UjR7tmM4OM9ag+wf9NP8Ax3/69fXf2xhP5z57+zsR/KUa7z4K/wDJQdI/67H/ANAauR+wf9NP/Hf/AK9dp8HoPI+IWjDduzKe2P4Grz80zLD1sNKEJXZ2YHBVqVZSktD6+r5o/aj/AORq0n/rzP8A6Ga+l68Z/aG8GrqmnDxCLqRZLKNIFt1jzv3Sdc5/2vTtXkZdXhQrRqT2R6GMpSq0nGO58y0ozniujsvCuo3RH2fTb+b3WFsfniur0f4Ya5clTLbw2MZ/imcFsfQZP54r2a/EeGpL3dTzaWTVpvU86gtHc5f5V/WvUPhx8P5tWlhvNRhaLTFIZIyMNP8AT/Z9T37eo7/wr8MdM050mugdQuV53TLiNT7L/jmvUNO04JhmHHr/AIV8rjc3r5jLkhoj3cNgKWEXNLcfotkttAu1QoAwABgD6VqUAAAAcCiilTVOPKhzk5u7OI+K3hGDxZ4fe3kAWeP5oZcco3b8Ox+tfIms6VeaPfy2d/C0U0TbSCP1r7wkXehUgHNeb/EDwRba7GwuLRSy8RTxviRR9CMEZ7fyrrwuZ1cvne14Pddjmr4KGLj2kj5Jor0LxB8MdZ05neC2e5gBOHgwzY90yT+Wa4yfTJ4ZCkg2OOquCpH4V9Th88wldXUrHh1crxFJ7XKFFWvsUv8As/nR9il9V/Our+0MN/OjD6nW/lKtLVtbBv4nUfTmtrRfC9/qjgafYXF1k/fC/IPqx4H4muWvnWFoq/Nc3pZZXqPaxgW1u0xyeE7mvbPgl4SkkvI9ZuoisSAraqR94ngv9MZA+p9Kf4V+Fs0U0U+sLDcsMEWqyFVH+8wU5+g49zXs2lWeoWsQMVlY4UYVftLKBgcAYj4FfH5jms8xmoQ+E+hwmBjg480tzokXagX0GK+Ufj54Qbw94tl1G1Q/2fqTGYEDiOU8uv4nkfU+lfUUcuplv3lpZqu7GVumPy+v+rHPt+tYPjzQG8R6FcWd1aW8iEHb++IIPYg7Dgj8a6MLjJYKSqR1XX0MsRho4mPK9z4rortPFfw/1XQJGeaIva9p4gXT8e6/jXLmyYfxZ+gr6qjnOErR5lI8GpluIpuziU6sWP8Ax8r9DUgsWP8AEB9RWno+i3N7dCPT7ee5nP8ADGucfX0+prHHZphvYyipatGuFwNb2ik1sfaulN5mlWjHqYV/kK+JvG1j/ZvjHW7MLtWG8lVR/s7zj9MV9l6Tb6j/AGbaK15AgWNQVW356dMljXz/APHvwU2m66Nde8WX+1JDujSHYImVFHXcc55PavFyjGQw0nKo9Gj0cww0qySgtUeM0VofYV/vfp/9ej7Cv979P/r170s5wrT948uOW177H1D+zz/yIrf9fL/yFXPjV4OXxZ4ZXyVA1C0Yvbv9Ryp9jgfjisj4BQ3b+Cibe6SKP7U+VMW4ngd816TNb6jJC6G7szkYBa1Y/n+8r4+NSUHz03rfQ+ilCMlyzWh8LXdtNaXDwXMbRyoSrKwwQR1FQ19Q+O/hsmuM0txLbR3Y/wCW8NuRuHYMC5z25614x4g+HGtaTIxNpJcQjkS22ZFx7jGR+Ir38HxJRkuTEe7I8jEZNUi+alqjhaWrslgyMVIO4cEE4I/SmGzf+7/49XrrM8PNXUjgeBrReqPp/wDZ61a91Pwldrf3Mk/2aRIYg38CCNcKPavmDV/+Qte/9d3/APQjX0R+zibpNB1RLeKFx5wyXlKc7Rxwp4xnmvIPiD4Nu/DHiN7XULiCSWdftI8jJADM3GSBzx6V4eWYylQqVJVHZM9PG4apVjCMEcXWjp1lJJMmEZpGICIoyST04rpPD/gjV9UdDZafKI2/5bzjYgHrk9fwzXtHgH4d22iSJdXDC61Af8tcfJH/ALo9fc/pWOacRRlF0qG7NMDlDi+eqdJ8IvDp8P6BHDKP9Ik/ezezkDj8AAPwrv6rWMAghC4was14tCLUPe3Z6dRpy02CiiitiAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiioby5hsrSa6upFit4UMkkjHAVQMkn6CjcL2Me7013uZGDMQzZ+7UP9mSerf98VZ0nxNp+p3ws4hdQ3LxmaNLm3eEyxggFl3AZAyM9xkZHNXzqNsNXXTC5+2NAbgJtONgYKTnp1I4rinl0HJtm8cXK2hj/2ZJ6t/wB8VJBp0iTIxLcEH7tWdY1+z0q5itpVuZ7qVDIsFtA0z7BgFiFBwMkDJ6ngVZsdVtNQ0hNTsZDcWjxmRGjQksB1AXGc8EYxnPFJZdCNpA8XJ6F4VDeR+dbSJnqK52Pxtpsl69otrq5uUVXaP+zZ9yqxIBI28AlW/I1ra7rVpolvDNe+cRNKII1hiaVmcgkAKoJ7Gu6VNtcr6nMqi3TKS6Sx67j+Qq1DpSqckD8eak0fVotVEpht72Hy8Z+02skOc56bwM9O1RWfiHTrzX7/AEWCcnUbFUaeMoRgMAQQSMHhh06ZFckcBTT22N3ipPqX4rWOPBxk+9T1lad4g07UdZ1HSrSYveafs+0LsIC7gSMHoeh6dMUa/r+naBFbSapOYluJhBGQhbLEE84HAABJJ4FdcaXL7qRi6ia5mzVooFRXU8drbS3ExxFEhdjjOABk0DJaa6B1IYZFc7YeNNIvHtF3Xdut2VFvJdWksMcpYZUK7KFJPYZye1auuara6Lpsl9fFxAjIh8tC7FncIoCjJJLMBTcHs0SprdMjutLSQkqOf1rH1DQIbpdt1bwzqO00QYfrWvpGtw6pK8cNtqEJRdxNzaSQg/QsACfatSuKpgYSd1ozohiZJdzzefwHocpy2j2P/AE2/wAsVEvw+0FTkaPa/jk/1rsdT8SafZX0lmUurq6iUPLHaWzzGJT0LbQcZ7DqewrR0y8s9TsIb2wkSa2mXcki9CP6fTtUPASX2mUsXF6WRxtn4R0u2YG30uwiYfxLAufzxW7BpROMgkD2wKjsPF2nX0ka2dtqcsbyGJZVsJfLyG2n59uMAg85xxWprOr2mj28ct40n72QRRRxRtI8jkEhVVQSTgE/QE9BTWXK/v3bF9c090ktrBIgMgfQVcAxWboms2msxTNZtIHgk8qaKWNo5InwDhlYZHBB9weKzLzxnp1pfJZzW2qid2ZY1GnzHzNvXaQvIxzkV206Ch7sUYSq31kzpaCMgg81nXes2lloUur3fmwWcUJnk8yJldVAycpjIPtjNXLq5htLWW5upUigiQvJI5wqqBkknsKqzFzIzr7S1kJaMYJrlr/wZpV1KXudKsZHPVjCAx/HFbOn+L7K71KOGRZ7e3udq2c09vLELhiCSAWUAcYwM5POK0vEet2Hh7S31DVZGjtUZVLKhc5YgDgAnqa46mXqUvd0bNoYuy11RxMPgLQ4n3Lo9ln/AG13D8jmuh0/RY4I1it4Y4oh0SJAqj8q2X1SxS50+ESKz34Y25UZDhV3E5HHTmtCs/7P199tmn1q/wAKI7ePyoUT0GKratbG5gUAkFTnpmqWseJLHStQisp0vJrqSIzCO2tZJiEBwSdgOOTV3R9Us9YsVu9Pl82Biy5KlSrKSCrKQCpBBBBANdk6PNDlexzRqWldPUyP7Mk9W/74o/syT1b/AL4q/wD2/p3/AAkX9h+cf7R8nz/L2HG3OPvdM85xnOOam1zVbXRdNkvr4uIEZEPlxl2LO4RQFGSSWYCuT+zYXS1Oj65K1xNIt2t0kDZ5OeRitCsbSPEmn6nfPZQ/aYbxY/N8i6tpIHKZxuAcDcM4GRnFSeItf07w9aR3OrTmGGSQRKQpb5iCegHQAEk9gCa7KVH2aUEc8qqn7zNOSNZFw4yKy7nSlYkp19uK1hyKbLIsUTyOcKgLE+wrOrQhV+JFwqShqmcjqHhu2u8/bLO2uP8ArtCG/mKxZfAOhuTu0ez/AOArt/lXoGm31vqWm2t/aPvtbmJZ42IxlGAIOD04NYieMtFkeNg9wbSSQRJem2k+zsxO0ASY24J4DZwT3rm/s9/YbNfra+0kHg3Q7PQ0uIrC1jto5CGZU7npmrOtaVDc30V15EJnC7PMMYL4B6Z645NX9U1C10iwe8vG8uBCqswUnlmCjge5FXetbfVv3XI2Z+29/mRh2+lEkFgT9eBWpb2qQgYAJH6Vlaj4osbHVJdPaK+nuoo0lkW2tJJgisWCklVIGdrflWrBeRS2K3bb4YSm8+ehjKj/AGg2CPxqqeEhS1SFLEOp1LFFYGleLNM1O9gtoDcxvcoZLZp7d4luFHJKFgM8EH1xz0rTn1G2g1S10+RyLq5jkliXaeVQqGOeg++v510crWhkpJ6lyiqOt6raaJpk1/qEjJbRbQxVSxJJCgADkkkgYHrU9jdQ31lBd2riS3njWSNx0ZWGQfyNFna47q9ieiuevfGGk2d3NDNJP5cEiwz3KwO0MLnGFaQDaD8wzzxkZxXQ0NNbgpJ7BRRRSGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFZPi37N/wjWpi/tZ7yza3dZoLdcyOhGGCjI5xnvn0rWopp2dxNXVjznwrqSnxNp9lp2tReItPa2kfzXVGnscbdu6RAOGzjDANlepwa25P+Sowf9gh//RyV1Soq52qBk5OBS1cp3dzONOytc4TxnLpsPia3kn1e40DU0tD5V+/li3mTdzE2/KsQQGxwcHIPWtvwFeT3/ha0ubuCGGV2k/1MZjSQCRgJFU8gOAH/AOBVvsquMMAw9xS0nO8eUahaXMcrp4/4uZrP/YLs/wD0bcVS+KkyQWmgyyX0dgiarETdSbdsXyScndx+ddvQaFP3kwdP3WjnvCOo219FcrbeIrXXHjKlmgaI+UDnAIj9cHr6GuF1S5TQvGmveJZci3stRjt7sqOfIls4B+kixH869bxRgVUKvK27bkypcySvsecfDqymsfFN+Lxdt7caXa3VyPSWSa5dx+BYj6AU7xNYXvizxPqVnZtaCz0+yayk+0IzDzZ1BfbtI5VAnP8AtmvRcUU/bPm5uoey93lMDwJqM2peGLOS8Ob6Hda3Q7iaNij/AJlSfoRV7xJ/yL2p/wDXtL/6Aa0aKzb1uaKPu2PKLjV9O1z4baboOjXcF9q09tawrFbOJGgcbCXfbnYEwTk46Y610/xXYR+CJ3adbdVu7MmZsYjxdRfMc8cdeeK7DA9KDzVqpZppbO5n7LRpvc5jwjqtpeTzxQeKbPW5Agby4WhJjGcE4TnHI6105oGO1FZyd3c0jGysedafqkHh698U2mpX9npmo3F813bzXw/dzRsiBSo3Lv27SpAORgetbnw3v31LwlFcy20FtI1xcq8cEJhXcs7qTsJJUkjJBPUmuoKq2NwBxyMilq3NNWsQqbTvc8p+Hur2cFjZwTeMLG3cXUqnTXaAPkzPhOfmyc/Xmup+ILaasOlnVbi7sAt1ug1KAqq2ku1gC7NkBWBZeQQc4OOK63ApCAwwQCKcqnNLmBU7R5Tkfh/qE99Jq6y3FtqMMM6pFqcEYQXQ2AnO35WZT8pI49hg1L4iH/Fb+E/rdf8AoqupUBQAoAA7Clpc/vcyQ1D3bM5b4pf8k68Rf9eMv/oJp3xIs7i+8FX8NpC88g8uQwoMtKiSK7oB3JVSMd8109FKM7W8mEoXv5nnvi7XNM8SaPaaboN5De6lcXVs8aQNueAJMjtI46oFCnrjnjqa1viOobR9NVgCDq1gCD3/ANJjrqwqgkgAE9TS0+e1rdBezunc8r09ZNI8f6B4cmDGG0kuJrBz0Ns8TYTPqjAr/u7PWvVKMUUVJ89tB04clzhtbgv7j4lWy6ZeQ2ko0lyzy2/nAjzl4A3Lj610Hh3SIvD2lzRtctNJJLJdXFxIAu+RyWZsDhR7dgK2aKTm2rAqaTbPHimrJp8XjZjbC1+3/wBqsuxvP+ysvlYJzjAgw2MdRXZ/E8NL4NbyZAjteWWx8bgCbqLBx3rrqKt1btO2xKpWTV9zhdKt7u1+IwTWbsX0z6azWcoiEQjUSKJU2gnJJMRz7Y+sHie0vPE/iu4sbI2htdNs2inFyrMrSXCkEDaRyIx+Uteg0Uvau/MHstOU5v4fXs134Xtor1t1/ZM1jcn1kiOwn/gWA30YVt6n/wAg66/65N/I1ZoqG7u5oo2jY4nQrS4vvg3YWlk226n0KOKI5xh2twBz9SK5zW/Flnb+ALOHTpNMa4gt0iudGvLcySjaFBQoHUoFwSSQRwPbPrNJtXdnaM+uKqM0ndozdNtaM5T4oukXge9kkZURZIGZmOAAJkySa1tI8R6Lq85t9K1fT72dU3mO3uUkYLkDOFJOMkc+9a3UUYqeb3bF8rUrnmer38Fj8RtZ+0eJbXQt9jZ488xDzsNP08z0z2/vV2slzbXPhWSfedYtWtW3NbbWN0NpDbcHBLc8A9TWvgelFVKfNYUadrnmHhbUYItb0Cx0TWE1vTZFf/R51R7jTkEZwxdQCoyAhDjPzYzwa6XWP+Sj+G/+vG+/9Ct66kKqkkKATySB1pabqXd7CVOytc4vxkbzVPEmj6RpjW4e2zqc/nqSmF+SMEAg8uxYe8dSfDZprPT77Qb0p9p0m4MI2ZCmJx5kZGewVto/3DXYUUvae7yj9n73MeS69qNpp0uuTaLqLQagbpvO8P38aOt7JwMxp9/EgAIZSR3I4NesqcqCRg46UFFLBio3DocUtKU+ZJBCHK2woooqDQKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9k=" id="imagen">
                    </div>
                    <div id="fact">
                        <table>
                            <tr style="font-size:20px">
                                <td><b>BALANCE</b></td>
                                <td align="right" class="blue--text"  width="150px">Fecha inicio: {{fechaInicio}}.</td>
                                <td align="right" class="blue--text"  width="150px">Fecha fin: {{fechaFin}}.</td>
                            </tr>

                            <tr>
                                <td><b> CONGREGACIóN </b></td>
                            </tr>
                            <tr style="font-size:14px">
                            <td align="left" class="blue--text"  width="150px">{{congregacion}}</td>
                            </tr>
                        <br>
                        <tr></tr>
                        <tr></tr>
                        <tr></tr>
                        <tr id="valores">
                            <td align="center"><b> INGRESOS </b></td>
                            <td align="center" ><b> EGRESOS </b></td>
                            <td align="center"><b> SALDO </b></td>
                        </tr>
                        <tr id="valores" style="font-size:14px">
                        <td align="center"  class="white--text"  width="150px">${{totalingreso}}</td>
                        <td align="center" class="white--text"  width="150px">${{totalegreso}}</td>
                        <td align="center" class="white--text"  width="150px">${{totalingreso-totalegreso}}</td>
                        </tr>
                            </table>
                    </div>
                </header>
                <section>
                    <div>
                        <table id="facarticulo">
                            <thead>
                            <tr id="fa">
                                <th>FECHA</th>
                                <th>CONCEPTO</th>
                                <th>DESCRIPCION</th>
                                <th>CANTIDAD</th>
                                
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(val,index) in info" :key="index">
                                    <td id="cssfecha" style="text-align:center;">{{formatearFecha(val.fecha)}}</td>
                                    <td style="text-align:center;">{{(val.concepto).toUpperCase()}}</td>
                                    <td style="text-align:center;" v-if="val.concepto=='ingreso'">{{(val.concepto).toUpperCase()}}</td>
                                    <td style="text-align:center;" class="red--text" v-else>{{(val.descripcion).toUpperCase()}}</td>
                                    <td style="text-align:center;" v-if="val.concepto=='ingreso'">
                                    <span>Ofrendas:${{val.ofrenda}}</span>
                                    <br>
                                    <span>Diezmos:${{val.diezmos}}</span></td>
                                    <td style="text-align:center;" class="red--text" v-else>${{val.egreso}}</td>
                                </tr>
                              
                            </tbody>
                            <tfoot>
                            <tr></tr>
                            <tr></tr>
                            <tr></tr>
                            <tr></tr>
                            </tfoot>
                        </table>
                    
                    </div>
                </section>
                <footer>

                </footer>
            </div>
             <v-flex xs12 sm3 md3 lg2 xl2>
              <v-btn
              color="primary"
              @click="nuevaconsulta()"
              >Nueva consulta</v-btn>
            </v-flex>
           </v-container>
            
        </v-flex>

   </v-layout>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import moment, { now } from "moment";
export default {
    data(){
        return{
            balances:[{text:"Balance diario",value:1}],
            balance:"",
            fechaFin:"",
            fechaInicio:"",
            modalCalendario2: false,
            modalCalendario1:false,
            generar:0,
            info:[],
            totalingreso:0,
            totalegreso:0,
            totalsaldo:0,
            congregacion:""
            
        }
    },
     methods: {
          formatearFecha(value) {
            if (value) {
                return moment(String(value)).format("DD/MM/YYYY");
            }
            },  
        generarR(){
            let me = this
            let header = { Token: this.$store.state.token };
            let configuracion = { headers: header };
            this.generar=1
            var fechainicial = moment(this.fechaInicio+' 07:00:00');
            var fechafinal = moment(this.fechaFin+'  23:59:59');
            let fi = new Date(fechainicial)
            let ff = new Date(fechafinal) 
            let codigoCongregacion= this.$store.state.usuario.codigoCongregacion
            
            if(this.balance==1){
                if(codigoCongregacion==undefined){

                }else{

                    axios
                    .get("balance/balanceporfecha?codigoCongregacion="+codigoCongregacion+
                    "&fechainicio=" +
                        fi.toISOString() +
                        "&fechafin=" +
                        ff.toISOString()
                        , configuracion)
                    .then(function (response) {
                       let mov = response.data[0];
                       let to = response.data[1];
                        
                        let valorIngresos=0
                        for (const i in mov) {
                            if (Object.hasOwnProperty.call(mov, i)) {
                                const element = mov[i];
                               
                               me.info=element 
                              element.forEach(x => {
                                
                                  if(x.concepto=='ingreso'){
                                    me.totalingreso+=parseFloat(x.diezmos)+parseFloat(x.ofrenda)
                                  }
                                  if(x.concepto=='egreso'){
                                       me.totalegreso=parseFloat(x.egreso)
                                  }
                                  
                              });
                            }
                        }
                        for (const i in to) {
                            if (Object.hasOwnProperty.call(to, i)) {
                                const element = to[i];
                                // me.totalingreso=element.ingresosTotal
                                // me.totalegreso=element.egresosTotal
                                // me.totalsaldo=element.saldo
                                me.congregacion=element.congregacion
                            }
                        }
                      
                    })
                    .catch(function (error) {
                     console.log(error);
                    });
                }
                
            }
        },
        nuevaconsulta(){
            this.generar=0
        }
     }
}
</script>
<style>
    #factura {
        padding: 20px;
        font-family: Arial, sans-serif;
        font-size: 16px;
    }

    #logo {
        border-radius: 15px;
        float: left;
        width: 45%;
    }
    #imagen {
        display: block;
        margin-left: 5%;
        width: 340px;
    }

    #fact {
        font-size: 18px;
        font-weight: bold;
        text-align: left;
    }

    #datos {
        border-style: solid;
        border-width: 1px;

        width: 97%;
    }

    #encabezado {
        text-align: left;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 12px;
    }

    section {
        clear: left;
    }

    #cliente {
        text-align: left;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 12px;
    }

    #facliente {
        margin-top: 1%;
        border-style: solid;
        border-width: 1px;
        width: 97%;
        border-collapse: collapse;
        border-spacing: 0px;
        margin-bottom: 1px;
    }

    #fa {
        color: #ffffff;
        font-size: 14px;
    }

    #valores {
        background: gray;
        font-size: 14px;
        border-color: gray;
    }

    #facarticulo {
        width: 97%;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 20px;
        margin-bottom: 15px;
    }

    #facarticulo thead {
        padding: 20px;
        background: blue;
        text-align: center;
        border-bottom: 1px solid #ffffff;
    }
    #cccantidad{
        background: rgb(236, 252, 178); 
    }
    #cssfecha{
        background: rgb(109, 183, 252);
    }
    #gracias {
        text-align: center;
    }

    #compro {
        padding: 20px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        text-align: center;
    }

    #fact1 {
        font-size: 14px;
        font-weight: bold;
        text-align: left;
        width: 90%;
    }

    #datos1 {
        width: 90%;
    }

    #encabezado1 {
        text-align: left;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 12px;
        width: 90%;
    }

    section {
        clear: left;
    }

    #cliente1 {
        text-align: left;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 12px;
    }

    #facliente1 {
        width: 90%;
        border-collapse: collapse;
        border-spacing: 0px;
    }

    #fa1 {
        color: black;
        font-size: 14px;
    }

    #facarticulo1 {
        width: 90%;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 20px;
    }

    #facarticulo1 thead {
        padding: 20px;
        background: white;
        text-align: center;
        border-bottom: 1px solid #ffffff;
    }

    #gracias1 {
        margin-left: 1%;
        text-align: left;
    }
</style>