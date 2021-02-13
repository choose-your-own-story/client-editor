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
      <v-col align="center">
        <v-img :src="addedUrl" max-width="200">
        </v-img>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select label="Genre" v-model="selectedGenre" :items="genres">
        </v-select>
      </v-col>
      <v-col>
        <v-select label="Sub Genre" v-model="selectedSubGenre" :items="genreSubGenres">
        </v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-checkbox label="Libro terminado. Seleccionar esta opcion para que aparezca en la libreria." v-model="active">
        </v-checkbox>
      </v-col>
    </v-row>

    <v-row>
      <v-col>

      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn color="secondary" @click="gotoBack()">
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
      active: 0,
      rules: [
        //value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      selectedGenre: undefined,
      selectedSubGenre: undefined
    }),
    created() {
      this.$store.commit('emptyCurrentBookPages');
      const bookId = this.$route.params.id;
      const vm = this;

      this.$store.dispatch('loadBook', bookId).then(function(loadedBook) {
        vm.title = loadedBook.title;
        vm.description = loadedBook.description;
        vm.cover = loadedBook.cover;
        vm.addedUrl = loadedBook.cover;
        vm.selectedGenre = loadedBook.idGenre;
        vm.selectedSubGenre = loadedBook.idSubGenre;
        vm.active = loadedBook.active;
      });
      this.$store.dispatch('loadBookPages', bookId);
      this.$store.dispatch('loadGenres');
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
          idGenre: this.selectedGenre === ' '? undefined : this.selectedGenre,
          idSubGenre: this.selectedSubGenre === ' ' ? undefined : this.selectedSubGenre,
          id: this.book.id,
          active: this.active ? 1 : 0
        };

        const vm = this;

        let callback = undefined;
        if (this.book.id === undefined) {
          callback = this.$store.dispatch('addBook', data);
        } else {
          callback = this.$store.dispatch('updateBook', data);
        }
        callback.then(function () {
          vm.gotoBack();
        })
      },
      gotoBack() {
        this.$router.push({
          name: 'Book',
          params: {
            id: this.$route.params.id
          }
        })
      }
    },
    computed: {
      book() {
        return this.$store.state.currentBook;
      },
      genres() {
        const values = this.$store.state.genres
                .filter(item => item.idParent === undefined || item.idParent === null)
                .map(function(item) {
                  return {text: item.name, value: item.id}
                });
        values.push({text: ' ', value: undefined});
        return values;
      },
      genreSubGenres() {
        console.log(this.selectedGenre);
        if (this.selectedGenre === undefined)
          return [];
        const vm = this;

        const values = this.$store.state.genres
                .filter(item => parseInt(item.idParent) === parseInt(vm.selectedGenre))
                .map(function(item) {
                  return {text: item.name, value: item.id}
                });
        values.push({text: ' ', value: undefined});
        return values;
      }
    }
  }
</script>
