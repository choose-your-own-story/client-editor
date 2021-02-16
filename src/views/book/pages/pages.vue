<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="addPage()">
          Agreagar Pagina
        </v-btn>

        <v-container>
          <v-row v-for="item in pages" :key="item.id">
            <v-col cols="6">
              <strong>
                <p>
                  {{item.title}}
                </p>
              </strong>

              <p>
                Items: {{item.items_count}}
              </p>
              <p>
                Choices: {{item.choices.length}}
              </p>

            </v-col>

            <v-col cols="3">
              <v-btn :to="buildEditLink(item.id)" color="primary" outlined>
                Editar
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn @click="deletePage(item.id)" color="red" outlined>
                Eliminar
              </v-btn>
            </v-col>
          </v-row>

        </v-container>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn @click="arrange()">
          Draw conceptual map
        </v-btn>
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
          <v-btn :to="buildEditLink(currentNodeId)" color="primary" outlined>
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

<script>
  import config from "./example-config";

  export default {
    name: 'NewBook',

    data: () => ({
      errorMessage: '',
      snackbar: false,
      config,
      currentNodeId: undefined,
      currentNodeTitle: undefined,
      drawed: false
    }),
    created() {
      this.$store.commit('emptyCurrentBookPages');
      const bookId = this.$route.params.id;
      const vm = this;

      this.$store.dispatch('loadBook', bookId).then(function(loadedBook) {
        vm.title = loadedBook.title;
        vm.description = loadedBook.description;
        vm.cover = loadedBook.cover;
        vm.addedUrl = vm.cover;
      });

      this.$store.dispatch('loadBookPages', bookId);
    },
    watch: {
      elements: async function(val) {
        const vm = this;

        this.$nextTick(() => {
          if (vm.elements > 0) {
            vm.arrange();
          }
        });
      }
    },
    methods: {
      addPage() {
        const vm = this;

        if (this.book.id === undefined) {
          this.errorMessage = 'Hay que guardar el libro antes de agregar una pagina';
          this.snackbar = true;
          return;
        }

        const lenPages = this.pages.length;
        let pageType = 0;
        if (lenPages > 0)
          pageType = 1;
        const data = {
          bookId: this.book.id,
          page_type: pageType
        };

        this.$store.dispatch('addPage', data);
      },
      deletePage(pageId) {
        const data = {
          bookId: this.book.id,
          pageId: pageId
        };

        this.$store.dispatch('deletePage', data);
      },
      buildEditLink(pageId) {
        return `/book/${this.book.id}/page/${pageId}`;
      },

      deleteNode(id) {
        this.currentNodeId = id.target[0]._private.data.id;
        this.currentNodeTitle = id.target[0]._private.data.title;
      },
      updateNode(event) {
      },
      afterCreated(cy) {
        // cy: this is the cytoscape instance
        this.cy = cy;
      },
      arrange() {
        let options = {
          name: 'breadthfirst',

          fit: true, // whether to fit the viewport to the graph
          directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
          padding: 30, // padding on fit
          circle: false, // put depths in concentric circles if true, put depths top down if false
          grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
          spacingFactor: 1, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
          boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
          avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
          nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
          roots: undefined, // the roots of the trees
          maximal: true, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
          animate: true, // whether to transition the node positions
          animationDuration: 500, // duration of animation in ms if enabled
          animationEasing: undefined, // easing of animation if enabled,
          animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
          ready: function() {
          }, // callback on layoutready
          stop: function() {
          }, // callback on layoutstop
          transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
        };

        this.cy.layout( options ).run();
      }
    },
    computed: {
      book() {
        return this.$store.state.currentBook;
      },
      pages() {
        return this.$store.state.currentBookPages;
      },
      elements() {
        let nodes = [];

        this.pages.forEach(function(item) {
          let color = 'red';
          if ((item.recive_count) &&  (parseInt(item.recive_count) === 0))
            color = 'blue';
          else {
            if (item.choices) {
              if (item.choices.length > 0) {
                color = 'yellow'
              }
            }
          }

          if ((item.items_count === undefined ) || (parseInt(item.items_count) === 0)) {
            color  = `dark${color}`;
          }


          nodes.push({
            data: {
              id: parseInt(item.id),
              label: `${item.title}`,
              title: item.title,
              classes: 'multiline-manual',
              color: color
            },
            group: 'nodes'
          });
        });

        let counter = 0;
        this.pages.forEach(function(item) {
          if (item.choices === undefined)
            return;

          item.choices.forEach(function(choice) {
            nodes.push({
              data: {
                id: counter,
                source: parseInt(choice.idPage),
                target: parseInt(choice.idTargetPage),
                label: choice.text, //.substring(0, 20),
                classes: 'autorotate'
              },
              group: 'edges'
            });

            counter -= 1;
          })
        });

        return nodes;
      }
    }
  }
</script>
