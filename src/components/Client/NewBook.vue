<template>
    <div class="container-fluid bg-dark text-white py-5">
      <div class="text-center mb-5">
        <h2 class="text-info fw-bold display-5">SÁCH MỚI</h2>
        <div class="d-flex justify-content-center align-items-center gap-3">
          <div class="bg-info" style="width: 80px; height: 2px;"></div>
          <div class="fs-3">📖</div>
          <div class="bg-info" style="width: 80px; height: 2px;"></div>
        </div>
      </div>
  
      <div class="position-relative bg-secondary bg-opacity-25 rounded shadow p-4 overflow-hidden">
        <div class="row g-4 flex-nowrap overflow-hidden"
             style="transition: transform 0.6s;"
             :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }">
          <div v-for="(book, index) in books" :key="index"
               class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <!-- 🔁 Tái sử dụng BookCard.vue -->
            <BookCard :book="book" />
          </div>
        </div>
  
        <button class="btn btn-info rounded-circle position-absolute top-50 start-0 translate-middle-y"
                @click="prevSlide" :disabled="currentIndex === 0">❮</button>
        <button class="btn btn-info rounded-circle position-absolute top-50 end-0 translate-middle-y"
                @click="nextSlide" :disabled="currentIndex >= maxIndex">❯</button>
      </div>
  
      <div class="d-flex justify-content-center gap-3 mt-4">
        <span v-for="(dot, index) in Math.ceil(books.length / itemsPerView)"
              :key="index"
              class="rounded-circle"
              :class="['bg-info', {
                'opacity-100': Math.floor(currentIndex / itemsPerView) === index,
                'opacity-50': Math.floor(currentIndex / itemsPerView) !== index
              }]"
              style="width: 12px; height: 12px; cursor: pointer; transition: all 0.3s;"
              @click="goToSlide(index * itemsPerView)">
        </span>
      </div>
    </div>
  </template>
  
  <script>
  import BookCard from '@/components/BookCard.vue';
  
  export default {
    name: 'NewBook',
    components: {
      BookCard
    },
    data() {
      return {
        currentIndex: 0,
        itemsPerView: 5,
        books: [
          {
            _id: 'b1',
            title: 'Giáo trình Sinh học ứng dụng đại cương',
            image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=250&fit=crop',
            category: 'Sinh học'
          },
          {
            _id: 'b2',
            title: 'Giáo trình An toàn, sức khỏe và môi trường',
            image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop',
            category: 'Kỹ thuật'
          },
          {
            _id: 'b3',
            title: 'Giáo trình Khoa học Trái đất',
            image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop',
            category: 'Khoa học'
          },
          {
            _id: 'b4',
            title: 'Giáo trình Ứng dụng công nghệ sinh học',
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
            category: 'Sinh học'
          },
          {
            _id: 'b5',
            title: 'Giáo trình Khai thác dữ liệu với Python',
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
            category: 'Công nghệ thông tin'
          },
          {
            _id: 'b6',
            title: 'Giáo trình Vật lý đại cương',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
            category: 'Vật lý'
          },
          {
            _id: 'b7',
            title: 'Giáo trình Hóa học hữu cơ',
            image: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400&h=250&fit=crop',
            category: 'Hóa học'
          },
          {
            _id: 'b8',
            title: 'Giáo trình Toán cao cấp',
            image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop',
            category: 'Toán học'
          }
        ]
      };
    },
    computed: {
      maxIndex() {
        return Math.max(0, this.books.length - this.itemsPerView);
      }
    },
    methods: {
      nextSlide() {
        if (this.currentIndex < this.maxIndex) this.currentIndex++;
      },
      prevSlide() {
        if (this.currentIndex > 0) this.currentIndex--;
      },
      goToSlide(index) {
        this.currentIndex = Math.min(index, this.maxIndex);
      },
      updateItemsPerView() {
        const width = window.innerWidth;
        if (width < 768) this.itemsPerView = 1;
        else if (width < 1024) this.itemsPerView = 2;
        else if (width < 1200) this.itemsPerView = 3;
        else if (width < 1400) this.itemsPerView = 4;
        else this.itemsPerView = 5;
  
        if (this.currentIndex > this.maxIndex) {
          this.currentIndex = this.maxIndex;
        }
      }
    },
    mounted() {
      this.updateItemsPerView();
      window.addEventListener('resize', this.updateItemsPerView);
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.updateItemsPerView);
    }
  };
  </script>
  
  <style scoped>
  .ratio img {
    object-fit: cover;
  }
  </style>
  