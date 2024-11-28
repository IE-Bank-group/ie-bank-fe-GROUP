<template>
  <div class="login-background">
    <div class="login-container">
      <h1>Login</h1>
      <div class="input-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" placeholder="Enter your username" />
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" />
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <button @click="login">Login</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '', // Store error messages to display
    };
  },
  methods: {
    async login() {
      if (this.username && this.password) {
        try {
          const response = await axios.post(
            `${process.env.VUE_APP_ROOT_URL}/loginuser`,
            {
              username: this.username,
              password: this.password,
            }
          );

          // If login is successful
          if (response.status === 200) {
            const { token, admin, username } = response.data;

            // Save token and user details in localStorage
            localStorage.setItem('authToken', token); // Save the token
            localStorage.setItem('username', username); // Save the username
            localStorage.setItem('admin', admin); // Save admin status

            // Set global username (if needed)
            this.$root.username = username;

            console.log(`Logged in user: ${username}`); // Debugging log

            // Redirect based on user role
            if (admin) {
              this.$router.push("/users"); // Redirect to admin panel
            } else {
              this.$router.push("/accounts"); // Redirect to user accounts page
            }
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            this.errorMessage = 'Invalid username or password.';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        }
      } else {
        this.errorMessage = 'Please enter both username and password.';
      }
    }

  },
};
</script>

<style>
/* Add background image to the entire page */
.login-background {
  background: url('C:\Users\Fynnj\Desktop\DEVOPS\ie-bank-fe-GROUP\images\background.jpeg') no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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

label {
  display: block;
  margin-bottom: 5px;
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
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 250px; /* Match input width for consistency */
}
.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 15px;
}

button:hover {
  background-color: #0056b3;
}
/* H1 styling */
h1 {
  color: white;
  font-family: 'Montserrat', 'Poppins', sans-serif;
}
</style>
