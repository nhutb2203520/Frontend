<template>
  <div class="home-container">
    <!-- Nội dung chính -->
    <div class="page-content">
      <!-- Banner chào mừng -->
      <div class="welcome-banner">
        <img src="@/assets/Welcome.jpg" alt="Welcome to CTU Ebook" class="banner-image" />
      </div>

      <!-- Giới thiệu thư viện -->
      <div class="library-intro">
        <div class="intro-image">
          <img src="@/assets/NLN_gioithieu.jpg" alt="Giới thiệu Thư viện NLN" class="intro-banner" />
        </div>

        <div class="intro-content">
          <h2>📚 Giới thiệu về Thư viện NLN</h2>
          <p>Thư viện NLN là một không gian học tập và tri thức hiện đại, được xây dựng với mục tiêu trở thành nơi kết
            nối tri thức, khơi dậy niềm đam mê đọc sách và phát triển tư duy sáng tạo cho mọi lứa tuổi.</p>
          <p>Với kho tàng sách phong phú và đa dạng, thư viện chúng tôi tự hào là địa chỉ tin cậy dành cho học sinh,
            sinh viên, phụ huynh và những người yêu sách. Hiện tại, thư viện đang cung cấp nhiều thể loại sách phục vụ
            nhu cầu học tập, giải trí và rèn luyện kỹ năng sống, nổi bật gồm:</p>
          <p>📘 Sách giáo dục: Bao gồm sách tham khảo, sách kỹ năng, sách luyện thi, sách chuyên ngành... hỗ trợ học tập
            hiệu quả ở mọi cấp học.</p>
          <p>🌈 Truyện thiếu nhi: Những câu chuyện nhẹ nhàng, gần gũi, được tuyển chọn kỹ lưỡng giúp phát triển trí
            tưởng tượng, đạo đức và cảm xúc tích cực cho trẻ nhỏ.</p>
          <p>🏰 Truyện cổ tích và dân gian: Gồm những câu chuyện kinh điển mang giá trị nhân văn, bài học sâu sắc về
            lòng nhân ái, sự trung thực, dũng cảm và trí tuệ.</p>
          <p>📖 Các thể loại sách khác: Sách kỹ năng sống, truyện tranh, văn học Việt Nam và nước ngoài, sách nuôi dạy
            con, sách tâm lý học...</p>
          <p>Không chỉ dừng lại ở kho sách đa dạng, Thư viện NLN còn hướng đến việc tạo dựng một môi trường thân thiện,
            hiện đại với không gian đọc thoải mái, khu vực học nhóm và tư vấn tài liệu. Hệ thống quản lý thư viện được
            số hóa giúp bạn dễ dàng tìm kiếm, mượn và trả sách trực tuyến, tiết kiệm thời gian và nâng cao trải nghiệm
            người dùng.</p>
          <p>Chúng tôi tin rằng:</p>
          <p>“Mỗi cuốn sách là một thế giới mở ra những chân trời mới.”</p>
          <p>Thư viện NLN luôn sẵn sàng đồng hành cùng bạn trên hành trình khám phá tri thức và phát triển bản thân.</p>
        </div>
      </div>

      <!-- Sách nổi bật -->
      <HotBook />

      <!-- Sách mới -->
      <NewBook />

      <!-- Chính sách mượn sách -->
      <div class="policy-intro">
        <div class="policy-content">
          <h2>📜 CHÍNH SÁCH MƯỢN SÁCH CỦA THƯ VIỆN</h2>
          <h3>1. Số lượng sách được mượn</h3>
          <p>Tại cùng thời điểm mỗi người chỉ được mượn tối đa 2 cuốn sách.</p>
          <p>Mỗi đầu sách chỉ được mượn 1 cuốn, không được mượn trùng sách trong cùng một phiếu.</p>
          <h3>2. Thời hạn mượn sách</h3>
          <p>Thời hạn mượn mỗi cuốn sách là 05 ngày kể từ ngày mượn.</p>
          <h3>3. Gia hạn mượn sách</h3>
          <p>Mỗi cuốn sách chỉ được gia hạn thêm 01 lần duy nhất.</p>
          <p>Thời gian gia hạn là 03 ngày tính từ ngày hết hạn ban đầu.</p>
          <p>Việc gia hạn phải được thực hiện trước ngày hết hạn mượn.</p>
          <h3>4. Xử lý quá hạn</h3>
          <p>Nếu người dùng quá hạn trả sách quá 05 ngày, tài khoản sẽ tạm thời bị khóa.</p>
          <p>Khi bị khóa tài khoản, người dùng không thể tiếp tục mượn hoặc gia hạn sách.</p>
          <h3>5. Mở khóa tài khoản</h3>
          <p>Để mở khóa tài khoản, người dùng phải trực tiếp đến Thư viện và trả lại sách quá hạn.</p>
          <p>Sau khi hoàn tất việc trả sách, thủ thư sẽ kiểm tra và tiến hành mở khóa tài khoản.</p>
        </div>

        <div class="policy-image">
          <img src="@/assets/chinhsach.jpg" alt="Chính sách Thư viện" class="policy-banner" />
        </div>
      </div>

      <!-- Footer & Chat -->
      <Footer />
      <Chat />
    </div>
  </div>
</template>

<script setup>
import HotBook from '@/components/Client/HotBook.vue'
import NewBook from '@/components/Client/NewBook.vue'
import Footer from '@/components/Client/Footer.vue'
import Chat from '@/components/Client/Chat.vue'
</script>


<style src="src/assets/main.css"></style>