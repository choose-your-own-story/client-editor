<template>
  <v-container>

    <v-text-field label="Buscar"></v-text-field>

    <v-row v-for="book in library" :key="book.id">
      <v-col>
        <v-card>
          <v-card-text class="title">
            {{book.title}}
          </v-card-text>
          <v-row>
            <v-col align="center">
              <v-img :src="book.cover" max-width="200" max-height="300"></v-img>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn :to="editLink(book)">
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
  export default {
    name: 'NewBook',

    data: () => ({
      notifications: [
        {
          id: 1,
          text: 'hola, quisiera pedir permiso para clonar tu libro',
          sender: {
            name: 'Agustin'
          },
          target: {
            id: 1,
            title: 'la atlantida',
            link: '/book/1'
          },
          action: 1
        }
      ]
    }),
    created() {
      this.$store.dispatch('loadUserBooks');
    },
    methods: {
      editLink(book) {
        return `/book/${book.id}`;
      },
      deleteBook(book) {
        this.$store.dispatch('deleteBook', book);
      }
    },
    computed: {
      library() {
        return this.$store.state.userLibrary;
      }
    }
  }
</script>
