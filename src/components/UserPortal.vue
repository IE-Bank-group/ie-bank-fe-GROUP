<template>
  <div>
    <!-- Blue Top Banner -->
    <div class="top-banner">
      <div class="container d-flex justify-content-between align-items-center">
        <h1 class="bank-title">User Portal</h1>
        <div class="auth-buttons">
          <button type="button" class="btn btn-danger btn-sm" @click="logout">Logout</button>
        </div>
      </div>
    </div>
    <!-- Large Background Image -->
    <div class="background-section">
      <!-- Background image set via CSS -->
    </div>
    <div class="user-portal">
      <!-- Accounts -->
      <h1 class="section-title">My Accounts</h1>
      <button class="btn-create" v-b-modal.account-modal>Create Account</button>

      <b-alert v-if="showMessage" :variant="alertVariant" show>
        {{ message }}
      </b-alert>

      <table class="table table-hover account-table">
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Account Number</th>
            <th>Balance</th>
            <th>Currency</th>
            <th>Country</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in accounts" :key="account.id">
            <td>{{ account.name }}</td>
            <td>{{ account.account_number }}</td>
            <td>{{ account.balance }}</td>
            <td>{{ account.currency }}</td>
            <td>{{ account.country }}</td>
            <td>
              <span v-if="account.status === 'Active'" class="badge badge-success">{{ account.status }}</span>
              <span v-else class="badge badge-danger">{{ account.status }}</span>
            </td>
            <td>
              <div class="btn-group">
                <button class="edit-button" @click="openUpdateAccountModal(account)">
                  <svg viewBox="0 0 512 512" class="svgIcon">
                    <path d="M497.9 142.1L369.9 14.1C362.3 6.5 351.6 0 339.3 0c-12.3 0-23 6.5-30.6 14.1L123 200.8c-2.6 2.6-4.5 5.9-5.3 9.5l-42 177.6c-4.3 18 10.6 34.3 29.3 30l177.5-42c3.7-.8 6.9-2.8 9.5-5.3l185.5-185.6c17-17.2 17-45 0-62zM124.3 366l24.8-104.6 79.8 79.8L124.3 366z"></path>
                  </svg>
                </button>
                <button class="delete-button" @click="deleteAccount(account.id)">
                  <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Transactions -->
      <h1 class="section-title">Recent Transactions</h1>
      <button class="btn-create" v-b-modal.transaction-modal>Create Transaction</button>

      <table class="table table-hover transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>From Account</th>
            <th>To Account</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.created_at }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ transaction.currency }}</td>
            <td>{{ transaction.from_account }}</td>
            <td>{{ transaction.to_account }}</td>
            <td>{{ transaction.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Account Modal -->
    <b-modal ref="accountModal" id="account-modal" title="Create Account" hide-footer>
      <b-form @submit.prevent="onSubmitAccount" class="modal-form">
        <b-form-group label="Account Name">
          <b-form-input v-model="createAccountForm.name" placeholder="Enter account name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Balance">
          <b-form-input type="number" v-model="createAccountForm.balance" placeholder="Enter positive balance" required></b-form-input>
        </b-form-group>
        <b-form-group label="Currency" :state="isCurrencyValid" invalid-feedback="Currency must be a valid symbol (e.g., EUR, USD)">
          <b-form-input v-model="createAccountForm.currency" placeholder="Enter currency (EUR, USD)" @input="validateCurrency" required></b-form-input>
        </b-form-group>
        <b-form-group label="Country">
          <b-form-input v-model="createAccountForm.country" placeholder="Enter country" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="modal-submit-button" variant="success">Create Account</b-button>
      </b-form>
    </b-modal>

    <!-- Create Transaction Modal -->
    <b-modal ref="transactionModal" id="transaction-modal" title="Create Transaction" hide-footer>
      <b-form @submit.prevent="onSubmitTransaction" class="modal-form">
        <b-form-group label="Amount">
          <b-form-input type="number" v-model="createTransactionForm.amount" placeholder="Enter transaction amount" required></b-form-input>
        </b-form-group>
        <b-form-group label="Currency" :state="isCurrencyValid" invalid-feedback="Currency must be a valid symbol (e.g., EUR, USD)">
          <b-form-input v-model="createTransactionForm.currency" placeholder="Enter currency (EUR, USD)" @input="validateCurrency" required></b-form-input>
        </b-form-group>
        <b-form-group label="From Account Number">
          <b-form-select v-model="createTransactionForm.from_account_number" :options="accountOptions" placeholder="Select an account number" required></b-form-select>
        </b-form-group>
        <b-form-group label="To Account Number" :state="isToAccountNumberValid" invalid-feedback="Account number must be numeric">
          <b-form-input v-model="createTransactionForm.to_account_number" placeholder="Enter recipient account number" @input="validateToAccountNumber" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="modal-submit-button" variant="success">Create Transaction</b-button>
      </b-form>
    </b-modal>

    <!-- Edit Account Modal -->
    <b-modal ref="editAccountModal" id="edit-account-modal" title="Edit Account" hide-footer>
      <b-form @submit.prevent="onSubmitEditAccount" class="modal-form">
        <b-form-group label="Account Name">
          <b-form-input v-model="editAccountForm.name" placeholder="Enter new account name" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="modal-submit-button" variant="info">Update Account</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { trackEvent } from '../appInsights';

export default {
  data() {
    return {
      editAccountForm: {
        name: '',
        id: null,
      },
      accounts: [],
      transactions: [],
      createAccountForm: {
        name: '',
        currency: '',
        balance: '',
        country: '',
      },
      createTransactionForm: {
        from_account_number: '',
        to_account_number: '',
        amount: '',
        currency: '',
      },
      alertVariant: '',
      message: '',
      accountOptions: [],
      isCurrencyValid: true, 
      isToAccountNumberValid: true,
      token: localStorage.getItem('authToken'), // Ensure you have the JWT token stored
    };
  },
  methods: {

    // GET FUNCTION to fetch the user accounts and transactions
    async RESTgetAccountsandTransactions() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_ROOT_URL}/user_portal`, {
          headers: {
            Authorization: `Bearer ${this.token}`, // Use the stored token
          },
        });
        this.accounts = response.data.accounts;
        this.transactions = response.data.transactions;
        this.accountOptions = this.accounts.map(account => ({
          value: account.account_number,
          text: account.account_number,
        }));
        trackEvent('AccountsAndTransactionsFetched', { accounts: this.accounts.length, transactions: this.transactions.length });
      } catch (error) {
        this.showMessage('Error fetching accounts and transactions');
        trackEvent('AccountsAndTransactionsFetchFailed', { error: error.message });
      }
    },

    // Validation functions
    validateCurrency(formType = 'account') {
      const validCurrencySymbols = ['EUR', 'USD', 'GBP', 'JPY', 'INR'];
      const currencyValue =
        formType === 'account'
          ? this.createAccountForm.currency.trim()
          : this.createTransactionForm.currency.trim();
      this.isCurrencyValid = validCurrencySymbols.includes(currencyValue);
    },
    validateToAccountNumber() {
      this.isToAccountNumberValid = /^\d+$/.test(this.createTransactionForm.to_account_number.trim());
    },

    // POST FUNCTION to create a new user account
    async onSubmitAccount() {
      this.validateCurrency('account');
      if (!this.isCurrencyValid) {
        this.showMessage('Please enter a valid currency symbol (e.g., EUR, USD)');
        return;
      }
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_URL}/accounts`, this.createAccountForm, {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
        });
        // Logs
        this.showMessage('Account created successfully');
        trackEvent('AccountCreated', { payload: this.createAccountForm });
        this.RESTgetAccountsandTransactions();
        // Reset form
        this.createAccountForm = { name: '', currency: '', balance: '', country: '' };
        this.isCurrencyValid = true;
        this.$refs.accountModal.hide();
      } catch (error) {
        this.showMessage('Error creating account');
        trackEvent('AccountCreationFailed', { payload: this.createAccountForm, error: error.message });
      }
    },

    // PUT FUNCTION to update the user account
    async onSubmitEditAccount() {
      try {
        const response = await axios.put(`${process.env.VUE_APP_ROOT_URL}/accounts/${this.editAccountForm.id}`, this.editAccountForm, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.showMessage('Account updated successfully');
        trackEvent('AccountEditSubmitted', { id: this.editAccountForm.id, payload: this.editAccountForm });
        this.RESTgetAccountsandTransactions();
        this.initEditForm(); 
        this.$refs.editAccountModal.hide();
      } catch (error) {
        this.showMessage('Error updating account');
        trackEvent('AccountEditFailed', { id: this.editAccountForm.id, error: error.message });
      }
    },
    
    // DELETE FUNCTION to delete the user account
    async RESTdeleteAccount(id) {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_ROOT_URL}/accounts/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.showMessage('Account deleted successfully');
        trackEvent('AccountDeleted', { id });
        this.RESTgetAccountsandTransactions();
      } catch (error) {
        this.showMessage('Error deleting account');
        trackEvent('AccountDeleteFailed', { id, error: error.message });
      }
    },
  
    // POST FUNCTION to create a new transaction
    async onSubmitTransaction() {
      // validate
      this.validateCurrency('transaction');
      this.validateToAccountNumber();
      if (!this.isCurrencyValid) {
        this.showMessage('Please enter a valid currency symbol (e.g., EUR, USD)');
        return;
      }
      if (!this.isToAccountNumberValid) {
      this.showMessage('To Account Number must be numeric');
      return;
    }
      try {
        const payload = {
          from_account_number: this.createTransactionForm.from_account_number,
          to_account_number: this.createTransactionForm.to_account_number,
          amount: parseFloat(this.createTransactionForm.amount),
          currency: this.createTransactionForm.currency,
        };
        const response = await axios.post(`${process.env.VUE_APP_ROOT_URL}/transactions`, payload, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        // Logss
        this.showMessage('Transaction created successfully');
        trackEvent('TransactionCreated', { payload });
        // Refresh and reset
        this.RESTgetAccountsandTransactions();
        this.createTransactionForm = { from_account_number: '', to_account_number: '', amount: '', currency: '' }; 
        this.isCurrencyValid = true;
        this.isToAccountNumberValid = true;
        this.$refs.transactionModal.hide();
      } catch (error) {
        this.showMessage('Error creating transaction');
        trackEvent('TransactionCreationFailed', { payload, error: error.message });
      }
    },

    initEditForm() {
      this.editAccountForm = {
        name: '',
        id: null,
      };
    },
    editAccount(account) {
      this.editAccountForm = { ...account };
    },
    openUpdateAccountModal(account) {
      this.editAccount(account);
      this.$refs.editAccountModal.show();
    },

    deleteAccount(id) {
      this.RESTdeleteAccount(id);
    },

    logout() {
      localStorage.removeItem('authToken');
      this.$router.push('/');
      trackEvent("UserLogout");
    },

    showMessage(message) {
      alert(message);
    },

  },
  created() {
    this.RESTgetAccountsandTransactions();
    trackEvent('UserPortalVisited', { user: localStorage.getItem('userId') });
  },
};
</script>

