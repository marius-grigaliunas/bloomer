// Create a simple test function to verify API connectivity
async function testChutesConnection() {
    try {

        const url = `${process.env.EXPO_PUBLIC_DEEPSEEK_CHUTES_ENDPOINT}`

        const response = await fetch(url , {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.EXPO_PUBLIC_DEEPSEEK_CHUTES_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek-ai/DeepSeek-V3-0324",
          "messages": [{ "role": "user", "content": "Hello" }],
          "stream": false,
          "max_tokens": 10,
          "temperature": 0.7
        })
      });
      console.log("Status:", response.status);
      console.log("Response:", await response.text());
    } catch(e) {
      console.error("Connection test error:", e);
    }
  }

  export {testChutesConnection}