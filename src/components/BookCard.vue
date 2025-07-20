<template>
  <div data-aos="fade-up" data-aos-duration="800"
    class="bg-dark bg-opacity-75 border border-light rounded-3 p-3 h-100 d-flex flex-column align-items-center text-center book-hover">
    <!-- Ảnh sách -->
    <router-link class="text-decoration-none w-100 mb-3 ratio ratio-4x3 rounded overflow-hidden"
      :to="`/book/${book.MaSach}`">
      <img :src="'http://localhost:3000' + book.image[0]" :alt="book.TenSach" class="img-fluid rounded" />
    </router-link>

    <!-- Tên sách -->
    <h5 class="text-white fw-semibold mb-3 text-center" style="min-height: 48px">
      {{ capitalizeWords(book.TenSach) }}
    </h5>

    <!-- Trái tim và nút -->
    <div class="mt-auto d-flex flex-column align-items-center gap-2">
      <div class="fs-4 text-white heart-icon" style="user-select: none" role="button" @click.stop="toggleFavorite">
        {{ isFavorite ? '❤️' : '♡' }}

      </div>

      <router-link :to="`/book/${book.MaSach}`" replace
        class="btn btn-info rounded-pill px-4 fw-bold text-decoration-none">
        XEM CHI TIẾT
      </router-link>
    </div>
  </div>
</template>

<script>
import { capitalizeWords } from "@/utils/stringUtils";
import { useAuthStore } from "@/Store/auth.store";
import { useBookStore } from "@/Store/Book.store";
import { ElMessage } from "element-plus";
export default {
  name: "BookCard",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFavorite: false,
    };
  },
  methods: {
    capitalizeWords,
    // toggleFavorite() {
    //   this.isFav = !this.isFav;
    //   this.$emit("update-favorite", {
    //     MaSach: this.book.MaSach,
    //     favorite: this.isFav,
    //   });
    // },
    async toggleFavorite() {
      if (!useAuthStore().accessToken) {
        ElMessage.warning('Vui lòng nhập để đăng ký mượn sách.')
        this.$router.push({ name: 'Signin User', replace: true })
        return
      }
      try {
        this.isFavorite = !this.isFavorite;
        const MaSachId = this.book._id
        const data = {
          MaSachId: MaSachId
        }
        const bookStore = useBookStore()
        if (this.isFavorite) {
          const result = await bookStore.addBookFavorite(data)
          if (result.message === 'Thêm vào yêu thích thành công.') {
            ElMessage.success('Đã thêm vào yêu thích.')
          } else {
            ElMessage.error(result.message || 'Thêm vào yêu thích thất bại.')
          }
        } else {
          const result = await bookStore.deleteBookFavorite(data)
          if (result.message === 'Xóa sách yêu thích thành công.') {
            ElMessage.success('Đã bỏ khỏi yêu thích.')
          } else {
            ElMessage.error(res.message || 'Bỏ yêu thích thất bại.')
          }
        }
      } catch (err) {
        ElMessage.error('Lỗi khi thêm vào sách yêu thích.')
      }
    },
    async loadData() {
      if (useAuthStore().accessToken) {
        const bookStore = useBookStore()
        const booksFavoriteList = await bookStore.getAllBookFavorite()
        this.isFavorite = booksFavoriteList?.some(bfa => bfa.MaSach._id === this.book?._id)
      }

    }
  },
  async mounted() {
    await this.loadData()
  }
};
</script>

<style scoped>
.ratio img {
  object-fit: cover;
}

.book-hover {
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}

.heart-icon {
  font-size: 32px;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.heart-icon:hover {
  transform: scale(1.2);
}
</style>
