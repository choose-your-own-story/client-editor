<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
                :headers="pageHeaders"
                :items="pages"
                :items-per-page="5"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Paginas</v-toolbar-title>
              <v-divider
                      class="mx-4"
                      inset
                      vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="addPage()">
                Agreagar Pagina
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="gotoEditLink(item.id)" color="orange">mdi-pencil</v-icon>
            <v-icon class="mr-2" @click="deletePage(item.id)" color="red">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-badge
                color="blue"
                bottom
        >
          Initial Page
        </v-badge>
      </v-col>
      <v-col>
        <v-badge
                color="yellow"
                bottom
        >
          Mid Page
        </v-badge>
      </v-col>
      <v-col>
        <v-badge
                color="red"
                bottom
        >
          End Page
        </v-badge>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>
          <p>
            If the color is dark, then the page is empty
          </p>
        </span>
      </v-col>
    </v-row>

    <v-row>
      <v-col>

      </v-col>
    </v-row>

    <v-row>
      <v-col>

      </v-col>
    </v-row>


    <div style="width: 80%; background-color: lightyellow">
      <cytoscape
              ref="cyRef"
              :config="config"
              v-on:cxttapstart="updateNode"
              :afterCreated="afterCreated"
      >
        <cy-element
                v-for="def in elements"
                :key="`${def.data.id}`"
                :definition="def"
                v-on:mousedown="deleteNode($event, def.data.id)"
        />
      </cytoscape>
    </div>

    <v-row>
      <v-col>
        <v-btn @click="arrange()">
          Redraw conceptual map
        </v-btn>
      </v-col>
    </v-row>


    <v-row>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
    </v-row>

    <div v-if="currentNodeId !== undefined">
      <v-row>
        <v-col>
          <label>
            Pagina Seleccionada: {{currentNodeTitle}}
          </label>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="gotoEditLink(currentNodeId)" color="primary" outlined>
            Editar
          </v-btn>
        </v-col>
        <v-col>
          <v-btn @click="deletePage(currentNodeId)" color="red" outlined>
            Eliminar
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-row>
      <v-col>

      </v-col>
    </v-row>

    <v-row>
      <v-col>

      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn color="secondary" :to="`/book/${this.$route.params.id}`">
          Volver
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./pages.js"></script>
