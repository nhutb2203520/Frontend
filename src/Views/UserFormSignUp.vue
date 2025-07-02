<template>
    <div class="form-container">
        <div class="login-form">
            <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />

            <h2>Đăng Ký</h2>
            <form @submit.prevent="submitRegister">
                <!-- Họ tên -->
                <div>
                    <label for="hoten">Họ Tên:</label>
                    <input type="text" id="hoten" v-model="registerData.HOTEN" required />
                </div>

                <!-- Địa chỉ -->
                <div>
                    <label for="diachi">Địa Chỉ:</label>
                    <input type="text" id="diachi" v-model="registerData.DIACHI" required />
                </div>

                <!-- Ngày sinh -->
                <div>
                    <label for="ngaySinh">Ngày Sinh:</label>
                    <input type="date" id="ngaySinh" v-model="registerData.NGAYSINH" :max="today" required />
                </div>

                <!-- Giới tính -->
                <div>
                    <label>Giới Tính:</label>
                    <label><input type="radio" value="Nam" v-model="registerData.GIOITINH" required /> Nam</label>
                    <label><input type="radio" value="Nữ" v-model="registerData.GIOITINH" required /> Nữ</label>
                </div>

                <!-- Số điện thoại -->
                <div>
                    <label for="sdt">Số Điện Thoại:</label>
                    <input type="tel" id="sdt" v-model="registerData.DIENTHOAI" required pattern="[0-9]{10}"
                        placeholder="10 chữ số" />
                </div>

                <!-- Email -->
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="registerData.EMAIL" required
                        pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$" placeholder="example@email.com" />
                </div>

                <!-- Mật khẩu -->
                <div>
                    <label for="password">Mật Khẩu:</label>
                    <input type="password" id="password" v-model="registerData.PASSWORD" required />
                </div>

                <!-- Nhập lại mật khẩu -->
                <div>
                    <label for="confirm">Nhập Lại Mật Khẩu:</label>
                    <input type="password" id="confirm" v-model="registerData.CONFIRM_PASSWORD" required />
                </div>

                <!-- Nút đăng ký -->
                <button type="submit">Đăng Ký</button>
            </form>

            <p v-if="message" :class="{ success: success, error: !success }">
                {{ message }}
            </p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        const today = new Date().toISOString().split("T")[0];
        return {
            today,
            registerData: {
                HOTEN: "",
                DIACHI: "",
                NGAYSINH: "",
                GIOITINH: "",
                DIENTHOAI: "",
                EMAIL: "",
                PASSWORD: "",
                CONFIRM_PASSWORD: "",
            },
            message: "",
            success: false,
        };
    },
    methods: {
        async submitRegister() {
            // Kiểm tra lại mật khẩu
            if (this.registerData.PASSWORD !== this.registerData.CONFIRM_PASSWORD) {
                this.message = "Mật khẩu nhập lại không khớp!";
                this.success = false;
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/api/docgia/register", this.registerData);
                if (response.status === 201 || response.status === 200) {
                    this.message = "Đăng ký thành công!";
                    this.success = true;
                    this.$router.push("/login");
                }
            } catch (error) {
                this.message = "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!";
                this.success = false;
            }
        },
    },
};
</script>

<style scoped>
@import "@/assets/sign.css";
/* hoặc file css login đang dùng */
</style>
  
