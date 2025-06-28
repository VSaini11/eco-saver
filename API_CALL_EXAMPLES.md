// ✅ CORRECT way to call API from client-side components

const createUser = async (userData) => {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("User creation result:", result);
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || "User creation failed");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// ❌ WRONG - Don't use full URLs for same-domain API calls
// const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users`, {

// ✅ CORRECT - Use relative URLs for same-domain API calls  
// const res = await fetch("/api/users", {
