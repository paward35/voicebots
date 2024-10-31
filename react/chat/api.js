

async function call_customer(number) {
  const url = "https://paqbp62e85.execute-api.us-east-1.amazonaws.com/dev/VAPI/";
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({number})
    });
  } catch (error) {
    console.error("Error:", error);
    console.error("Unexpected error:", error.message);
    return { content: "I'm having trouble connecting right now. Please try again later.", role: "assistant" };
  }
}

call_customer("+12024079886")