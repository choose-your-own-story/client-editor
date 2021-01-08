<template>
  <v-container>
    <v-container>
      <v-row v-for="notification in notifications" :key="notification.id">
        <v-card>
          <v-card-text>
            {{notification.text}}
          </v-card-text>
          <v-card-text>
            {{notification.sender.name}}
          </v-card-text>
          <v-card-text>
            {{notification.target.title}}
          </v-card-text>
          <v-card-actions>
            <v-btn>
              Aceptar
            </v-btn>
            <v-btn>
              Denegar
            </v-btn>
            <v-btn>
              Abrir libro solicitado
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
          title: 'la atralntida'
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
