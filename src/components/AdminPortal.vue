<template>
  <div class="admin-portal">
    <div class="header">
      <h1>Admin Portal</h1>
      <!-- Logout Button -->
      <button class="logout-button" @click="logout">Logout</button>
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

export default {
  name: "AdminPortal",
  data() {
    return {
      useraccounts: [],
      isEditing: false,
      editUserAccountForm: {
        id: "",
        username: "",
        password_hash: "", // Backend uses hashed passwords
        admin: false
      },
      showMessage: false,
      message: "",
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push("/login");
    },

    // POST function
    RESTcreateUserAccount(payload) {
      const path = `${process.env.VUE_APP_ROOT_URL}/users`;
      console.log('Auth Token:', token);
      axios
        .post(path, payload, {
          headers: {
            'x-access-token': token // Ensure the token is included
          }
        })
        .then(() => {
          console.log('User created successfully:', response.data);
          this.RESTgetusers(); // Refresh the user list after creation
          this.message = "User Account Created Successfully!";
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error("Error creating user:", error.response ? error.response.data : error.message);
        });
    },

    // GET function
    RESTgetusers() {
      const token = localStorage.getItem('authToken');
      console.log('Auth Token:', token); // Log the token for debugging
      axios
        .get(`${process.env.VUE_APP_ROOT_URL}/users`, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
        .then(response => {
          this.useraccounts = response.data; // Directly map response to useraccounts
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },

    // PUT functions
    RESTupdateUserAccount(payload, userId) {
      axios
        .put(`${process.env.VUE_APP_ROOT_URL}/users/${userId}`, payload, {
          headers: {
            'x-access-token': localStorage.getItem('authToken')
          }
        })
        .then(() => {
          this.RESTgetusers(); // Refresh user list
          this.$refs.userModal.hide(); // Close modal
        })
        .catch(error => {
          console.error('Error updating user:', error);
        });
    },

    // DELETE function
    RESTdeleteUserAccount(userId) {
    axios
      .delete(`${process.env.VUE_APP_ROOT_URL}/users/${userId}`, {
        headers: {
          'x-access-token': localStorage.getItem('authToken')
        }
      })
      .then(() => {
        this.RESTgetusers(); // Refresh user list
      })
      .catch(error => {
        console.error('Error deleting user:', error);
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
    },
    openUpdateModal(user) {
      this.isEditing = true;
      this.editUserAccountForm = { ...user, password: "" };
      this.$refs.userModal.show(); 
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
  background: linear-gradient(to bottom right, #8fd3e0, #8ed890);
  
}

.create-button {
  margin-bottom: 15px;
  background-color: #117b72; 
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.create-button:hover {
  background: linear-gradient(to bottom right, #379b92, #117b72);
  color: white;
}

.users-table {
  border: 2px solid #117b72;
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
  background-color: #2ea901;
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
  border-color: #117b72;
  box-shadow: 0 0 5px rgba(17, 123, 114, 0.5);
}

.modal-submit-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  background: linear-gradient(to bottom right, #379b92, #117b72);
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.modal-submit-button:hover {
  background: linear-gradient(to bottom right, #2ea901, #0648d7);
  color: white;
}

</style>