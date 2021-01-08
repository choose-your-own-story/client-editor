import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import Book from '../views/book/book.vue'
import Page from '../views/page/page.vue'
import UserLibrary from '../views/user/library.vue'
import UserNotifications from '../views/user/notifications.vue'
import Library from '../views/library/library.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/book/:id',
    name: 'Book',
    component: Book
  },
  {
    path: '/book/:bookId/page/:pageId',
    name: 'Page',
    component: Page
  },
  {
    path: '/user/library',
    name: 'UserLibrary',
    component: UserLibrary
  },
  {
    path: '/user/notifications',
    name: 'UserNotifications',
    component: UserNotifications
  },
  {
    path: '/library',
    name: 'Library',
    component: Library
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
