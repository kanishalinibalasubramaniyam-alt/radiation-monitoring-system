// EMERGENCY FIX FOR RADSAFE FRONTEND
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
  if (url.includes("/api/auth/register")) {
    console.log("🛠️ EMERGENCY FIX: Ensuring POST method for registration");
    options.method = "POST";
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers
    };
    
    if (!options.body) {
      const form = document.querySelector("form");
      if (form) {
        const formData = {
          name: form.querySelector('[name="fullName"]')?.value || "Student",
          email: form.querySelector('[name="email"]')?.value || "student@project.com",
          password: form.querySelector('[name="password"]')?.value || "password123"
        };
        options.body = JSON.stringify(formData);
      }
    }
  }
  return originalFetch.call(this, url, options);
};

console.log("✅ RadSafe Emergency Fix Activated!");
