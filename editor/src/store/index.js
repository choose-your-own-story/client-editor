import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentPage: {},
    currentBook: {},
    userLibrary: [],
    currentBookPages: []
  },
  mutations: {
    updateCurrentPage(state, newData) {
      state.currentPage.items = newData.items;
      state.currentPage.choices = newData.choices;
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
    removePageFromCurrentBook(state, pageId) {
      state.currentBookPages = state.currentBookPages.filter(function(item) {
        return item.id !== pageId;
      });
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
        console.log('nuevo libro');
        console.log(response.data);
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
    loadPage(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': 'jota', // rootState.users.token
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'get',
        url: `http://localhost:3000/api/book/${data.bookId}/page/${data.pageId}`,
        headers: headers
      }).then(function(response) {
        state.commit('updateCurrentPage', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    loadBook(state, bookId) {
    }
  },
  modules: {
  }
})
