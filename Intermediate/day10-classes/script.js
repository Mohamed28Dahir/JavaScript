document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');
    const users = [];

    // Create some sample users
    const user1 = new User('John Doe', 'john@example.com');
    const admin1 = User.createAdmin('Admin User', 'admin@example.com');
    const user2 = new User('Jane Smith', 'jane@example.com', 'moderator');

    users.push(user1, admin1, user2);

    // Simulate some actions
    user1.login();
    admin1.login();
    user2.toggleStatus(); // Make inactive

    // Render user cards
    function renderUsers() {
        userList.innerHTML = '';
        users.forEach(user => {
            const info = user.getInfo();
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${info.name}</h3>
                <p>Email: ${info.email}</p>
                <p>Role: ${info.role}</p>
                <p>Login count: ${info.loginCount}</p>
                <p>Created: ${info.createdAt.toLocaleDateString()}</p>
                <p>Last login: ${info.lastLogin ? info.lastLogin.toLocaleDateString() : 'Never'}</p>
                <span class="status ${info.isActive ? 'active' : 'inactive'}">
                    ${info.isActive ? 'Active' : 'Inactive'}
                </span>
                <div style="margin-top: 1rem;">
                    <button onclick="toggleUserStatus('${info.id}')">
                        Toggle Status
                    </button>
                    <button onclick="promoteUser('${info.id}')">
                        Promote
                    </button>
                </div>
            `;
            userList.appendChild(userCard);
        });
    }

    // Global functions for buttons
    window.toggleUserStatus = (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.toggleStatus();
            renderUsers();
        }
    };

    window.promoteUser = (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            const roles = ['user', 'moderator', 'admin'];
            const currentIndex = roles.indexOf(user.role);
            const nextRole = roles[(currentIndex + 1) % roles.length];
            user.updateRole(nextRole);
            renderUsers();
        }
    };

    // Initial render
    renderUsers();
}); 