<template>
  <v-container>
    <v-container>
      <v-row v-for="book in books" :key="book.id">
        <v-card>
          <v-card-text>
            {{book.title}}
          </v-card-text>
          <v-card-actions>
            <v-btn>
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>

  </v-container>
</template>

<script>
  export default {
    name: 'NewBook',

    data: () => ({
      books: [
        {
          id: 1,
          title: 'la atalntida'
        }
      ],
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
  }
</script>
