// src/Store/admin.store.js
import { defineStore } from 'pinia'
import axios from '@/utils/axiosAdmin'
import router from '@/router'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    accessToken: sessionStorage.getItem('adminToken') || '',
    adminInfo: JSON.parse(sessionStorage.getItem('adminInfo') || 'null'),
  }),

  actions: {
    async login({ identifier, Password }) {
      try {
        const res = await axios.post('/staffs/login', {
          identifier,
          Password,
        })

        if (res.data.token) {
          this.accessToken = res.data.token
          this.adminInfo = res.data.nhanvien

          sessionStorage.setItem('adminToken', res.data.token)
          sessionStorage.setItem('adminInfo', JSON.stringify(res.data.nhanvien))
        }

        return res.data
      } catch (err) {
        console.error('Đăng nhập thất bại:', err)
        throw err.response?.data || { message: 'Lỗi không xác định khi đăng nhập' }
      }
    },

    logout() {
      this.accessToken = ''
      this.adminInfo = null
      sessionStorage.removeItem('adminToken')
      sessionStorage.removeItem('adminInfo')
      router.push('/')
    },
  },
})
