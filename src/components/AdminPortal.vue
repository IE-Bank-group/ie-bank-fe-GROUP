<template>
    <div class="admin-portal">
      <h1>Admin Portal</h1>
      <div class="form-container">
        <h2>Create or Update User</h2>
        <form @submit.prevent="handleSubmit">
          <div>
            <label for="userId">User ID:</label>
            <input type="text" v-model="formData.id" placeholder="Leave blank to create new" />
          </div>
          <div>
            <label for="username">Username:</label>
            <input type="text" v-model="formData.username" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" v-model="formData.password" required />
          </div>
          <button type="submit">{{ formData.id ? 'Update' : 'Create' }}</button>
        </form>
      </div>
  
      <div class="users-list">
        <h2>Bank Users</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>
                <button @click="editUser(user)">Edit</button>
                <button @click="deleteUser(user.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        users: [],
        formData: {
          id: null,
          username: "",
          password: "",
        },
        apiBase: "http://localhost:5000/api/users", // Adjust this based on your backend endpoint
      };
    },
    methods: {
      // Fetch all users
      async fetchUsers() {
        try {
          const response = await axios.get(this.apiBase);
          this.users = response.data;
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
      // Handle create or update
      async handleSubmit() {
        try {
          if (this.formData.id) {
            // Update user
            await axios.put(`${this.apiBase}/${this.formData.id}`, this.formData);
            alert("User updated successfully!");
          } else {
            // Create new user
            await axios.post(this.apiBase, this.formData);
            alert("User created successfully!");
          }
          this.resetForm();
          this.fetchUsers();
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      },
      // Edit user data
      editUser(user) {
        this.formData.id = user.id;
        this.formData.username = user.username;
        this.formData.password = ""; // Do not prefill the password
      },
      // Delete user
      async deleteUser(userId) {
        if (confirm("Are you sure you want to delete this user?")) {
          try {
            await axios.delete(`${this.apiBase}/${userId}`);
            alert("User deleted successfully!");
            this.fetchUsers();
          } catch (error) {
            console.error("Error deleting user:", error);
          }
        }
      },
      // Reset the form
      resetForm() {
        this.formData = {
          id: null,
          username: "",
          password: "",
        };
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
  </script>
  
  <style scoped>
  .admin-portal {
    padding: 20px;
    max-width: 800px;
    margin: auto;
  }
  
  .form-container {
    margin-bottom: 30px;
  }
  
  form div {
    margin-bottom: 10px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table, th, td {
    border: 1px solid #ddd;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
  }
  
  button {
    margin-right: 5px;
  }
  </style>
  