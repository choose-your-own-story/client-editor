<template>
  <v-container>

    <v-row v-for="item in items" class="text-center" v-if="isAuthenticated">
      <v-col>
        <v-btn :to="item.href">
          {{item.text}}
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
      items: [
        {
          text: 'Crear un libro nuevo',
          href: '/book/new',
        },
        {
          text: 'Mis libros',
          href: '/user/library',
        }
      ],
    }),
    methods: {
    },
    computed: {
      isAuthenticated() {
        return this.$store.state.token !== undefined && this.$store.state.token !== '';
      },
    }
  }
</script>