<style scoped>
.user-portal {
  background: linear-gradient(to bottom right, #ffffff, #9aa4b4);
  padding: 20px;
  color: black;
}
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
}

.user-title {
  font-size: 48px;
  margin: 0 auto;
}

.logout-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #d6533c;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}
.logout-button:hover {
  background-color: #a53b28;
}

.section-title {
  font-size: 36px;
  margin-top: 20px;
}

.account-table,
.transactions-table {
  border: 2px solid #007bff;
  width: 100%;
  margin-top: 20px;
}
.background-section {
  position: relative;
  width: 100%;
  height: 200px; /* Adjust height as needed */
  background-image: url('@/assets/background.jpeg'); /* Set your image path */
  background-size: cover; /* Ensures the image covers the section */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent tiling */
}
.table th {
  background-color: #f1f1f1;
  color: black;
  text-align: left;
}

.table td {
  border: 1px solid #ddd;
  padding: 10px;
  color: black;
}

.btn-primary {
  background-color: #0648d7;
  border: none;
}

.btn-primary:hover {
  background-color: #007bff;
}

.btn-create:hover {
  background: linear-gradient(to bottom right, #61aaf7, #61aaf7);
  color: white;
  border-color: #007bff;
}

.btn-create {
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 0px;
  transition: background-color 0.3s ease;
}
.edit-button {
  width: 45px;
  height: 31px;
  background-color: rgb(0, 200, 255);
  border: none;
  font-weight: 600;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition-duration: .3s;
  overflow: hidden;
  position: relative;
}

.svgIcon {
  width: 12px;
  transition-duration: .3s;
}

.svgIcon path {
  fill: white;
}

.edit-button:hover {
  width: 45px;
  transition-duration: .3s;
  background-color: rgb(0, 200, 255);
  align-items: center;
}

.edit-button:hover .svgIcon {
  width: 12px;
  transition-duration: .3s;
  transform: translateY(100%);
}

.edit-button::before {
  position: absolute;
  top: -9px;
  content: "Edit";
  color: white;
  transition-duration: .3s;
  font-size: 5px;
}

.edit-button:hover::before {
  font-size: 10px;
  opacity: 1;
  transform: translateY(10px);
  transition-duration: .3s;
}

.delete-button {
  width: 45px;
  height: 31px;
  background-color: rgb(255, 0, 0);
  border: none;
  font-weight: 600;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition-duration: .3s;
  overflow: hidden;
  position: relative;
}

.svgIcon {
  width: 12px;
  transition-duration: .3s;
}

.svgIcon path {
  fill: white;
}

.delete-button:hover {
  width: 45px;
  transition-duration: .3s;
  background-color: rgb(255, 69, 69);
  align-items: center;
}

.delete-button:hover .svgIcon {
  width: 12px;
  transition-duration: .3s;
  transform: translateY(100%);
}

.delete-button::before {
  position: absolute;
  top: -9px;
  content: "Delete";
  color: white;
  transition-duration: .3s;
  font-size: 5px;
}

.delete-button:hover::before {
  font-size: 10px;
  opacity: 1;
  transform: translateY(10px);
  transition-duration: .3s;
}
.modal-form {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-form b-form-group {
  margin-bottom: 15px;
}

.modal-form b-form-input,
.modal-form b-form-select {
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 10px;
}

.modal-form b-form-input:focus,
.modal-form b-form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.modal-submit-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 0px;
  background: linear-gradient(to bottom right, #007bff, #007bff);
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.modal-submit-button:hover {
  background: linear-gradient(to bottom right, #61aaf7, #61aaf7);
  color: white;
}
</style>
