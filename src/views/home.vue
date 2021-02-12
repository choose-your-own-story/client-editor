<template>
  <v-container>

    <v-row class="text-center" v-if="isAuthenticated">
      <v-col>
        <v-btn @click="addNewBook()">
          Add new book
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="text-center" v-if="isAuthenticated">
      <v-col>
        <v-btn @click="gotoLibrary()">
          My Books
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="text-center" v-if="!isAuthenticated">
      <v-col>
        <span>
          <v-label>
            Debes loguearte para poder crear libros
          </v-label>
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
    }),
    methods: {
      addNewBook() {
        const data = {
          title: 'new book',
          cover: '',
          description: 'no cool description yet!'
        };

        const vm = this;

        this.$store.dispatch('addBook', data).then(function(data) {
          vm.$router.push({
            name: 'Book',
            params: {
              id: data.id
            }
          })
        });
      },
      gotoLibrary() {
        this.$router.push({
          name: 'Library'
        })
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.state.token !== undefined && this.$store.state.token !== '';
      },
    }
  }
</script>
