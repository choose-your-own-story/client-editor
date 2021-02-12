<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="addPage()">
          Agreagar Pagina
        </v-btn>

        <v-list>
          <v-list-item v-for="item in pages" :key="item.id">
            <v-list-item-action>
              {{item.title}}
            </v-list-item-action>

            <v-list-item-action>
              <v-btn :to="buildEditLink(item)">
                Editar
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn @click="deletePage(item)">
                Eliminar
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
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
  export default {
    name: 'NewBook',

    data: () => ({
      errorMessage: '',
      snackbar: false
    }),
    created() {
      console.log('created');
      this.$store.commit('emptyCurrentBookPages');
      const bookId = this.$route.params.id;
      const vm = this;

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
