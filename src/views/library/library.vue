<template>
  <v-container>

    <v-text-field label="Buscar" v-model="filterText"></v-text-field>

    <v-row v-for="book in library" :key="book.id">
      <v-col>
        <v-card>
          <v-card-text class="title">
            {{book.title}}
          </v-card-text>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-img :src="book.cover" max-width="200" max-height="300"></v-img>
              </v-col>
              <v-col>
                <span>
                  <p>
                    Likes: {{book.likes}}
                  </p>
                  <p>
                    Reads: {{book.reads}}
                  </p>
                  <p>
                    Active: {{book.active === 1? 'Activo' : 'No activo'}}
                  </p>
                </span>
              </v-col>

            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :to="editLink(book)" outlined color="primary">
              Edit
            </v-btn>
            <v-btn color="red" outlined @click="deleteBook(book)">
              Delete
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
      filterText: ''
    }),
    created() {
      this.$store.dispatch('loadUserBooks');
    },
    methods: {
      editLink(book) {
        return `/book/${book.id}`;
      },
      deleteBook(book) {
        const data = {
          id: book.id
        };
        this.$store.dispatch('deleteBook', data);
      }
    },
    computed: {
      library() {
        const allBooks = this.$store.state.userLibrary;
        console.log(`filtrando por ${this.filterText}`)
        if (this.filterText === '') {
          return allBooks;
        }
        return allBooks.filter(item => item.title.includes(this.filterText));
      }
    }
  }
</script>
