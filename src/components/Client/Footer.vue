<template>
  <footer class="footer-wrapper">
    <div class="footer-header">
      <h2>QUẢN LÝ THƯ VIỆN NLN</h2>
    </div>

    <div class="footer-icons">
      <div class="footer-icon-item">
        <a href="https://maps.app.goo.gl/38x4YKtZq9NjNzoW9" target="_blank" rel="noopener"><img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" alt="Map" /></a>

        <p>Map</p>
      </div>
      <div class="footer-icon-item">
        <img src="https://cdn-icons-png.flaticon.com/512/597/597177.png" alt="Phone" />
        <p>Phone</p>
      </div>
      <div class="footer-icon-item">
        <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email" />
        <p>Email</p>
      </div>
      <div class="footer-icon-item">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
        <p>Facebook</p>
      </div>
      <div class="footer-icon-item">
        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" />
        <p>YouTube</p>
      </div>
    </div>

    <hr class="divider" />

    <div class="footer-contact">
      <p>📞 0776 560 730 &nbsp;&nbsp;&nbsp;&nbsp; 📞 0349 414 282</p>
      <p>🌐 www.quanlythuviennln.com</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer-wrapper {
  background-color: #62a1e0;
  text-align: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #ffffff;
}

.footer-header h2 {
  font-size: 24px;
  margin-bottom: 30px;
}

.footer-icons {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.footer-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100px;
}

.footer-icon-item img {
  width: 70px;
  height: 70px;
  background-color: #e2e6ea;
  border-radius: 50%;
  padding: 12px;
  margin-bottom: 8px;
}

.footer-icon-item p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.divider {
  border: none;
  height: 1px;
  background-color: #888;
  width: 80%;
  margin: 20px auto;
}

.footer-contact p {
  margin: 5px 0;
  font-size: 14px;
  color: #444;
}
</style>
