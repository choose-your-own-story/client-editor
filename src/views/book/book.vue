<template>
  <v-container>
    <v-row>
      <v-col cols="3">

      </v-col>

      <v-col>
        <v-row>
          <v-col>
            <v-btn @click="gotoCover()">
              Cover
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="gotoPages()">
              Pages
            </v-btn>
          </v-col>
        </v-row>


        <v-row>
          <v-col>
            <v-btn color="secondary" to="/">
              Go Back Main Page
            </v-btn>
          </v-col>

          <v-col>
            <v-btn color="red" @click="deleteBook()">
              Delete Book
            </v-btn>
          </v-col>
        </v-row>

      </v-col>

      <v-col cols="3">

      </v-col>
    </v-row>

    <v-snackbar
            v-model="snackbar"
    >
      {{ errorMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
                color="red"
                text
                v-bind="attrs"
                @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  export default {
    name: 'NewBook',

    data: () => ({
      errorMessage: '',
      snackbar: false,
      title: '',
      description: '',
      cover: '',
      fileModel: [],
      addedUrl: '',
      rules: [
        //value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
    }),
    created() {
      console.log('created')
      this.$store.commit('emptyCurrentBookPages');
      const bookId = this.$route.params.id;
      const vm = this;
      if (bookId === 'new') {

        return;
      }

      this.$store.dispatch('loadBook', bookId).then(function(loadedBook) {
        vm.title = loadedBook.title;
        vm.description = loadedBook.description;
        vm.cover = loadedBook.cover;
        vm.addedUrl = vm.cover;
      });

      console.log('limpiando los anteriores');
      this.$store.dispatch('loadBookPages', bookId);
    },
    methods: {
      gotoCover: function() {
        const vm = this;

        this.$router.push({
          name: 'Cover',
          params: {
            id: vm.$route.params.id
          }
        })
      },
      gotoPages: function() {
        const vm = this;

        this.$router.push({
          name: 'Pages',
          params: {
            id: vm.$route.params.id
          }
        })
      },
      handleFileUpload: function() {
        let vm = this;
        if ((this.fileModel !== undefined) && (this.fileModel.name.length > 0)) {
          this.$store.dispatch('uploadImageBusiness', this.fileModel).then(function (newUrl) {
            vm.addedUrl = newUrl
          });
        }
      },
      deleteBook() {
        let vm = this;
        this.$store.dispatch('deleteBook', {id: this.$route.params.id}).then(function() {
          vm.$router.push({name: 'Library'})
        })
      },
      addBook() {
        const data = {
          title: this.title,
          cover: this.addedUrl,
          description: this.description,
          id: this.book.id
        };

        if (this.book.id === undefined) {
          this.$store.dispatch('addBook', data);
        }
        else {
          this.$store.dispatch('updateBook', data);
        }
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
      deletePage(page) {
        const data = {
          bookId: this.book.id,
          pageId: page.id
        };

        this.$store.dispatch('deletePage', data);
      },
      buildEditLink(page) {
        return `/book/${this.book.id}/page/${page.id}`;
      }
    },
    computed: {
      book() {
        return this.$store.state.currentBook;
      },
      pages() {
        return this.$store.state.currentBookPages;
      }
    }
  }
</script>
