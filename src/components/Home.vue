<template>
    <div class="jumbotron vertical-center">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <h1>IE Bank - Home</h1>
            <hr />
            <br />
 
            <button
              type="button"
              class="btn btn-success btn-sm"
              @click="navigateToAccounts"
            >
              Manage Bank Accounts
            </button>
            <br /><br />
 
            <!-- Add the large photo below the button -->
            <img src="../assets/bank_background_photo.png" alt="Banking photo" class="large-photo" />
 
            <footer class="text-center">
              Copyright &copy; All Rights Reserved.
            </footer>
          </div>
        </div>
      </div>
    </div>
  </template>

<style>
.large-photo {
  width: 100%;
  height: auto;
  max-width: 1024px; /* Adjust the max-width as needed */
  display: block;
  margin: 0% left; /* Center the image */
}
</style>

<script>
export default {
  methods: {
    navigateToAccounts() {
      this.$router.push('/accounts');
    }
  }
}
</script>