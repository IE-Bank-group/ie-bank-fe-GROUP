<template>
  <div class="login-background">
    <div class="login-container">
      <p class="title">Login </p>
      <div class="input-group">
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
          required
        />
      </div>
      <div class="back-button-container">
        <button class="back-button" @click="navigateHome">
          <i class="fas fa-arrow-left"></i> Home
        </button>
      </div>
      <div class="input-group">
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <button @click="login">Login</button>
      <p class="register-link">
        Don't have an account?
        <router-link to="/register" class="link">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { trackEvent } from "../appInsights";

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    // Login handler
    login() {
      if (!this.username || !this.password) {
        alert("Please fill in both fields.");
        // Log failed validation event
        trackEvent("LoginValidationFailed", {
          username: this.username,
        });
        return;
      }
      trackEvent("LoginValidationPassed", {username: this.username,});
      this.RESTlogin(this.username, this.password);
    },
    navigateHome() {
      this.$router.push('/');
    },
    // Login method
    RESTlogin(username, password) {
      const path = `${process.env.VUE_APP_ROOT_URL}/login`;
      const payload = { username, password };
      trackEvent("LoginAttempt", { username });

      axios
        .post(path, payload, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          // Store user info and session data
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userRole", response.data.user.role || "user");
          localStorage.setItem("userId", response.data.user.id);

          // Store the auth token
          if (response.data.token) {
            localStorage.setItem("authToken", response.data.token);
            trackEvent("AuthTokenStored", { token: response.data.token }); // Log the stored token
          } else {
            trackEvent("AuthTokenNotFound", { error: "Token not found in response" });
          }

          // Log successful login event
          trackEvent("LoginSuccess", {
            username,
            role: response.data.user.role || "user",
          });

          // Welcome message
          alert(`Welcome back, ${response.data.user.username || username}!`);

          // Redirect based on role
          if (response.data.user.role === "admin") {
            this.$router.push("/admin");
          } else {
            this.$router.push("/user");
          }
        })
        .catch((error) => {
          localStorage.clear(); // Clear any existing auth data
          trackEvent("LoginError", {username, errorMessage: error.response?.data?.message || error.message,});
          alert("Login failed. Please check your credentials.");
        });
    },
  },
  beforeDestroy() {
    this.username = '';
    this.password = '';
  }
};
</script>


<style scoped>
/* Add background image to the entire page */
.login-background {
  background: url("C:\\Users\\Fynnj\\Desktop\\DEVOPS\\ie-bank-fe-GROUP\\images\\background.jpeg")
    no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.back-button-container {
  position: absolute;
  top: 15px; /* Adjust to position within the banner */
  left: 15px; /* Adjust to position within the banner */
  z-index: 1000; /* Make sure it is on top of other elements */
}

.back-button {
  padding: 0.9rem 1.8rem;
}

.back-button i {
  font-size: 16px; /* Icon size */
}
/* Center everything inside the login container */
.login-container {
  background: rgba(128, 128, 128, 0.7); /* Grey color with 70% transparency */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

/* Input groups */
.input-group {
  margin-bottom: 15px;
}

input {
  width: 250px; /* Fixed width to prevent stretching */
  padding: 10px; /* Add padding inside the input box */
  margin: 0 auto; /* Center the input box */
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* Button styling */
button {
  display: inline-block;
  padding: 0.6rem 6.34rem;
  font-size: 16px;
  font-weight: 700;
  color: white;
  border: 3px solid #007bff;
  cursor: pointer;
  position: relative;
  background-color: #007bff;
  text-decoration: none;
  overflow: hidden;
  z-index: 1;
  border-radius: 5px;
  font-family: inherit;
}
button::before {
 content: "";
 position: absolute;
 left: 0;
 top: 0;
 width: 100%;
 height: 100%;
 background-color: rgb(0, 26, 255);
 transform: translateX(-105%);
 transition: all .3s;
 z-index: -1;
}

button:hover::before {
 transform: translateX(0);
}

/* Error message styling */
.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 15px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: #007bff;
}

.title::before {
  width: 18px;
  height: 18px;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: #007bff;
}
@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }

  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
/* Register link styling */
.register-link {
  margin-top: 15px;
  color: white;
}

.link {
  color: #007bff;
  text-decoration: underline;
}

.link:hover {
  color: #0056b3;
}
</style>
