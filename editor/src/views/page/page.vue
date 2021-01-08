<template>
  <div id="create">

    <v-container fluid>
      <v-container v-if="addingParagraph">
        <v-row>
          <v-col>
            <v-textarea label="New Paragraph"></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn>
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="addingImage">
        <v-row>
          <v-col>
            <v-text-field label="New image"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn>
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="addingChoice">
        <v-row>
          <v-col>
            <v-text-field label="Choice description"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-radio-group>
              <v-radio label="Existing page">
              </v-radio>
              <v-combobox>
              </v-combobox>

              <v-radio label="New Page">
              </v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn>
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-row>
        <v-col>
          <v-text-field label="Title"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-label>
            Items
          </v-label>
        </v-col>
      </v-row>

      <v-container>
        <v-row v-for="item in items" :key="item.id">
          <v-col>
            <p>
              {{item.value}}
            </p>
          </v-col>
          <v-col>
            <v-btn color="red" outlined>
              Eliminar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-row>
        <v-col>
          <v-label>
            Choices
          </v-label>
        </v-col>
      </v-row>

      <v-container>
        <v-row v-for="choice in choices" :key="choice.id">
          <v-col>
            {{choice.value}}
          </v-col>
          <v-col>
            <v-btn color="red" outlined>
              Eliminar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-speed-dial
            v-model="fab"
            :bottom="true"
            :right="true"
            direction="top"
            :open-on-hover="false"
            transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
                v-model="fab"
                color="blue darken-2"
                dark
                fab
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-btn>
      </template>

      <v-btn
              fab
              dark
              small
              color="green"
              @click="showAddChoice()"
      >
        <v-icon>mdi-family-tree</v-icon>
      </v-btn>
      <v-btn
              fab
              dark
              small
              color="indigo"
              @click="showAddImage()"
      >
        <v-icon>mdi-image</v-icon>
      </v-btn>

      <v-btn
              fab
              dark
              small
              color="red"
              @click="showAddParagraph()"
      >
        <v-icon>mdi-text-subject</v-icon>
      </v-btn>
    </v-speed-dial>

  </div>
</template>

<script>
  export default {
    name: 'NewBook',

    data: () => ({
      addingParagraph: false,
      addingImage: false,
      addingChoice: false,
      fab: false,
    }),
    created() {
      const data = {
        bookId: this.$route.params.bookId,
        pageId: this.$route.params.pageId
      };
      this.$store.dispatch('loadPage', data);
    },
    methods: {
      showAddParagraph() {
        this.addingChoice = false;
        this.addingImage = false;
        this.addingParagraph = true;
      },
      showAddImage() {
        this.addingChoice = false;
        this.addingImage = true;
        this.addingParagraph = false;
      },
      showAddChoice() {
        this.addingChoice = true;
        this.addingImage = false;
        this.addingParagraph = false;
      }
    },
    computed: {
      items() {
        if (this.$store.state.currentPage === undefined)
          return [];
        return this.$store.state.currentPage.items;
      },
      choices() {
        if (this.$store.state.currentPage === undefined)
          return [];
        return this.$store.state.currentPage.choices;
      }
    }
  }
</script>

<style>
  /* This is for documentation purposes and will not be needed in your application */
  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
</style>
