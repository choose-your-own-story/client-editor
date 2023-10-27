import go from "gojs"

export default {
  name: 'NewBook',

  data: () => ({
    errorMessage: '',
    snackbar: false,
    currentNodeId: undefined,
    currentNodeTitle: undefined,
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
    pato1(eventData) {
      console.log('pato1');
      console.log(eventData)
      this.hideCX();
    },
    // A custom command, for changing the color of the selected node(s).
    changeColor(diagram, color) {
    // Always make changes in a transaction, except when initializing the diagram.
    diagram.startTransaction("change color");
    diagram.selection.each(node => {
      if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
        // Examine and modify the data, not the Node directly.
        var data = node.data;
        // Call setDataProperty to support undo/redo as well as
        // automatically evaluating any relevant bindings.
        diagram.model.setDataProperty(data, "color", color);
      }
    });
    diagram.commitTransaction("change color");
  },

    cxcommand(event, val) {
      console.log('aja!')
      if (val === undefined) val = event.currentTarget.id;
      var diagram = myDiagram;
      switch (val) {
        case "cut": diagram.commandHandler.cutSelection(); break;
        case "copy": diagram.commandHandler.copySelection(); break;
        case "paste": diagram.commandHandler.pasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint); break;
        case "delete": diagram.commandHandler.deleteSelection(); break;
        case "color": {
          var color = window.getComputedStyle(event.target)['background-color'];
          changeColor(diagram, color); break;
        }
      }
      diagram.currentTool.stopTool();
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
      const data = {
        bookId: this.book.id,
        pageId: pageId
      };

      this.$store.dispatch('deletePage', data);
    },
    gotoEditLink(pageId) {
      this.$router.push(`/book/${this.book.id}/page/${pageId}`);
    },
    afterCreated(cy) {
      // cy: this is the cytoscape instance
      this.cy = cy;
    },

    hideCX() {
      if (this.myDiagram.currentTool instanceof go.ContextMenuTool) {
        this.myDiagram.currentTool.doCancel();
      }
    },
    arrange() {

      var vm = this;

      console.log('drawing...')

      if (this.myDiagram !== null)
        return;

        // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
        // For details, see https://gojs.net/latest/intro/buildingObjects.html
        const $ = go.GraphObject.make;  // for conciseness in defining templates

        let myDiagram =
            new go.Diagram("myDiagramDiv",  // create a Diagram for the DIV HTML element
                {
                  "undoManager.isEnabled": true
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
          var cmd = diagram.commandHandler;
          var hasMenuItem = false;
          function maybeShowItem(elt, pred) {
            if (pred) {
              elt.style.display = "block";
              hasMenuItem = true;
            } else {
              elt.style.display = "none";
            }
          }
          maybeShowItem(document.getElementById("cut"), true);
          maybeShowItem(document.getElementById("copy"), true);
          maybeShowItem(document.getElementById("paste"), true);
          maybeShowItem(document.getElementById("delete"), true);
          maybeShowItem(document.getElementById("color"), obj !== null);

          // Now show the whole context menu element
          if (hasMenuItem) {
            cxElement.classList.add("show-menu");
            // we don't bother overriding positionContextMenu, we just do it here:
            var mousePt = diagram.lastInput.viewPoint;
            cxElement.style.left = mousePt.x + 5 + "px";
            cxElement.style.top = mousePt.y + "px";
          }

          // Optional: Use a `window` pointerdown listener with event capture to
          //           remove the context menu if the user clicks elsewhere on the page
          //window.addEventListener("pointerdown", hideCX, true);
        }

        function hideContextMenu() {
          cxElement.classList.remove("show-menu");
          // Optional: Use a `window` pointerdown listener with event capture to
          //           remove the context menu if the user clicks elsewhere on the page
          // window.removeEventListener("pointerdown", vm.hideCX, true);
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
          if (item.id === choice.id)
            return;

          edges.push({
            from: item.id,
            to: choice.id
          });

          counter -= 1;
        })
      });

      return {
        nodes: nodes,
        edges: edges
      };
    }
  }
}
