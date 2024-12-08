<template>
  <div>
    <!-- Thinner Blue Top Banner -->
    <div class="top-banner">
      <div class="container d-flex justify-content-between align-items-center">
        <h1 class="bank-title">NEXTBank</h1>
        <div class="auth-buttons">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="navigateToLogin"
          >
            Login
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click="navigateToRegister"
          >
            Register
          </button>
        </div>
      </div>
    </div>

    <!-- Large Background Image -->
    <div class="background-section">
      <!-- Background image set via CSS -->
    </div>

    <!-- Information Sections -->
    <div class="info-sections container">
      <div class="row">
        <div class="col-md-4 text-center">
          <h2>Secure Banking</h2>
          <p>Your security is our priority. Experience safe and reliable banking.</p>
        </div>
        <div class="col-md-4 text-center">
          <h2>Easy Transactions</h2>
          <p>Seamlessly transfer funds, pay bills, and manage your finances.</p>
        </div>
        <div class="col-md-4 text-center">
          <h2>Customer Support</h2>
          <p>Need help? Our dedicated team is here 24/7 to assist you.</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center">
      <p>Copyright &copy; All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  methods: {
    navigateToLogin() {
      this.$router.push("/login");
    },
    navigateToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style>
/* Remove Gap Between Banner and Top */
body,
html {
  margin: 0;
  padding: 0;
}
#app {
  margin: 0 auto;
  padding: 0;
  font-weight: normal;
}
.top-banner {
  background-color: #007bff; /* Blue background */
  color: white;
  padding: 10px 0; /* Thinner padding */
  position: relative;
  top: 0;
  width: 100%; /* Full width */
}
/* From Uiverse.io by ernestnash */ 
.btn {
 display: inline-block;
 padding: 0.9rem 1.8rem;
 font-size: 16px;
 font-weight: 700;
 color: white;
 border: 3px solid rgb(0, 26, 255);
 cursor: pointer;
 position: relative;
 background-color: transparent;
 color: white;
 text-decoration: none;
 overflow: hidden;
 z-index: 1;
 font-family: inherit;
}

.btn::before {
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

.btn:hover::before {
 transform: translateX(0);
}
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn:hover::before {
 transform: translateX(0);
}

.bank-title {
  margin: 0;
  font-size: 1.5rem;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-buttons .btn {
  font-size: 0.9rem;
  padding: 5px 15px;
}

/* Background Image */
.background-section {
  position: relative;
  width: 100%;
  height: 400px; /* Adjust height as needed */
  background-image: url('@/assets/background.jpeg'); /* Set your image path */
  background-size: cover; /* Ensures the image covers the section */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent tiling */
}


/* Info Sections */
.info-sections {
  padding: 40px 20px;
}

.info-sections .col-md-4 {
  margin-bottom: 20px;
}

.info-sections h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.info-sections p {
  font-size: 1rem;
  color: #555;
}

/* Footer */
footer {
  margin-top: 20px;
  padding: 20px 0;
  background-color: #f8f9fa;
  color: #6c757d;
}
</style>
