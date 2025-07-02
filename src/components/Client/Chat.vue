<template>
    <div class="chat-container">
        <img src="@/assets/ChatGPT.png" alt="ChatGPT Logo" class="chat-image" @click="toggleChat" />

        <div v-if="isChatOpen" class="chat-box">
            <div class="chat-header">
                <strong>ChatBot NLN</strong>
                <button class="close-btn" @click="toggleChat">×</button>
            </div>

            <div class="chat-messages">
                <div v-for="(msg, index) in messages" :key="index"
                    :class="msg.sender === 'user' ? 'msg-user' : 'msg-bot'">
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
        },
        sendMessage() {
            const text = this.userInput.trim();
            if (!text) return;

            this.messages.push({ sender: "user", text });

            setTimeout(() => {
                this.messages.push({
                    sender: "bot",
                    text: "Cảm ơn bạn đã hỏi! (Đây là phản hồi mẫu)"
                });
            }, 500);

            this.userInput = "";
        }
    }
};
</script>

<style scoped>
.chat-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
}

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
    width: 300px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.chat-header {
    background-color: #007bff;
    color: white;
    padding: 10px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
}

.chat-messages {
    max-height: 200px;
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
    padding: 8px 12px;
    border-radius: 18px;
    background-color: #e1f0ff;
    max-width: 80%;
    word-wrap: break-word;
}

.msg-user span {
    background-color: #007bff;
    color: white;
}

.chat-input-area {
    display: flex;
    border-top: 1px solid #ddd;
}

.chat-input {
    flex: 1;
    border: none;
    padding: 10px;
    outline: none;
    font-size: 14px;
}

.chat-send {
    border: none;
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.chat-send:hover {
    background-color: #0056b3;
}
</style>
  
