<template>
  <v-container>
    <v-row v-for="item in items" class="text-center">
      <v-col>
        <v-btn :to="item.href">
          {{item.text}}
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="home">
          <!-- Check that the SDK client is not currently loading before accessing is methods -->
          <div v-if="!$auth.loading">
            <!-- show login when not authenticated -->
            <v-btn v-if="!$auth.isAuthenticated" @click="login">Log in</v-btn>
            <!-- show logout when authenticated -->
            <v-btn v-if="$auth.isAuthenticated" @click="logout">Log out</v-btn>
          </div>
        </div>
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
        },
        {
          text: 'Solicitar permisos sobre un libro',
          href: '/library',
        }
      ],
    }),
    methods: {
      login() {
        this.$auth.loginWithRedirect();
      },
      // Log the user out
      logout() {
        this.$auth.logout({
          returnTo: window.location.origin
        });
      }
    }
  }
</script>
