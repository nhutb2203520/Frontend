import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from "element-plus";
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
import AuthorManagement from "@/components/Admin/AuthorManagement.vue";
import AddReader from "@/components/Admin/AddReader.vue";
import UpdateAccount from "@/components/Client/UpdateAccount.vue";
import ChangePassAD from "@/components/Admin/ChangePassAD.vue";
import UpdateAccountAD from "@/components/Admin/UpdateAccountAD.vue";

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
    beforeEnter: (to, from, next) => {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        ElMessage({
          message: "Bạn cần đăng nhập để xem lịch sử mượn sách.",
          type: "warning",
        });
        // Chuyển hướng đến trang đăng nhập nếu không có accessToken
        next({ name: "Signin User" });
      } else {
        next();
      }
    },
  },
  {
    path: "/account-user",
    name: "AccountInforUser",
    component: AccountUser,
  },
  {
    path: "/account-user/update-account",
    name: "UpdateAccount",
    component: UpdateAccount,
  },
  {
    path: "/account-user/change-password",
    name: "Change Password",
    component: ChangePass,
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    component: () => import("@/Views/Forgot-Password.vue"),
  },
  {
    path: "/reset-password/:token",
    name: "Reset Password",
    component: () => import("@/Views/Reset-Password.vue"),
  },

  // --------- Admin routes (bắt đầu bằng /admin) ---------
  {
    path: '/homeadmin',
    name: 'HomeAdmin',
    component: () => import('@/Views/HomeAdmin.vue'),
    meta: { role: 'admin' }
  },
  {
    path: "/admin/signin",  
    name: "Signin Admin",
    component: () => import('@/Views/AdminFormSignIn.vue'),
    meta: { role: 'admin' }
  },
  {
    path: "/admin/account",
    name: "AccountInforAdmin",
    component: AccountAdmin,
    meta: { role: 'admin' }
    
  },
  {
    path: "/admin/account/change-pass-ad",
    name: "ChangePassAD",
    component: ChangePassAD,
    meta: { role: 'admin' }
  },
  {
    path: "/admin/account/update-account-ad",
    name: "UpdateAccountAD",
    component: UpdateAccountAD,
    meta: { role: 'admin' }
  },
  {
    path: "/admin/management-reader",
    name: "ManagementReader",
    component: ManagementReader,
    children: [
      {
        path: "add-reader",
        name: "AddReader",
        component: AddReader,
      },
    ],
  },
  {
    path: "/admin/category-management",
    name: "CategoryManagement",
    component: CategoryManagement,
    meta: { role: 'admin' }
  },
  {
    path: "/admin/management-publisher",
    name: " ManagementPublisher",
    component: PublisherManager,
    meta: { role: 'admin' }
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
      {
        path: "author-management",
        name: "AuthorManagement",
        component: AuthorManagement,
      },
    ],
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
