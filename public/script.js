function chatBot() {
    return {
        messages: [{
            from: 'bot',
            text: 'Hello! How can I help you today?'
        }],
        botTyping: false,

        async updateChat(inputElement) {
            const input = inputElement.value.trim();
            if (input) {
                this.messages.push({
                    from: 'user',
                    text: input
                });

                this.scrollChat();

                inputElement.value = '';
                this.botTyping = true;
                this.scrollChat();

                try {
                    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer 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",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "model": "deepseek/deepseek-r1-distill-llama-70b:free",
                            "messages": [{
                                "role": "user",
                                "content": input
                            }]
                        })
                    });

                    const data = await response.json();
                    const botResponse = data.choices?.[0]?.message?.content || 'Sorry, I didn’t understand that.';

                    // Send the question and response to the Node.js backend to save to the DB
                    await fetch("/save-to-db", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            question: input,
                            response: botResponse
                        })
                    });

                    setTimeout(() => {
                        this.botTyping = false;
                        this.messages.push({
                            from: 'bot',
                            text: botResponse
                        });
                        this.scrollChat();
                    }, 1500);
                } catch (error) {
                    setTimeout(() => {
                        this.botTyping = false;
                        this.messages.push({
                            from: 'bot',
                            text: 'There was an error. Please try again later.'
                        });
                        this.scrollChat();
                    }, 1500);
                }
            }
        },

        scrollChat() {
            const messagesContainer = document.getElementById("messages");
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };
}
