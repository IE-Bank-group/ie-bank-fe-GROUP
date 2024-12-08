<template>
  <div>
    <!-- Blue Top Banner -->
    <div class="top-banner">
      <div class="container d-flex justify-content-between align-items-center">
        <h1 class="bank-title">Admin Portal</h1>
        <div class="auth-buttons">
          <button type="button" class="btn btn-danger btn-sm" @click="logout">Logout</button>
        </div>
      </div>
    </div>
    <!-- Large Background Image -->
    <div class="background-section">
      <!-- Background image set via CSS -->
    </div>
    <h1>Users</h1>
    <!-- Create New User Button -->
    <button class="create-button" @click="openCreateModal">Create New User</button>

    <!-- Users Table -->
    <table class="table table-hover users-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Password</th>
          <th>Email</th>
          <th>Date of Birth</th>
          <th>Status</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in useraccounts" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.password }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.date_of_birth }}</td>
          <td>{{ user.status }}</td>
          <td>{{ user.role }}</td>
          <td>
            <!-- Edit Button -->
            <button class="btn btn-primary btn-sm" @click="openUpdateModal(user)">Edit</button>
            <!-- Delete Button -->
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Shared Modal -->
    <b-modal ref="userModal" :title="isEditing ? 'Edit User' : 'Create New User'" hide-footer>
      <b-form @submit.prevent="isEditing ? onSubmitUpdate() : onSubmitCreate()" class="modal-form">
        <b-form-group label="Username" label-for="username-input">
          <b-form-input id="username-input" placeholder="Enter username" v-model="editUserAccountForm.username" required></b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password-input">
          <b-form-input id="password-input" type="password" placeholder="Enter password" v-model="editUserAccountForm.password" required></b-form-input>
        </b-form-group>
        <b-form-group label="Email" label-for="email-input">
          <b-form-input id="email-input" type="email" placeholder="Enter email address" v-model="editUserAccountForm.email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Date of Birth" label-for="dob-input">
          <b-form-input id="dob-input" type="date" placeholder="Select date of birth" v-model="editUserAccountForm.date_of_birth" required></b-form-input>
        </b-form-group>
        <b-form-group label="Status" label-for="status-input">
          <b-form-input id="status-input" placeholder="Enter user status (e.g., Active)" v-model="editUserAccountForm.status" required></b-form-input>
        </b-form-group>
        <b-form-group label="Role" label-for="role-input">
          <b-form-input id="role-input" placeholder="Enter user role (e.g, user, admin)" v-model="editUserAccountForm.role" required></b-form-input>
        </b-form-group>
        <b-button type="submit" class="modal-submit-button" variant="success">
          {{ isEditing ? 'Update User' : 'Create User' }}
        </b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { trackEvent } from '../appInsights';

export default {
  name: "AdminPortal",
  data() {
    return {
      useraccounts: [],
      isEditing: false,
      editUserAccountForm: {
        id: "",
        username: "",
        password: "",
        email: "",
        date_of_birth: "",
        country: "",
        status: "",
        role: "",
      },
      showMessage: false,
      message: "",
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push("/");
      trackEvent("AdminLogout");
    },

    // POST function
    RESTcreateUserAccount(payload) {
      const path = `${process.env.VUE_APP_ROOT_URL}/admin/users`;
      axios
        .post(path, payload, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
        .then((response) => {
          this.RESTgetusers();
          this.message = "User Account Created Successfully!";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
          trackEvent("UserAccountCreated", { username: payload.username, role: payload.role });
        })
        .catch(error => {
          this.RESTgetusers();
          trackEvent("UserAccountCreationFailed", { username: payload.username, error: error.message });
        });
    },

    // GET function
    RESTgetusers() {
      axios
        .get(`${process.env.VUE_APP_ROOT_URL}/admin_portal`, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
        .then((response) => {
          this.useraccounts = response.data.users;
          trackEvent("UserAccountsFetched", { count: this.useraccounts.length });
        })
        .catch(error => {

          trackEvent("UserAccountsFetchFailed", { error: error.message });
        });
    },

    // PUT functions
    RESTupdateUserAccount(payload, userId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/admin/users/${userId}`;
      axios
        .put(path, payload, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
        .then(() => {
          this.RESTgetusers();
          this.message = "User Account Updated Successfully!";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
          trackEvent("UserAccountUpdated", { userId, changes: payload });
        })
        .catch((error) => {
          this.RESTgetusers();
          trackEvent("UserAccountUpdateFailed", { userId, error: error.message });
        });
    },

    // DELETE function
    RESTdeleteUserAccount(userId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/admin/users/${userId}`;
      axios
        .delete(path, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
        .then(() => {
          this.RESTgetusers();
          this.message = "User Account Deleted Successfully!";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
          trackEvent("UserAccountDeleted", { userId });
        })
        .catch((error) => {
          this.RESTgetusers();
          trackEvent("UserAccountDeleteFailed", { userId, error: error.message });
        });
    },

    /***************************************************
    * FORM MANAGEMENT
    **************************************************/
      
    initEditUserForm() {
      this.editUserAccountForm = {
        id: "",
        username: "",
        password: "",
        email: "",
        date_of_birth: "",
        country: "",
        status: "",
        role: "",
      };
    },

    // Open Create or Update Modal
    openCreateModal() {
      this.isEditing = false;
      this.initEditUserForm();
      this.$refs.userModal.show();
      trackEvent("CreateUserModalOpened");
    },
    openUpdateModal(user) {
      this.isEditing = true;
      this.editUserAccountForm = { ...user, password: "" };
      this.$refs.userModal.show(); 
      trackEvent("UpdateUserModalOpened", { userId: user.id });
    },

    // Submit Create or Update
    onSubmitCreate() {
      const payload = { ...this.editUserAccountForm };
      delete payload.id;
      this.RESTcreateUserAccount(payload);
      this.$refs.userModal.hide();
    },
    onSubmitUpdate() {
      const payload = { ...this.editUserAccountForm };
      this.RESTupdateUserAccount(payload, this.editUserAccountForm.id);
      this.$refs.userModal.hide();
    },

    // Delete a user
    deleteUser(userId) {
      this.RESTdeleteUserAccount(userId);
    },
  },
  created() {
    this.RESTgetusers();
    trackEvent("AdminPortalVisited");
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
}

.admin-title {
  font-size: 48px;
  background: -webkit-linear-gradient(right, #0648d7, #2ea901);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin: 0;
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

.admin-portal {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: linear-gradient(to bottom right, #ffffff, #9aa4b4);
  
}

.create-button {
  margin-bottom: 15px;
  background-color: #007bff; 
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.create-button:hover {
  background: linear-gradient(to bottom right, #61aaf7, #61aaf7);
  color: white;
}

.users-table {
  border: 2px solid #007bff;
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.users-table th {
  background-color:  #f1f1f1;
  color: rgb(0, 0, 0);
  text-align: left;
  padding: 10px;
}

.users-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.action-button:hover {
  background-color: #007bff;
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
  border-radius: 5px;
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
