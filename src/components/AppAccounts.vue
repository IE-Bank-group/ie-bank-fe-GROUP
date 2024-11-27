<template>
  <div>
    <!-- Thinner Blue Top Banner -->
    <div class="top-banner">
      <div class="container d-flex justify-content-between align-items-center">
        <h1 class="bank-title">IE Bank</h1>
        <div class="auth-buttons">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="navigateToHome"
          >
            Home
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
        <div class="col-md-12 text-center">
          <h1>Accounts</h1>
          <p>Manage all your bank accounts easily in one place.</p>
          <hr />
          <b-alert v-if="showMessage" variant="success" show>{{ message }}</b-alert>
          <button type="button" class="btn btn-primary btn-sm" v-b-modal.account-modal
          >
            Create Account
          </button>
          <br /><br />
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Account Name</th>
                <th scope="col">Account Country</th>
                <th scope="col">Account Number</th>
                <th scope="col">Account Balance</th>
                <th scope="col">Account Currency</th>
                <th scope="col">Account Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in accounts" :key="account.id">
                <td>{{ account.name }}</td>
                <td>{{ account.country }}</td>
                <td>{{ account.account_number }}</td>
                <td>{{ account.balance }}</td>
                <td>{{ account.currency }}</td>
                <td>
                  <span
                    v-if="account.status == 'Active'"
                    class="badge badge-success"
                    >{{ account.status }}</span
                  >
                  <span v-else class="badge badge-danger">{{ account.status }}</span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      type="button"
                      class="btn btn-info btn-sm"
                      v-b-modal.edit-account-modal
                      @click="editAccount(account)"
                      title="Edit"
                      style="width: 40px;"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="deleteAccount(account)"
                      title="Delete"
                      style="width: 40px;"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-success btn-sm"
                      v-b-modal.transfer-money-modal
                      @click="initiateTransfer(account)"
                      title="Transfer Money"
                      style="width: 40px;"
                    >
                      <i class="fas fa-dollar-sign"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center">
      <p>Copyright &copy; All Rights Reserved.</p>
    </footer>

    <!-- Start of Modal for Create Account -->
    <b-modal
      ref="addAccountModal"
      id="account-modal"
      title="Create a new account"
      hide-backdrop
      hide-footer
    >
      <b-form @submit="onSubmit" class="w-100">
        <b-form-group
          id="form-name-group"
          label="Account Name:"
          label-for="form-name-input"
        >
          <b-form-input
            id="form-name-input"
            type="text"
            v-model="createAccountForm.name"
            placeholder="Account Name"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="form-currency-group"
          label="Currency:"
          label-for="form-currency-input"
        >
          <b-form-input
            id="form-currency-input"
            type="text"
            v-model="createAccountForm.currency"
            placeholder="$ or €"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="form-country-group"
          label="Country:"
          label-for="form-country-input"
        >
          <b-form-input
            id="form-country-input"
            type="text"
            v-model="createAccountForm.country"
            placeholder="Country"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="outline-info">Submit</b-button>
      </b-form>
    </b-modal>
    <!-- End of Modal for Create Account -->

    <!-- Start of Modal for Edit Account -->
    <b-modal
      ref="editAccountModal"
      id="edit-account-modal"
      title="Edit the account"
      hide-backdrop
      hide-footer
    >
      <b-form @submit="onSubmitUpdate" class="w-100">
        <b-form-group
          id="form-edit-name-group"
          label="Account Name:"
          label-for="form-edit-name-input"
        >
          <b-form-input
            id="form-edit-name-input"
            type="text"
            v-model="editAccountForm.name"
            placeholder="Account Name"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="form-edit-country-group"
          label="Country:"
          label-for="form-edit-country-input"
        >
          <b-form-input
            id="form-edit-country-input"
            type="text"
            v-model="editAccountForm.country"
            placeholder="Country"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="outline-info">Update</b-button>
      </b-form>
    </b-modal>
    <!-- End of Modal for Edit Account -->
    <!-- Start of Modal for Transfer Money -->
    <b-modal
      ref="transferMoneyModal"
      id="transfer-money-modal"
      title="Transfer Money"
      hide-backdrop
      hide-footer
    >
      <b-form @submit="onSubmitTransfer" class="w-100">
        <b-form-group
          id="form-sender-group"
          label="Sender Account:"
          label-for="form-sender-input"
        >
          <b-form-input
            id="form-sender-input"
            type="text"
            v-model="transferForm.senderAccount"
            :readonly="true"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="form-recipient-group"
          label="Recipient Account:"
          label-for="form-recipient-input"
        >
          <b-form-input
            id="form-recipient-input"
            type="text"
            v-model="transferForm.recipientAccount"
            placeholder="Enter recipient account number"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="form-amount-group"
          label="Amount:"
          label-for="form-amount-input"
        >
          <b-form-input
            id="form-amount-input"
            type="number"
            v-model="transferForm.amount"
            placeholder="Enter amount to transfer"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="form-note-group"
          label="Note (Optional):"
          label-for="form-note-input"
        >
          <b-form-textarea
            id="form-note-input"
            v-model="transferForm.note"
            placeholder="Add a note (optional)"
          ></b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="outline-info">Transfer</b-button>
      </b-form>
    </b-modal>
    <!-- End of Modal for Transfer Money -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AppAccounts",
  data() {
    return {
      accounts: [],
      createAccountForm: {
        name: "",
        currency: "",
        country: "",
      },
      editAccountForm: {
        id: "",
        name: "",
        country: "",
      },
      transferForm: {
      senderAccount: "",
      recipientAccount: "",
      amount: "",
      note: "",
      },
      showMessage: false,
      message: "",
    };
  },
  methods: {
    navigateToHome() {
      this.$router.push("/");
    },
    /***************************************************
     * RESTful requests
     ***************************************************/

    //GET function
    RESTgetAccounts() {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts`;
      axios
        .get(path)
        .then((response) => {
          this.accounts = response.data.accounts;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // POST function
    RESTcreateAccount(payload) {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts`;
      axios
        .post(path, payload)
        .then((response) => {
          this.RESTgetAccounts();
          // For message alert
          this.message = "Account Created succesfully!";
          // To actually show the message
          this.showMessage = true;
          // To hide the message after 3 seconds
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          this.RESTgetAccounts();
        });
    },

    // Update function
    RESTupdateAccount(payload, accountId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts/${accountId}`;
      axios
        .put(path, payload)
        .then((response) => {
          this.RESTgetAccounts();
          // For message alert
          this.message = "Account Updated succesfully!";
          // To actually show the message
          this.showMessage = true;
          // To hide the message after 3 seconds
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          this.RESTgetAccounts();
        });
    },

    // Delete account
    RESTdeleteAccount(accountId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts/${accountId}`;
      axios
        .delete(path)
        .then((response) => {
          this.RESTgetAccounts();
          // For message alert
          this.message = "Account Deleted succesfully!";
          // To actually show the message
          this.showMessage = true;
          // To hide the message after 3 seconds
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          this.RESTgetAccounts();
        });
    },

    /***************************************************
     * FORM MANAGEMENT
     * *************************************************/

    // Initialize forms empty
    initForm() {
      this.createAccountForm.name = "";
      this.createAccountForm.currency = "";
      this.createAccountForm.country = "";
      this.editAccountForm.id = "";
      this.editAccountForm.name = "";
    },

    // Handle submit event for create account
    onSubmit(e) {
      e.preventDefault(); //prevent default form submit form the browser
      this.$refs.addAccountModal.hide(); //hide the modal when submitted
      const payload = {
        name: this.createAccountForm.name,
        currency: this.createAccountForm.currency,
        country: this.createAccountForm.country,
      };
      this.RESTcreateAccount(payload);
      this.initForm();
    },

    // Handle submit event for edit account
    onSubmitUpdate(e) {
      e.preventDefault(); //prevent default form submit form the browser
      this.$refs.editAccountModal.hide(); //hide the modal when submitted
      const payload = {
        name: this.editAccountForm.name,
        country: this.editAccountForm.country,
      };
      this.RESTupdateAccount(payload, this.editAccountForm.id);
      this.initForm();
    },

    // Handle edit button
    editAccount(account) {
      this.editAccountForm = account;
    },

    // Handle Delete button
    deleteAccount(account) {
      this.RESTdeleteAccount(account.id);
    },
    // Initialize transfer form and open modal
    initiateTransfer(account) {
      this.transferForm.senderAccount = account.account_number;
      this.transferForm.recipientAccount = "";
      this.transferForm.amount = "";
      this.transferForm.note = "";
    },

    // Handle submit event for transfer
    onSubmitTransfer(e) {
      e.preventDefault();
      const payload = {
        sender: this.transferForm.senderAccount,
        recipient: this.transferForm.recipientAccount,
        amount: this.transferForm.amount,
        note: this.transferForm.note,
      };
      this.RESTtransferMoney(payload);
      this.$refs.transferMoneyModal.hide(); // Hide the modal after submission
    },

    // API call to transfer money
    RESTtransferMoney(payload) {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts/transfer`;
      axios
        .post(path, payload)
        .then((response) => {
          this.RESTgetAccounts(); // Refresh account data
          this.message = "Transfer successful!";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error("Transfer failed:", error);
        });
    },

  },

  /***************************************************
   * LIFECYClE HOOKS
   ***************************************************/
  created() {
    this.RESTgetAccounts();
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

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  background-image: url('C:\Users\Fynnj\Desktop\DEVOPS\ie-bank-fe-GROUP\images\background.jpeg'); /* Set your image path */
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
