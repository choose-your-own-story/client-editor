<template>
  <div id="create">
    <v-dialog v-model="addingParagraph">
      <v-card>
        <v-container>
          <v-row>
            <v-col>
              <v-textarea label="New Paragraph" v-model="paragraph"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="addParagraph()">
            Add
          </v-btn>
          <v-btn @click="addingParagraph = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container>

      <v-dialog v-model="addingImage">
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-file-input
                        v-model="fileModel"
                        :rules="rules"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-camera"
                        label="Imagen"
                        outlined
                        @change="handleFileUpload()"
                />
                <v-label>{{added_url}}</v-label>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="addImage()">
              Add
            </v-btn>
            <v-btn @click="addingImage = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addingChoice">
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field label="Choice description" v-model="choiceText"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-radio-group v-model="targetPageGroup">
                  <div v-if="bookPages.length > 0">
                    <v-radio label="Existing page">
                    </v-radio>

                    <v-combobox label="Pages" v-model="selectedTargetPage" :items="bookPages">
                    </v-combobox>
                  </div>

                  <v-radio label="New Page">
                  </v-radio>
                  <v-text-field v-model="newPageTitle" label="Title"></v-text-field>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="addChoice()">
              Add
            </v-btn>
            <v-btn @click="addingChoice=false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addingMetadata">
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-row>
                  <v-col>
                    <v-text-field label="Title" v-model="title"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-select :items="pageTypes" label="Page Type" v-model="selectedPageType">
                    </v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="updatePageTitleAndType()">
              Guardar
            </v-btn>
            <v-btn @click="addingMetadata=false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-row>
        <v-col>
          <v-btn
                  color="orange"
                  dark
                  @click="showAddMetadata()"
          >
            Edit Title and Type
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-col>

        <v-col>
          <v-btn
                  color="green"
                  dark
                  @click="showAddChoice()"
          >
            Add Choice
            <v-icon>mdi-family-tree</v-icon>
          </v-btn>
        </v-col>

        <v-col>
          <v-btn
                  dark
                  color="indigo"
                  @click="showAddImage()"
          >
            Add Image
            <v-icon>mdi-image</v-icon>
          </v-btn>
        </v-col>

        <v-col>
          <v-btn
                  dark
                  color="red"
                  @click="showAddParagraph()"
          >
            Add Paragraph
            <v-icon>mdi-text-subject</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col>

        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-row>
        <v-col>

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
              <div v-if="item.type===2">
                <v-img :src="item.value" max-width="200" max-height="300">

                </v-img>
              </div>
              <div v-if="item.type===1">
                <p>
                  {{item.value}}
                </p>
              </div>
          </v-col>
          <v-col>
            <v-btn color="red" outlined @click="deleteItem(item)">
              Eliminar
            </v-btn>
          </v-col>
          <v-col v-if="item.type === 1">
            <v-btn color="blue" outlined @click="showEditParagraph(item)">
              Edit
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
            {{choice.targetPage}}
          </v-col>
          <v-col>
            {{choice.targetPageTitle}}
          </v-col>

          <v-col>
            <v-btn color="primary" outlined @click="gotoEditLink(choice)">
              Editar
            </v-btn>
          </v-col>

          <v-col>
            <v-btn color="red" outlined @click="deletePageChoice(choice)">
              Eliminar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

  </div>
</template>

