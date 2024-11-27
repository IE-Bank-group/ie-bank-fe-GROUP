<template>
  <div class="register-background">
    <div class="register-container">
      <h1>Register</h1>
      <div class="input-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" placeholder="Enter your username" />
      </div>
      <div class="input-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" />
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" />
      </div>
      <div class="input-group">
        <label for="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          v-model="confirmPassword"
          placeholder="Confirm your password"
        />
      </div>
      <button @click="register">Register</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    register() {
      if (!this.username || !this.email || !this.password || !this.confirmPassword) {
        alert('Please fill in all fields.');
        return;
      }

      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Example registration logic
      console.log('User registered:', {
        username: this.username,
        email: this.email,
        password: this.password
      });

      // Redirect or confirm registration
      alert('Registration successful!');
      this.$router.push('/login'); // Navigate to the login page after registration
    }
  }
};
</script>

<style>
/* Add background image to the entire page */
.register-background {
  background: url('C:\Users\Fynnj\Desktop\DEVOPS\ie-bank-fe-GROUP\images\background.jpeg') no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Center everything inside the register container */
.register-container {
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
  width: 250px; /* Shorter width */
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%; /* Full width of container */
  padding: 8px;
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
  width: 250px; /* Match input width */
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
