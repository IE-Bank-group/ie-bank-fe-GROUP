export const authService = {
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    },

    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getUserRole() {
        return localStorage.getItem('userRole');
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
    }
};
