<template>
  <div class="chat-container">
    <img src="@/assets/ChatGPT.png" alt="ChatGPT Logo" class="chat-image" @click="toggleChat" />

    <div v-if="isChatOpen" class="chat-box">
      <div class="chat-header">
        <strong>ChatBot NLN</strong>
        <button class="close-btn" @click="toggleChat">×</button>
      </div>

      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" :class="msg.sender === 'user' ? 'msg-user' : 'msg-bot'">
          <span>{{ msg.text }}</span>
        </div>
      </div>

      <div class="chat-input-area">
        <input type="text" v-model="userInput" class="chat-input" placeholder="Nhập câu hỏi..."
          @keyup.enter="sendMessage" />
        <button @click="sendMessage" class="chat-send">Gửi</button>
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
      messages: []
    };
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
      this.$nextTick(() => this.scrollToBottom());
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
          text: "Cảm ơn bạn đã hỏi! (Đây là phản hồi mẫu)"
        });
        this.$nextTick(() => this.scrollToBottom());
      }, 500);
    },
    scrollToBottom() {
      const container = this.$el.querySelector(".chat-messages");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }
};
</script>

<style scoped>
.chat-image {
  max-width: 100px;
  margin: 10px auto;
  display: block;
  cursor: pointer;
  transition: transform 0.2s;
}

.chat-image:hover {
  transform: scale(1.05);
}

.chat-box {
  width: 400px;
  /* lớn hơn */
  height: 550px;
  /* cao hơn */
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 10px;
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
  /* chiếm toàn bộ chiều cao còn lại */
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
  /* màu chữ của bot */
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
}

.chat-send:hover {
  background-color: #0056b3;
}
</style>
