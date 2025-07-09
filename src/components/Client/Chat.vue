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

    <!-- Overlay và khung chat -->
    <div v-if="isChatOpen" class="chat-overlay" @click.self="closeChat">
      <div class="chat-box shadow">
        <!-- Header -->
        <div class="chat-header d-flex justify-content-between align-items-center">
          <strong>ChatBot NLN</strong>
          <button class="close-btn" @click="closeChat">×</button>
        </div>

        <!-- Tin nhắn -->
        <div class="chat-messages">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="msg.sender === 'user' ? 'msg-user' : 'msg-bot'"
          >
            <span>{{ msg.text }}</span>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-area">
          <input
            type="text"
            v-model="userInput"
            class="chat-input form-control"
            placeholder="Nhập câu hỏi..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage" class="chat-send btn btn-primary">Gửi</button>
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
  text-align: right;
}

.msg-bot {
  text-align: left;
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
