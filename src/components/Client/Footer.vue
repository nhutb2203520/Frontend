<template>
  <footer class="footer">
    <p>Mọi thông tin vui lòng liên hệ:</p>

    <div class="contact-icons">
      <a href="mailto:thuviensinhvien@ctu.edu.vn" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Gmail" />
      </a>
      <a href="tel:+840123456789">
        <img src="https://cdn-icons-png.flaticon.com/512/597/597177.png" alt="Phone" />
      </a>
      <a href="https://facebook.com" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
      </a>
      <a href="https://zalo.me" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" />
      </a>
    </div>

    <p>
      Địa chỉ:
      <a
        href="https://maps.app.goo.gl/gJwyDTgt7WbQsWDc7"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >
        Khu II Trường Đại học Cần Thơ, Đường 3/2, Q. Ninh Kiều, Tp. Cần Thơ
      </a>
    </p>

    <p>&copy; Bản quyền thuộc về NLN Quản Lý Thư Viện.</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #007bff;
  padding: 30px 20px;
  text-align: center;
  color: #ffffff;
  font-family: 'Segoe UI', sans-serif;
  font-size: 15px;
  border-top: 2px solid #007bff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
}

.contact-icons {
  margin: 15px 0;
}

.contact-icons a {
  margin: 0 10px;
  display: inline-block;
  transition: transform 0.2s;
}

.contact-icons a:hover {
  transform: scale(1.1);
}

.contact-icons img {
  width: 32px;
  height: 32px;
}

.footer-link {
  color: #ffffff;
  text-decoration: underline;
}

.footer-link:hover {
  color: #fcfcfc;
}
</style>
