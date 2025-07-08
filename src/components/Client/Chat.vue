<template>
  <div class="chat-container">
    <!-- Nút mở chat -->
    <img
      v-if="!isChatOpen"
      src="@/assets/ChatGPT.png"
      alt="ChatGPT Logo"
      class="chat-image"
      @click="openChat"
    />

    <!-- Khung chat + overlay -->
    <div v-if="isChatOpen" class="chat-overlay" @click.self="closeChat">
      <div class="chat-box">
        <div class="chat-header">
          <strong>ChatBot NLN</strong>
          <button class="close-btn" @click="closeChat">×</button>
        </div>

        <div class="chat-messages">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="msg.sender === 'user' ? 'msg-user' : 'msg-bot'"
          >
            <span>{{ msg.text }}</span>
          </div>
        </div>

        <div class="chat-input-area">
          <input
            type="text"
            v-model="userInput"
            class="chat-input"
            placeholder="Nhập câu hỏi..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage" class="chat-send">Gửi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      // Hiển thị tin nhắn chào nếu chưa có tin nhắn nào
      if (this.messages.length === 0) {
        this.messages.push({
          sender: "bot",
          text: "Xin chào bạn đến với Thư viện! Hãy đặt cho tôi câu hỏi bất kỳ về sách, thư viện,... Tôi sẽ trả lời cho bạn!!!",
        });
      }
      this.$nextTick(() => this.scrollToBottom());
    },
    closeChat() {
      this.isChatOpen = false;
    },
    sendMessage() {
      const text = this.userInput.trim();
      if (!text) return;

      this.messages.push({ sender: "user", text });
      this.userInput = "";

      this.$nextTick(() => this.scrollToBottom());

      // Phản hồi mẫu sau 500ms
      setTimeout(() => {
        this.messages.push({
          sender: "bot",
          text: "Cảm ơn bạn đã hỏi! (Đây là phản hồi mẫu)",
        });
        this.$nextTick(() => this.scrollToBottom());
      }, 500);
    },
    scrollToBottom() {
      const container = this.$el.querySelector(".chat-messages");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 50px;
  right: 50px;
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
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 20px;
}

.chat-box {
  width: 360px;
  height: 500px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.chat-header {
  background-color: #007bff;
  color: white;
  padding: 12px;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.msg-user {
  text-align: right;
  margin-bottom: 10px;
}

.msg-bot {
  text-align: left;
  margin-bottom: 10px;
}

.msg-user span,
.msg-bot span {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 18px;
  background-color: #a2bad3;
  color: #000000;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 16px;
}

.msg-user span {
  background-color: #007bff;
  color: white;
}

.chat-input-area {
  display: flex;
  border-top: 1px solid #ddd;
  padding: 8px;
  background-color: white;
}

.chat-input {
  flex: 1;
  border: none;
  padding: 12px;
  font-size: 16px;
  outline: none;
}

.chat-send {
  border: none;
  background-color: #007bff;
  color: white;
  padding: 12px 18px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 6px;
}

.chat-send:hover {
  background-color: #0056b3;
}
</style>
