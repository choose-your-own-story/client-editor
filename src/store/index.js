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
    currentBookPages: [],

    token: localStorage.getItem('token') || '',
    userName: localStorage.getItem('user_name') || '',
    userThumb: localStorage.getItem('user_thumb') || '',
    uploadedData: '',
    genres: []
  },
  mutations: {
    setGenres(state, data) {
      state.genres = data;
    },
    fileUploaded(state, data) {
      state.uploadedData = data;
    },
    updateCurrentPage(state, newData) {
      state.currentPage.items = newData.items;
      state.currentPage.choices = newData.choices;
    },
    updateCurrentPageTitle(state, newData) {
      state.currentPage.title = newData.title;
      state.currentPage.pageType = newData.page_type;
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
    updateItemToCurrentPage(state, newItem) {
      state.currentPage.items.forEach(function(item) {
        if (item.id === newItem.id) {
          item.value = newItem.value;
        }
      })
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
    },
    removeItemFromCurrentPage(state, itemId) {
      state.currentPage.items = state.currentPage.items.filter(item => {
        return parseInt(item.id) !== parseInt(itemId)
      });
    },
    postAuthentication(state, userData) {
      if (userData === undefined) {
        state.userName = undefined;
        state.userThumb = undefined;
        state.token = undefined;
        return;
      }

      const user = userData.user;

      if ((user === undefined) || (userData.token === undefined)){
        state.userName = undefined;
        state.userThumb = undefined;
        state.token = undefined;
        return;
      }

      console.log('aaaa');

      console.log(userData);

      state.userName = user.name;
      state.userThumb = user.thumb;
      state.token = userData.token;

      // galletita
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user_name', user.name);
      localStorage.setItem('user_thumb', user.thumb);
    },
    logout(state) {
      state.userName = undefined;
      state.userThumb = undefined;
      state.token = undefined;

      // galletita
      localStorage.removeItem('token');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_thumb');
    }
  },
  actions: {
    loadBookPages(state, bookId) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${bookId}/page`,
        headers: headers
      }).then(function(response) {
        state.commit('updateCurrentBookPages', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    loadGenres(state) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_HOST}/api/library/genre`,
        headers: headers
      }).then(function(response) {
        state.commit('setGenres', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    loadUserBooks(state) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_HOST}/api/user/library`,
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
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      return new Promise(function(resolve, reject) {
        axios({
          method: 'post',
          url: `${process.env.VUE_APP_API_HOST}/api/book`,
          headers: headers,
          data: bookData
        }).then(function(response) {
          state.commit('updateCurrentBook', response.data)
          resolve(response.data);
        }).catch(function(err) {
          console.log(err);
          reject(err);
        });
      });

    },
    updateBook(state, bookData) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'put',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${bookData.id}`,
        headers: headers,
        data: bookData
      }).then(function(response) {
        state.commit('updateCurrentBook', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    addPage(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${data.bookId}/page`,
        headers: headers,
        data: data
      }).then(function(response) {
        state.commit('addPageToCurrentBook', response.data)
      }).catch(function(err) {
        console.log(err);
      });
    },
    addPageItem(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      let reqMethod = 'post';
      if (data.id !== undefined)
        reqMethod = 'put';

      axios({
        method: reqMethod,
        url: `${process.env.VUE_APP_API_HOST}/api/book/${data.bookId}/page/${data.pageId}/item`,
        headers: headers,
        data: data
      }).then(function(response) {
        if (reqMethod === 'post') {
          state.commit('addItemToCurrentPage', response.data)
        }
        else {
          state.commit('updateItemToCurrentPage', response.data)
        }
      }).catch(function(err) {
        console.log(err);
      });
    },
    addPageChoice(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${data.bookId}/page/${data.pageId}/choice`,
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
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'delete',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${data.bookId}/page/${data.pageId}`,
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
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'delete',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${data.bookId}/page/${data.pageId}/choice/${data.choiceId}`,
        headers: headers
      }).then(function() {
        state.commit('removeChoiceFromCurrentPage', data.choiceId)
      }).catch(function(err) {
        console.log(err);
      });
    },
    deletePageItem(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'delete',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${data.bookId}/page/${data.pageId}/item/${data.itemId}`,
        headers: headers
      }).then(function() {
        state.commit('removeItemFromCurrentPage', data.itemId)
      }).catch(function(err) {
        console.log(err);
      });
    },
    async loadPage(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${data.bookId}/page/${data.pageId}`,
        headers: headers
      });
      state.commit('updateCurrentPage', response.data);
      return response.data;
    },
    updatePageTitleAndType(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };
      return new Promise(function(resolve, reject) {
        axios({
          method: 'put',
          url: `${process.env.VUE_APP_API_HOST}/api/book/${data.bookId}/page/${data.pageId}`,
          headers: headers,
          data: data
        }).then(function(response) {
          state.commit('updateCurrentPageTitle', response.data)
          resolve(response.data)
        }).catch(function(err) {
          console.log(err);
          reject(err);
        });
      })
    },
    async loadBook(state, bookId) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${bookId}`,
        headers: headers
      });

      state.commit('updateCurrentBook', response.data);

      return response.data;
    },
    deleteBook(state, data) {
      // Send a POST request
      const headers = {
        'Authorization': `Bearer ${state.state.token}`,
        'Access-Control-Allow-Origin': '*'
      };

      axios({
        method: 'delete',
        url: `${process.env.VUE_APP_API_HOST}/api/book/${data.id}`,
        headers: headers
      }).then(function(response) {
        state.commit('removeBookFromCurrentLibrary', data.id);
      }).catch(function(err) {
        console.log(err);
      });
    },
    login(state, data) {

      console.log('aaaa');
      console.log(process.env);
      console.log(process.env.VUE_APP_API_HOST);
      // Send a POST request
      const headers = {
        'Access-Control-Allow-Origin': '*'
      };

      return new Promise(function(resolve, reject) {
        axios({
          method: 'post',
          url: `${process.env.VUE_APP_API_HOST}/api/user/login`,
          headers: headers,
          data: data
        }).then(function(response) {
          state.commit('postAuthentication', response.data)
          resolve(response.data);
        }).catch(function(err) {
          console.log(err);
          state.commit('postAuthentication', undefined)
          reject(err)
        });
      })

    },
    register(state, data) {
      // Send a POST request
      const headers = {
        'Access-Control-Allow-Origin': '*'
      };

      return new Promise(function(resolve, reject) {
        axios({
          method: 'post',
          url: `${process.env.VUE_APP_API_HOST}/api/user/register`,
          headers: headers,
          data: data
        }).then(function(response) {
          state.commit('postAuthentication', response.data);
          resolve(response.data);
        }).catch(function(err) {
          console.log(err);
          state.commit('postAuthentication', undefined);
          reject(err);
        });
      })
    },
    logout(state) {
      state.commit('logout');
    },
    uploadImageBusiness({commit, rootState, state}, image) {
      return new Promise((resolve, reject) => {
        let reqHeaders = {
          'Authorization': 'Bearer ' + state.token,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data'
        };

        let formData = new FormData();
        formData.append('file', image);

        axios({ url: `${process.env.VUE_APP_API_HOST}/api/upload/image?type=image`, data: formData, headers: reqHeaders, method: 'POST' })
          .then(resp => {
            commit('fileUploaded', resp.data);
            resolve(resp.data)
          })
          .catch(err => {
            console.error(err);
            reject(err)
          });
      })
    },
  },
  modules: {
  }
})
