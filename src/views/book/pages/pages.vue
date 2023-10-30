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
      <div style="position: relative;"  >
        <div id="myDiagramDiv" style="border: solid 1px black; width:400px; height:400px"></div>

        <ul id="contextMenu" class="menu">
          <li id="edit" class="menu-item" @click="editBookPage()">Edit</li>
          <li id="delete" class="menu-item" @click="deleteBookPage()">Delete</li>
        </ul>
      </div>

    </v-row>

    <v-row>
      <v-col></v-col>
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
<style>
  /* CSS for the traditional context menu */
  .menu {
    display: none;
    position: absolute;
    opacity: 0;
    margin: 0;
    padding: 8px 0;
    z-index: 999;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
    list-style: none;
    background-color: #ffffff;
    border-radius: 4px;
  }

  .menu-item {
    display: block;
    position: relative;
    min-width: 60px;
    margin: 0;
    padding: 6px 16px;
    font: bold 12px sans-serif;
    color: rgba(0, 0, 0, .87);
    cursor: pointer;
  }

  .menu-item::before {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #000000;
  }

  .menu-item:hover::before {
    opacity: .04;
  }

  .menu .menu {
    top: -8px;
    left: 100%;
  }

  .show-menu, .menu-item:hover > .menu {
    display: block;
    opacity: 1;
  }
</style>
