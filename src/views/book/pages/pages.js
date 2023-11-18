import go from "gojs"

class DemoForceDirectedLayout extends go.ForceDirectedLayout {
  // Override the makeNetwork method to also initialize
  // ForceDirectedVertex.isFixed from the corresponding Node.isSelected.
  makeNetwork(coll) {
    // call base method for standard behavior
    const net = super.makeNetwork(coll);
    net.vertexes.each(vertex => {
      const node = vertex.node;
      if (node !== null) vertex.isFixed = node.isSelected;
    });
    return net;
  }
}

export default {
  name: 'NewBook',

  data: () => ({
    errorMessage: '',
    snackbar: false,
    currentNodeId: undefined,
    currentNodeTitle: undefined,
    currentSelectedPageInGraph: -1,
    drawed: false,
    pageHeaders: [
      {
        text: 'Title',
        align: 'start',
        sortable: true,
        value: 'title',
      },
      {
        text: 'Items',
        align: 'start',
        sortable: true,
        value: 'items_count',
      },
      {
        text: 'Choices',
        align: 'start',
        sortable: true,
        value: 'choices.length',
      },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    myDiagram: null
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

    this.$store.dispatch('loadBookPages', bookId).then(data => this.arrange());
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
    editBookPage(eventData) {
      this.hideCX();
      this.gotoEditLink(this.currentSelectedPageInGraph);
    },
    deleteBookPage(eventData) {
      this.hideCX();
      this.deletePage(this.currentSelectedPageInGraph);
    },
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
      const vm = this;
      const data = {
        bookId: this.book.id,
        pageId: pageId
      };

      this.$store.dispatch('deletePage', data).then(
          () => {
            console.log('loading again');

            this.$store.dispatch('loadBookPages', vm.book.id).then(data2 => this.arrange())
          }
      );
    },
    gotoEditLink(pageId) {
      this.$router.push(`/book/${this.book.id}/page/${pageId}`);
    },
    hideCX() {
      if (this.myDiagram.currentTool instanceof go.ContextMenuTool) {
        this.myDiagram.currentTool.doCancel();
      }
    },
    arrange() {
      var vm = this;

      if (this.myDiagram !== null)
        return;

      // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
      // For details, see https://gojs.net/latest/intro/buildingObjects.html
      const $ = go.GraphObject.make;  // for conciseness in defining templates

      let myDiagram =
          new go.Diagram("myDiagramDiv",  // create a Diagram for the DIV HTML element
              {
                "undoManager.isEnabled": true,
                // layout: $(go.TreeLayout, { angle: 90, nodeSpacing: 10, layerSpacing: 30 })
                // layout: new DemoForceDirectedLayout()
                layout: $(go.LayeredDigraphLayout, { alignOption: go.LayeredDigraphLayout.AlignAll })
                // layout: $(go.CircularLayout)

              });

      this.myDiagram = myDiagram;

      // This is the actual HTML context menu:
      var cxElement = document.getElementById("contextMenu");

      // an HTMLInfo object is needed to invoke the code to set up the HTML cxElement
      var myContextMenu = $(go.HTMLInfo, {
        show: showContextMenu,
        hide: hideContextMenu
      });

      // define a simple Node template (but use the default Link template)
      myDiagram.nodeTemplate =
          $(go.Node, "Auto",
              { contextMenu: myContextMenu },

              $(go.Shape, "RoundedRectangle",
                  // Shape.fill is bound to Node.data.color
                  new go.Binding("fill", "color")),
              $(go.TextBlock,
                  { font: "bold small-caps 11pt helvetica, bold arial, sans-serif", margin: 7, stroke: "rgba(0, 0, 0, .87)" },  // some room around the text
                  // TextBlock.text is bound to Node.data.key
                  new go.Binding("text", "title"))
          );

      // create the model data that will be represented by Nodes and Links
      let booksData = this.elements;

      myDiagram.model = new go.GraphLinksModel(
          booksData.nodes, booksData.edges
      );

      myDiagram.contextMenu = myContextMenu;

      // We don't want the div acting as a context menu to have a (browser) context menu!
      cxElement.addEventListener("contextmenu", e => {
        e.preventDefault();
        return false;
      }, false);


      function showContextMenu(obj, diagram, tool) {
        // Show only the relevant buttons given the current state.
        // selected book page: obj.key
        vm.currentSelectedPageInGraph = obj.key;

        var hasMenuItem = false;
        function maybeShowItem(elt, pred) {
          if (pred) {
            elt.style.display = "block";
            hasMenuItem = true;
          } else {
            elt.style.display = "none";
          }
        }
        maybeShowItem(document.getElementById("edit"), true);
        maybeShowItem(document.getElementById("delete"), true);

        // Now show the whole context menu element
        if (hasMenuItem) {
          cxElement.classList.add("show-menu");
          // we don't bother overriding positionContextMenu, we just do it here:
          var mousePt = diagram.lastInput.viewPoint;
          cxElement.style.left = mousePt.x + 5 + "px";
          cxElement.style.top = mousePt.y + "px";
        }
      }

      function hideContextMenu() {
        cxElement.classList.remove("show-menu");
      }
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
          key: parseInt(item.id),
          bookData: item,
          label: `${item.title}`,
          title: item.title,
          classes: 'multiline-manual',
          color: color
        });
      });

      let edges = [];

      let counter = 0;
      this.pages.forEach(function(item) {
        if (item.choices === undefined)
          return;

        item.choices.forEach(function(choice) {
          edges.push({
            from: item.id,
            to: choice.idTargetPage
          });

          counter -= 1;
        })
      });


      let a = {
        nodes: nodes,
        edges: edges
      };

      return a;
    }
  }
}
