<template>
  <div class="container-fluid bg-dark text-white py-5" data-aos="fade-up" data-aos-duration="1000">
    <div class="text-center mb-5">
      <h2 class="text-info fw-bold display-5">GỢI Ý DÀNH CHO BẠN</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">📘</div>
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
      <div v-for="(book, index) in books" :key="index" class="col">
        <!-- 🔁 Tái sử dụng BookCard.vue -->
        <BookCard :book="book" />
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from '@/components/BookCard.vue';

export default {
  name: 'BookForYou',
  components: {
    BookCard
  },
  data() {
    return {
      books: [
        {
          title: 'Giáo trình Sinh học ứng dụng đại cương',
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình An toàn, sức khỏe và môi trường',
          image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình Khoa học Trái đất',
          image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình Ứng dụng công nghệ sinh học',
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình Khai thác dữ liệu với Python',
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình Vật lý đại cương',
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình Hóa học hữu cơ',
          image: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình Toán cao cấp',
          image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình Lập trình Web cơ bản',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'
        },
        {
          title: 'Giáo trình Kỹ thuật điện tử cơ bản',
          image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=250&fit=crop'
        }
      ]
    };
  }
};
</script>

<style scoped>
.ratio img {
  object-fit: cover;
}
</style>