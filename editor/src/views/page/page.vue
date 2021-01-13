<template>
  <div id="create">

    <v-container fluid>
      <v-container v-if="addingParagraph">
        <v-row>
          <v-col>
            <v-textarea label="New Paragraph" v-model="paragraph"></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="addParagraph()">
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="addingImage">
        <v-row>
          <v-col>
            <v-text-field label="New image" v-model="image"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="addImage()">
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="addingChoice">
        <v-row>
          <v-col>
            <v-text-field label="Choice description" v-model="choiceText"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-radio-group v-model="targetPageGroup">
              <v-radio label="Existing page">
              </v-radio>
              <v-combobox label="Pages" v-model="selectedTargetPage" :items="bookPages">
              </v-combobox>

              <v-radio label="New Page">
              </v-radio>
              <v-text-field v-model="newPageTitle" label="Title"></v-text-field>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="addChoice()">
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-row>
        <v-col>
          <v-text-field label="Title" v-model="title"></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="updatePageTitle()">
            Guardar Titulo
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-label>
            Items
          </v-label>
        </v-col>
      </v-row>

      <v-container>
        <v-row v-for="item in items" :key="item.id">
          <v-col>
            <p>
              {{item.value}}
            </p>
          </v-col>
          <v-col>
            <v-btn color="red" outlined>
              Eliminar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-row>
        <v-col>
          <v-label>
            Choices
          </v-label>
        </v-col>
      </v-row>

      <v-container>
        <v-row v-for="choice in choices" :key="choice.id">
          <v-col>
            {{choice.value}}
          </v-col>
          <v-col>
            {{choice.targetPage}}
          </v-col>
          <v-col>
            {{choice.targetPageTitle}}
          </v-col>
          <v-col>
            <v-btn color="red" outlined @click="deletePageChoice(choice)">
              Eliminar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-speed-dial
            v-model="fab"
            :bottom="true"
            :right="true"
            direction="top"
            :open-on-hover="false"
            transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
                v-model="fab"
                color="blue darken-2"
                dark
                fab
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-btn>
      </template>

      <v-btn
              fab
              dark
              small
              color="green"
              @click="showAddChoice()"
      >
        <v-icon>mdi-family-tree</v-icon>
      </v-btn>
      <v-btn
              fab
              dark
              small
              color="indigo"
              @click="showAddImage()"
      >
        <v-icon>mdi-image</v-icon>
      </v-btn>

      <v-btn
              fab
              dark
              small
              color="red"
              @click="showAddParagraph()"
      >
        <v-icon>mdi-text-subject</v-icon>
      </v-btn>
    </v-speed-dial>

  </div>
</template>

<script>
  export default {
    name: 'NewBook',

    data: () => ({
      addingParagraph: false,
      addingImage: false,
      addingChoice: false,
      paragraph: '',
      image: '',
      choiceText: '',
      fab: false,
      targetPageGroup: 0,
      selectedTargetPage: 0,
      newPageTitle: '',
      title: ''
    }),
    created() {
      const vm = this;
      const data = {
        bookId: this.$route.params.bookId,
        pageId: this.$route.params.pageId
      };
      this.$store.dispatch('loadPage', data).then(function(data) {
        vm.title = data.title;
      });
      this.$store.dispatch('loadBookPages', this.$route.params.bookId)
    },
    methods: {
      showAddParagraph() {
        this.addingChoice = false;
        this.addingImage = false;
        this.addingParagraph = true;
      },
      showAddImage() {
        this.addingChoice = false;
        this.addingImage = true;
        this.addingParagraph = false;
      },
      showAddChoice() {
        this.addingChoice = true;
        this.addingImage = false;
        this.addingParagraph = false;
      },
      addParagraph() {
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          item_type: 1,
          value: this.paragraph
        };
        this.$store.dispatch('addPageItem', data);
      },
      updatePageTitle() {
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          title: this.title
        };
        this.$store.dispatch('updatePageTitle', data);
      },
      deletePageChoice(choice) {
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          choiceId: choice.id
        };
        this.$store.dispatch('deleteChoice', data);
      },
      addImage() {
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          item_type: 2,
          value: this.image
        };
        this.$store.dispatch('addPageItem', data);
      },
      addChoice() {
        let targetPage = 0;
        // existing page
        if (this.targetPageGroup === 0) {
          targetPage = this.selectedTargetPage.value;
        }

        // new page
        if (this.targetPageGroup === 1) {
          targetPage = 0;
        }

        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          sort_index: 1,
          value: this.choiceText,
          target_page: targetPage,
          target_page_title: this.newPageTitle,
          targetPageTitle: this.newPageTitle
        };
        this.$store.dispatch('addPageChoice', data);
      }
    },
    computed: {
      items() {
        if (this.$store.state.currentPage === undefined) {
          return [];
        }
        return this.$store.state.currentPage.items;
      },
      choices() {
        if (this.$store.state.currentPage === undefined)
          return [];
        return this.$store.state.currentPage.choices;
      },
      book() {
        return this.$store.state.currentBook();
      },
      bookPages() {
        return this.$store.state.currentBookPages.map(item => {
          return {
            value: item.id,
            text: item.title
          }
        });
      }
    }
  }
</script>

<style>
  /* This is for documentation purposes and will not be needed in your application */
  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
</style>
