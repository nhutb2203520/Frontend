import { createRouter, createWebHistory } from "vue-router";

// Client Views
import HomePage from "@/Views/HomePage.vue";
import UserFormSignUp from "@/Views/UserFormSignUp.vue";
import UserFormSignIn from "@/Views/UserFormSignIn.vue";
import CatalogBook from "@/Views/CatalogBook.vue";
import BookDetails from "@/components/Client/BookDetails.vue";
import BorrowingHistory from "@/Views/BorrowingHistory.vue";
import AccountUser from "@/Views/AccountUser.vue";

// Admin Views
import HomeAdmin from "@/Views/HomeAdmin.vue";
import AdminFormSignIn from "@/Views/AdminFormSignIn.vue";
import AccountAdmin from "@/Views/AccountAdmin.vue";
import ManagementReader from "@/Views/ManagementReader.vue";

// Not Found
import NotFound from "@/Views/NotFound.vue";
import CategoryManagement from "@/Views/CategoryManagement.vue";
import PublisherManager from "@/Views/PublisherManager.vue";
import BookManagement from "@/Views/BookManagement.vue";
import BorrowReturnManagement from "@/Views/BorrowReturnManagement.vue";
import ChangePass from "@/components/Client/ChangePass.vue";
import AddBook from "@/components/Admin/AddBook.vue";
import EditBook from "@/components/Admin/EditBook.vue";
import LocationManagement from "@/components/Admin/LocationManagement.vue";

const routes = [
  // --------- Client routes ---------
  {
    path: "/",
    name: "Home Page",
    component: HomePage,
  },
  {
    path: "/signup",
    name: "Sign Up",
    component: UserFormSignUp,
  },
  {
    path: "/signinuser",
    name: "Signin User",
    component: UserFormSignIn,
  },
  {
    path: "/catalogbook",
    name: "Catalog Book",
    component: CatalogBook,
  },
  {
    path: "/book/:MaSach",
    name: "BookDetails",
    component: BookDetails,
  },
  {
    path: "/borrowinghistory",
    name: "BorrowingHistory",
    component: BorrowingHistory,
  },
  {
    path: "/account-user",
    name: "AccountInforUser",
    component: AccountUser,
  },
  {
    path: "/change-password",
    name: "Change Password",
    component: ChangePass,
  },

  // --------- Admin routes (bắt đầu bằng /admin) ---------
  {
    path: "/homeadmin",
    name: "Home Admin",
    component: HomeAdmin,
  },
  {
    path: "/admin/signin",
    name: "Signin Admin",
    component: AdminFormSignIn,
  },
  {
    path: "/admin/account",
    name: "AccountInforAdmin",
    component: AccountAdmin,
  },
  {
    path: "/admin/management-reader",
    name: "ManagementReader",
    component: ManagementReader,
  },
  {
    path: "/admin/category-management",
    name: "CategoryManagement",
    component: CategoryManagement,
  },
  {
    path: "/admin/management-publisher",
    name: " ManagementPublisher",
    component: PublisherManager,
  },
  {
    path: "/admin/book-management",
    name: "BookManagement",
    component: BookManagement,
    children: [
      {
        path: "add-book",
        name: "AddBook",
        component: AddBook,
      },
      {
        path: "edit-book/:id",
        name: "EditBook",
        component: EditBook,
        props: true,
      },
      {
        path: "location-management",
        name: "LocationManagement",
        component: LocationManagement,
      },
     
    ]
  },
  {
    path: "/admin/borrow-return-management",
    name: "BorrowReturnManagement",
    component: BorrowReturnManagement,
  },

  // --------- Not Found ---------
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  
  
  //
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
