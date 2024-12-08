<template>
  <div class="register-background">
    <div class="back-button-container">
      <button class="back-button" @click="navigateHome">
        <i class="fas fa-arrow-left"></i> Home
      </button>
    </div>
    <div class="register-container">
      <h1>Register</h1>
      <b-alert v-if="showAlert" :variant="alertVariant" show>{{ message }}</b-alert>
      <b-form @submit.prevent="handleRegister" class="register-form">
        <b-form-group :state="usernameState" invalid-feedback="Username must be at least 6 characters long.">
          <b-form-input v-model="username" placeholder="Enter your username" required></b-form-input>
        </b-form-group>
        <b-form-group :state="emailState" invalid-feedback="Please enter a valid email address.">
          <b-form-input type="email" v-model="email" placeholder="Enter your email" required></b-form-input>
        </b-form-group>
        <b-form-group :state="passwordState" invalid-feedback="Password must contain letters and at least one number.">
          <b-form-input type="password" v-model="password" placeholder="Enter your password" required></b-form-input>
        </b-form-group>
        <b-form-group :state="dobState" invalid-feedback="You must be at least 18 years old to register.">
          <b-form-input type="date" v-model="date_of_birth" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="button" variant="primary">Register</b-button>
        <p class="login-link">
          Already have an account?
          <router-link to="/login" class="link">Log in here</router-link>
        </p>
      </b-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { trackEvent } from '../appInsights';

export default {
  data() {
    return {
      id: '',
      username: '',
      email: '',
      password: '',
      date_of_birth: '',
      role: '',
      status: '',
      message: "",
      alertVariant: "",
      showAlert: false,
      usernameState: null,
      emailState: null,
      passwordState: null,
      dobState: null,
    };
  },
  methods: {
    handleRegister() {
      let isValid = true;

      // username check errors
      if (this.username.length < 6) {
        this.usernameState = false;
        isValid = false;
      } else {
        this.usernameState = true;
      }

      // email check errors
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.emailState = false;
        isValid = false;
      } else {
        this.emailState = true;
      }

      // password check errors
      const passwordRegex = /^(?=.*[0-9])[a-zA-Z0-9]+$/;
      if (!passwordRegex.test(this.password) || this.password.length < 8) {
        this.passwordState = false;
        isValid = false;
      } else {
        this.passwordState = true;
      }

      // date of birth check errors
      const today = new Date();
      const birthDate = new Date(this.date_of_birth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference =
        today.getMonth() - birthDate.getMonth() +
        (today.getDate() < birthDate.getDate() ? -1 : 0);
      if (isNaN(birthDate) || age < 18 || (age === 18 && monthDifference < 0)) {
        this.dobState = false;
        isValid = false;
      } else {
        this.dobState = true;
      }

      if (!isValid) {
        this.showMessage('Please correct the highlighted fields.', 'danger');
        // Log failed validation event
        trackEvent('RegisterValidationFailed', {
          username: this.username,
          email: this.email,
          date_of_birth: this.date_of_birth,
        });
        return;
      }
      // Log successful validation event
      trackEvent('RegisterValidationPassed', {
        username: this.username,
        email: this.email,
        date_of_birth: this.date_of_birth,
      });

      // Proceed with registration if all validations pass
      this.showMessage('Validation successful! Registering...', 'success');
      setTimeout(() => this.RESTregister(), 2000);
    },
    navigateHome() {
    this.$router.push("/");
    },
    // Show alert message
    showMessage(message, variant) {
      this.message = message;
      this.alertVariant = variant;
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    },

    RESTregister() {
      const path = `${process.env.VUE_APP_ROOT_URL}/register`; // Backend API URL

      // Prepare the payload with form data
      const payload = {
        username: this.username,
        email: this.email,
        password: this.password,
        date_of_birth: this.date_of_birth,
      };
      console.log(payload)

      // Log registration attempt
      trackEvent('RegisterAttempt', {
        username: this.username,
        email: this.email,
      });

      axios
        .post(path, payload) // Send POST request with the payload
        .then((response) => {  
          // Log successful registration event
          trackEvent('RegisterSuccess', {
            username: this.username,
            email: this.email,
          });

          this.showMessage('Registration successful! Redirecting...', 'success');
          this.$router.push("/login"); // Redirect to the login page
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
          // Log registration error event
          trackEvent('RegisterError', {
            username: this.username,
            email: this.email,
            errorMessage,
          });
          this.showMessage(errorMessage, 'danger');
        });
    },
  },
};
</script>

<style scoped>
/* Background with image */
.register-background {
  background: url('@/assets/background.jpeg')
    no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Center container */
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

/* Form styling */
.register-form {
  width: 300px;
  display: flex;
  flex-direction: column;
}

b-form-group {
  margin-bottom: 15px;
}

b-form-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

b-form-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
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
.back-button-container {
  position: absolute;
  top: 15px; /* Adjust to position within the banner */
  left: 15px; /* Adjust to position within the banner */
  z-index: 1000; /* Make sure it is on top of other elements */
}

.back-button {
  background-color: #007bff; /* Blue background to match the banner */
  color: white;
  border: none;
  padding: 0.9rem 1.8rem;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  border: 3px solid #007bff;
  display: flex;
  align-items: center;
  gap: 5px; /* Space between arrow icon and text */
  transition: background-color 0.3s;
}

.back-button i {
  font-size: 16px; /* Icon size */
}

/* Link styling */
.login-link {
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

/* Title and subtitle styling */
h1 {
  color: white;
  font-family: "Montserrat", "Poppins", sans-serif;
  margin-bottom: 10px;
}

p {
  color: white;
  font-family: "Poppins", sans-serif;
}
</style>


