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
            Save
          </v-btn>
          <v-btn @click="addingParagraph = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            Save
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

                  <v-select label="Pages" v-model="selectedTargetPage" :items="bookPages">
                  </v-select>
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
            Save
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
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="updatePageTitleAndType()">
            Save
          </v-btn>
          <v-btn @click="addingMetadata=false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


      <v-container>
        <v-data-table
                :headers="itemHeaders"
                :items="items"
                :items-per-page="5"
                :single-expand="singleExpand"
                :expanded.sync="expanded"
                item-key="id"
                show-expand
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Items</v-toolbar-title>
              <v-divider
                      class="mx-4"
                      inset
                      vertical
              ></v-divider>
              <v-spacer></v-spacer>

              <v-btn color="orange" dark @click="showAddMetadata()">
                Edit Page Title
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn dark color="red" @click="showAddParagraph()">
                Add Paragraph
                <v-icon>mdi-text-subject</v-icon>
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn dark color="indigo" @click="showAddImage()">
                Add Image
                <v-icon>mdi-image</v-icon>
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn color="green" dark @click="showAddChoice()">
                Add Choice
                <v-icon>mdi-family-tree</v-icon>
              </v-btn>

            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">

            <v-icon v-if="item.type === 1" class="mr-2" @click="showEditParagraph(item)" color="orange">mdi-pencil</v-icon>

            <v-icon class="mr-2" @click="deleteItem(item)" color="red">mdi-delete</v-icon>

          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <div v-if="item.type===2">
                <v-img :src="item.value" max-width="200" max-height="300">

                </v-img>
              </div>
              <div v-if="item.type===1">
                <p v-html="textToHtml(item.value)">
                </p>
              </div>
            </td>
          </template>
        </v-data-table>

        <v-data-table
                :headers="choicesHeaders"
                :items="choices"
                :items-per-page="5"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Choices</v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">

            <v-icon class="mr-2" @click="gotoEditLink(item)" color="orange">mdi-pencil</v-icon>

            <v-icon class="mr-2" @click="deletePageChoice(item)" color="red">mdi-delete</v-icon>

          </template>
        </v-data-table>


      <v-row>
        <v-col>
          <v-btn @click="gotoBack()" color="secondary">
            Back
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script src="./page.js">
</script>
