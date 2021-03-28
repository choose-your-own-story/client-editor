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
    expanded: [],
    singleExpand: false,
    itemHeaders: [
      {
        text: 'Content',
        align: 'start',
        sortable: false,
        value: 'value',
      },
      { text: 'Acciones', value: 'actions', sortable: false }
    ],
    choicesHeaders: [
      {
        text: 'Description',
        align: 'start',
        sortable: true,
        value: 'value',
      },
      {
        text: 'Title',
        align: 'start',
        sortable: true,
        value: 'targetPageTitle',
      },
      { text: 'Acciones', value: 'actions', sortable: false }
    ],
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
    textToHtml(text) {
      return text.replaceAll('\n', '<br>');
    },
    gotoBack() {
      this.$router.go(-1);
    },
    loadThisPage() {
      const vm = this;
      const data = {
        bookId: this.$route.params.bookId,
        pageId: this.$route.params.pageId
      };
      this.$store.dispatch('loadPage', data).then(function(data) {
        vm.title = data.title;
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
      let vm = this;

      const data = {
        bookId: this.$route.params.bookId,
        pageId: this.$route.params.pageId,
        page_id: this.$route.params.pageId,
        title: this.title
      };

      this.$store.dispatch('updatePageTitleAndType', data).then(function(newData) {
        vm.addingMetadata = false;
      });
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
        targetPage = this.selectedTargetPage;
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
      return this.$store.state.currentPage.items.map(function(item) {
        return {
          value: item.value,
          id: item.id,
          type: item.type,
          entity: item
        }
      });
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
