<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="title" label="Titulo"></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-textarea v-model="description" label="Description"></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-file-input
                v-model="fileModel"
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon="mdi-camera"
                label="Imagen"
                @change="handleFileUpload()"
        />
        <v-label>{{addedUrl}}</v-label>
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

      <v-col>
        <v-btn color="primary" @click="addBook()">
          Guardar
        </v-btn>
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
      handleFileUpload: function() {
        let vm = this;
        if ((this.fileModel !== undefined) && (this.fileModel.name.length > 0)) {
          this.$store.dispatch('uploadImageBusiness', this.fileModel).then(function (newUrl) {
            vm.addedUrl = newUrl
          });
        }
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
      }
    },
    computed: {
      book() {
        return this.$store.state.currentBook;
      }
    }
  }
</script>
