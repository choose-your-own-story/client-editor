import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentPage: {
      items: [],
      choices: [],
      title: ''
    },
    currentBook: {},
    userLibrary: [],
    currentBookPages: []
  },
  mutations: {
    updateCurrentPage(state, newData) {
      state.currentPage.items = newData.items;
      state.currentPage.choices = newData.choices;
    },
    updateCurrentPageTitle(state, newData) {
      state.currentPage.title = newData.title;
    },
    updateCurrentBook(state, newData) {
      state.currentBook.id = newData.id;
      state.currentBook.author = newData.author;
      state.currentBook.description = newData.description;
      state.currentBook.cover = newData.cover;
    },
    updateUserLibrary(state, newData) {
      state.userLibrary = newData;
    },
    updateCurrentBookPages(state, newData) {
      state.currentBookPages = newData;
    },
    addPageToCurrentBook(state, newData) {
      state.currentBookPages.push(newData);
    },
    addItemToCurrentPage(state, newItem) {
      state.currentPage.items.push(newItem);
    },
    addChoiceToCurrentPage(state, newItem) {
      state.currentPage.choices.push(newItem);
    },
    emptyCurrentBookPages(state) {
      state.currentBookPages = [];
    },
    removePageFromCurrentBook(state, pageId) {
      state.currentBookPages = state.currentBookPages.filter(function(item) {
        return item.id !== pageId;
      });
    },
    removeBookFromCurrentLibrary(state, bookId) {
      state.userLibrary = state.userLibrary.filter(book => parseInt(book.id) !== parseInt(bookId));
    },
    removeChoiceFromCurrentPage(state, choiceId) {
      state.currentPage.choices = state.currentPage.choices.filter(choice => parseInt(choice.id) !== parseInt(choiceId));
    }
  },
  actions: {
    loadBookPages(state, bookId) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'get',
        url: `http://localhost:3000/api/book/${bookId}/page`,
        headers: headers
      }).then(function(response) {
        state.commit('updateCurrentBookPages', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    loadUserBooks(state) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'get',
        url: 'http://localhost:3000/api/user/library',
        headers: headers
      }).then(function(response) {
        state.commit('updateUserLibrary', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    addBook(state, bookData) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'post',
        url: 'http://localhost:3000/api/book',
        headers: headers,
        data: bookData
      }).then(function(response) {
        state.commit('updateCurrentBook', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    updateBook(state, bookData) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'put',
        url: `http://localhost:3000/api/book/${bookData.id}`,
        headers: headers,
        data: bookData
      }).then(function(response) {
        state.commit('updateCurrentBook', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    addPage(state, bookId) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'post',
        url: `http://localhost:3000/api/book/${bookId}/page`,
        headers: headers,
        data: {}
      }).then(function(response) {
        state.commit('addPageToCurrentBook', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    addPageItem(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'post',
        url: `http://localhost:3000/api/book/${data.bookId}/page/${data.pageId}/item`,
        headers: headers,
        data: data
      }).then(function(response) {
        state.commit('addItemToCurrentPage', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    addPageChoice(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'post',
        url: `http://localhost:3000/api/book/${data.bookId}/page/${data.pageId}/choice`,
        headers: headers,
        data: data
      }).then(function(response) {
        state.commit('addChoiceToCurrentPage', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    deletePage(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'delete',
        url: `http://localhost:3000/api/book/${data.bookId}/page/${data.pageId}`,
        headers: headers
      }).then(function(response) {
        state.commit('removePageFromCurrentBook', data.pageId)
      }).catch(function(err) {
        console.log(err);
      });
    },
    deleteChoice(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'delete',
        url: `http://localhost:3000/api/book/${data.bookId}/page/${data.pageId}/choice/${data.choiceId}`,
        headers: headers
      }).then(function() {
        state.commit('removeChoiceFromCurrentPage', data.choiceId)
      }).catch(function(err) {
        console.log(err);
      });
    },
    async loadPage(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      const response = await axios({
        method: 'get',
        url: `http://localhost:3000/api/book/${data.bookId}/page/${data.pageId}`,
        headers: headers
      });
      state.commit('updateCurrentPage', response.data);
      return response.data;
    },
    updatePageTitle(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'put',
        url: `http://localhost:3000/api/book/${data.bookId}/page/${data.pageId}`,
        headers: headers,
        data: data
      }).then(function(response) {
        state.commit('updateCurrentPageTitle', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    async loadBook(state, bookId) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      const response = await axios({
        method: 'get',
        url: `http://localhost:3000/api/book/${bookId}`,
        headers: headers
      });

      state.commit('updateCurrentBook', response.data);

      return response.data;
    },
    deleteBook(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'delete',
        url: `http://localhost:3000/api/book/${data.id}`,
        headers: headers
      }).then(function(response) {
        state.commit('removeBookFromCurrentLibrary', data.id);
      }).catch(function(err) {
        console.log(err);
      });
    },
  },
  modules: {
  }
})
