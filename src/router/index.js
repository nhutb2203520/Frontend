import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/Views/HomePage.vue';
import UserFormSignUp from '@/Views/UserFormSignUp.vue';
import CatalogBook from '@/Views/CatalogBook.vue';
import HomeAdmin from '@/Views/HomeAdmin.vue';
import AdminFormSignIn from '@/Views/AdminFormSignIn.vue';
import UserFormSignIn from '@/Views/UserFormSignIn.vue';
import BookDetails from '@/Views/BookDetails.vue';
import BorrowingHistory from '@/Views/BorrowingHistory.vue';
import AccountUser from '@/Views/AccountUser.vue';
import AccountAdmin from '@/Views/AccountAdmin.vue';
import ManagementReader from '@/Views/ManagementReader.vue';
const routes = [
  {
    path: '/signinuser',
    name: 'Signin User',
    component: UserFormSignIn
  },
  {
    path: '/',
    name: 'Home Page',
    component: HomePage
  },
  {
    path:'/signup',
    name:'Sign Up',
    component: UserFormSignUp
  },
  {
    path:'/catalogbook',
    name:'Catalog Book',
    component: CatalogBook
  },
  {
    path:'/homeadmin',
    name:'Home Admin',
    component: HomeAdmin
  },
  {
    path:'/adminformsignin',
    name:'Signin Admin',
    component: AdminFormSignIn
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/Views/NotFound.vue"),
  },
  {
    path: '/book/:id',
    name: 'BookDetails',
    component: BookDetails
  },
  {
    path: '/borrowinghistory',
    name: 'BorrowingHistory',
    component: BorrowingHistory
  },
  {
    path: '/account-user',
    name: 'AccountInforUser',
    component: AccountUser
  },
  {
    path: '/account-admin',
    name: 'AccountInforAdmin',
    component: AccountAdmin
  },
  {
    path: '/management-reader',
    name: 'ManagementReader',
    component: ManagementReader

  }
  

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
