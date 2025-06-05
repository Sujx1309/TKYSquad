$(document).ready(() => {
    if (localStorage.getItem('loggedInUser')) {
        window.location.href = '../Index.html';
    }

    const loginUser = (user) => {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = '../Index.html';
    };

    let users = [];

    // Load users.json
    fetch('../data/users.json')
        .then(res => res.json())
        .then(data => {
            users = data;
        })
        .catch(err => {
            alert('Failed to load users.json');
            console.error('Error:', err);
        });

    $('#login-form').on('submit', (e) => {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        // Check against loaded users
        const matchedUser = users.find(user => user.username === username && user.password === password);
        if (matchedUser) {
            loginUser(matchedUser);
        } else {
            alert('Invalid username or password');
        }
    });

    $('#guest-login').on('click', () => {
        const guestUser = { username: 'Guest', password: '', role: 'guest' };
        loginUser(guestUser);
    });
});
