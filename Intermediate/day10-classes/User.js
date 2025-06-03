class User {
    constructor(name, email, role = 'user') {
        this.id = Date.now().toString();
        this.name = name;
        this.email = email;
        this.role = role;
        this.isActive = true;
        this.createdAt = new Date();
        this.loginCount = 0;
    }

    // Instance methods
    toggleStatus() {
        this.isActive = !this.isActive;
        return this.isActive;
    }

    updateRole(newRole) {
        const validRoles = ['user', 'admin', 'moderator'];
        if (validRoles.includes(newRole)) {
            this.role = newRole;
            return true;
        }
        return false;
    }

    login() {
        this.loginCount++;
        this.lastLogin = new Date();
    }

    getInfo() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            isActive: this.isActive,
            createdAt: this.createdAt,
            loginCount: this.loginCount,
            lastLogin: this.lastLogin
        };
    }

    // Static methods
    static validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }

    static createAdmin(name, email) {
        return new User(name, email, 'admin');
    }
} 