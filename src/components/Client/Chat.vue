<template>
  <div class="chat-container">
    <!-- Nút mở chat -->
    <img v-if="!isChatOpen" src="@/assets/ChatGPT.png" alt="ChatGPT Logo" class="chat-image" @click="openChat" />

    <!-- Overlay và khung chat -->
    <div v-if="isChatOpen" class="chat-overlay" @click.self="closeChat">
      <div class="chat-box shadow">
        <!-- Header -->
        <div class="chat-header d-flex justify-content-between align-items-center">
          <strong>ChatBot NLN</strong>
          <button class="close-btn" @click="closeChat">×</button>
        </div>

        <!-- Tin nhắn -->
        <div class="chat-messages" ref="chatMessages">
          <div v-for="(msg, index) in messages" :key="index" :class="msg.sender === 'user' ? 'msg-user' : 'msg-bot'">
            <span v-if="msg.sender === 'user'">{{ msg.text }}</span>
            <span v-else v-html="msg.text" @click="handleMessageClick"></span>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-area">
          <input type="text" v-model="userInput" class="chat-input form-control" placeholder="Nhập câu hỏi..."
            @keyup.enter="sendMessage" />
          <button @click="sendMessage" class="chat-send btn btn-primary">Gửi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
export default {
  name: "Chat",
  data() {
    return {
      isChatOpen: false,
      userInput: "",
      messages: [],
    };
  },
  methods: {
    openChat() {
      this.isChatOpen = true;
      if (this.messages.length === 0) {
        this.messages.push({
          sender: "bot",
          text: "👋 Xin chào! Bạn muốn hỏi gì về sách, tác giả hay thư viện? Tôi luôn sẵn sàng giúp đỡ.",
        });
      }
      this.$nextTick(() => this.scrollToBottom());
    },
    closeChat() {
      this.isChatOpen = false;
    },
    async sendMessage() {
      const text = this.userInput.trim();
      if (!text) return;

      this.messages.push({ sender: "user", text });
      this.userInput = "";
      this.$nextTick(() => this.scrollToBottom());

      try {
        const res = await axios.post("http://localhost:5000/api/chatbot/chat", {
          message: text,
        });

        this.messages.push({
          sender: "bot",
          text: res.data.response || "🤖 Tôi không hiểu ý bạn, hãy hỏi rõ hơn nhé.",
        });
      } catch (err) {
        console.error("Chat error:", err);
        this.messages.push({
          sender: "bot",
          text: "Bạn hãy đăng nhập để có thể chat với tôi.",
        });
      }

      this.$nextTick(() => this.scrollToBottom());
    },
    handleMessageClick(event) {
      // Kiểm tra nếu click vào element có class "detail-link"
      if (event.target.classList.contains('detail-link')) {
        const bookId = event.target.getAttribute('data-book-id');
        if (bookId) {
          // Đóng chat trước khi navigate
          this.closeChat();
          // Sử dụng router để chuyển trang
          this.$router.push(`/book/${bookId}`);
        }
      }
    },
    scrollToBottom() {
      const container = this.$el.querySelector(".chat-messages");
      if (container) container.scrollTop = container.scrollHeight;
    },
  },
};
</script>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
}

.chat-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.chat-image:hover {
  transform: scale(1.1);
}

.chat-overlay {
  position: fixed;
  inset: 0;
  background: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 16px;
}

.chat-box {
  width: 100%;
  max-width: 360px;
  height: 500px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background-color: #007bff;
  color: white;
  padding: 12px 16px;
  font-size: 18px;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #f8f8f8;
}

.msg-user,
.msg-bot {
  margin-bottom: 10px;
}

.msg-user {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.msg-bot {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.msg-user span,
.msg-bot span {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 18px;
  background-color: #a2bad3;
  color: #000;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 16px;
}

.msg-user span {
  background-color: #007bff;
  color: white;
}

/* Style cho link "Xem chi tiết" */
.msg-bot span :deep(.detail-link) {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
}

.msg-bot span :deep(.detail-link):hover {
  color: #0056b3;
  text-decoration: none;
}

.chat-input-area {
  display: flex;
  gap: 6px;
  border-top: 1px solid #ddd;
  padding: 10px;
  background-color: white;
}

.chat-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.chat-send {
  white-space: nowrap;
}
</style>