<script>
  export default {
    name: 'NewBook',

    data: () => ({
      addingMetadata: false,
      addingParagraph: false,
      addingImage: false,
      addingChoice: false,
      paragraph: '',
      paragraphId: undefined,
      image: '',
      choiceText: '',
      fab: false,
      targetPageGroup: 0,
      selectedTargetPage: 0,
      newPageTitle: '',
      title: '',
      fileModel: [],
      rules: [
        //value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      added_url: '',
      pageTypes: [
        {
          text: 'Inicio',
          value: 0
        },
        {
          text: 'Trama',
          value: 1
        },
        {
          text: 'Fin',
          value: 2
        }
      ],
      selectedPageType: 0
    }),
    created() {
      this.loadThisPage();
    },
    beforeRouteUpdate (to, from, next) {
      console.log('loading....');
      next();
      this.loadThisPage();
    },
    methods: {
      loadThisPage() {
        const vm = this;
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId
        };
        this.$store.dispatch('loadPage', data).then(function(data) {
          vm.title = data.title;
          vm.selectedPageType = vm.pageTypes.find(item => item.value === data.page_type).value;
        });
        this.$store.dispatch('loadBookPages', this.$route.params.bookId)
      },
      handleFileUpload: function() {
        let vm = this;
        if ((this.fileModel !== undefined) && (this.fileModel.name.length > 0)) {
          this.$store.dispatch('uploadImageBusiness', this.fileModel).then(function (newUrl) {
            console.log('exitos!');
            vm.added_url = newUrl
          });
        }
      },
      showAddParagraph() {
        this.addingChoice = false;
        this.addingImage = false;
        this.addingParagraph = true;
        this.addingMetadata = false;
      },
      showEditParagraph(item) {
        this.addingChoice = false;
        this.addingImage = false;
        this.addingParagraph = true;
        this.addingMetadata = false;
        this.paragraph = item.value;
        this.paragraphId = item.id;
      },
      showAddImage() {
        this.addingChoice = false;
        this.addingImage = true;
        this.addingParagraph = false;
        this.addingMetadata = false;
      },
      showAddMetadata() {
        this.addingChoice = false;
        this.addingImage = false;
        this.addingParagraph = false;
        this.addingMetadata = true;
      },
      showAddChoice() {
        this.addingChoice = true;
        this.addingImage = false;
        this.addingParagraph = false;
        this.addingMetadata = false;
      },
      deleteItem(item) {
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          itemId: item.id
        };
        this.$store.dispatch('deletePageItem', data);
      },
      addParagraph() {
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          item_type: 1,
          value: this.paragraph,
          id: this.paragraphId
        };
        this.$store.dispatch('addPageItem', data);

        this.addingParagraph = false;
        this.paragraph = '';
      },
      updatePageTitleAndType() {
        console.log('page type');
        console.log(this.selectedPageType);
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          title: this.title,
          page_type: this.selectedPageType
        };
        this.$store.dispatch('updatePageTitleAndType', data);
      },
      deletePageChoice(choice) {
        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          choiceId: choice.id
        };
        this.$store.dispatch('deleteChoice', data);
      },
      gotoEditLink(choice) {
        this.$router.push( `/book/${this.$route.params.bookId}/page/${choice.targetPage}`);
      },
      addImage() {
        const vm = this;

        let data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          item_type: 2,
          value: this.added_url
        };
        this.$store.dispatch('addPageItem', data).then(function(imageData) {
          data.value = imageData.url;
          vm.$store.dispatch('addPageItem', data);
        }).catch(function(err) {
          console.log(err);
          console.log('unable to upload image');
        });

        this.addingImage = false;
        this.added_url = '';
      },
      addChoice() {
        let targetPage = 0;
        // existing page
        if (this.targetPageGroup === 0) {
          targetPage = this.selectedTargetPage.value;
        }

        // new page
        if (this.targetPageGroup === 1) {
          targetPage = 0;
        }

        const data = {
          bookId: this.$route.params.bookId,
          pageId: this.$route.params.pageId,
          page_id: this.$route.params.pageId,
          sort_index: 1,
          value: this.choiceText,
          target_page: targetPage,
          target_page_title: this.newPageTitle,
          targetPageTitle: this.newPageTitle
        };
        this.$store.dispatch('addPageChoice', data);

        this.addingChoice = false;
        this.targetPageGroup = 0;
        this.choiceText = '';
        this.newPageTitle = '';
      }
    },
    computed: {
      items() {
        if (this.$store.state.currentPage === undefined) {
          return [];
        }
        return this.$store.state.currentPage.items;
      },
      choices() {
        if (this.$store.state.currentPage === undefined)
          return [];
        return this.$store.state.currentPage.choices;
      },
      book() {
        return this.$store.state.currentBook;
      },
      bookPages() {
        const vm = this;


        const options = this.$store.state.currentBookPages.map(item => {
          return {
            value: item.id,
            text: item.title
          }
        }).filter(item => {
          return parseInt(item.value) !== parseInt(vm.$route.params.pageId);
        });

        if (options.length === 0) {
          vm.targetPageGroup = 1;
        }

        return options;
      }
    }
  }
</script>
