async function call_agent(message) {
    const url = "https://paqbp62e85.execute-api.us-east-1.amazonaws.com/dev/";
  
    // Define the headers
    const headers = {
      "Content-Type": "application/json"
    };
  
    // Define the JSON payload
    const payload = {
      system: {
        content: "helpful appointment scheduler receptionist, find out if the user would like to schedule an appointment and collect their phone number."
      },
      user: {
        content: message
      }
    };
    console.log("Sending Payload")
    // Make the POST request to the API endpoint
    try {
      console.log("url", url)
      console.log("headers", headers)
      console.log("payload", payload)
      console.log()
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
      });
      console.log("Got Response")
      console.log(response)
      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      console.log("Full response data:", data); // Log entire response data for inspection
      return { text: data.body.content || "Something went wrong", role: "agent" };
    } catch (error) {
      console.log("Caught Error")
      console.error("Error:", error);
      return { text: "I'm having trouble connecting right now. Please try again later.", role: "agent" };
    }
  }
  
  // Using `.then()` to log the response
  call_agent('message').then(response => console.log(response));
