<template>
  <v-container>
    <v-row v-for="item in items" class="text-center">
      <v-col>
        <v-btn :to="item.href">
          {{item.text}}
        </v-btn>
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
  }
</script>
