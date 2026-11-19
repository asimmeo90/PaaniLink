
// ===================================
// PAANILINK REGISTRATION SYSTEM
// ===================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        // Get form values
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Check password
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            // Get existing users from API
            const response = await fetch("http://localhost:3000/users");

            if (!response.ok) {
                throw new Error("Could not connect to API");
            }

            const users = await response.json();

            // Check duplicate email
            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                alert("This email is already registered!");
                return;
            }

            // Create new customer
            const newUser = {
                name: name,
                phone: phone,
                address: address,
                email: email,
                password: password,
                role: "customer"
            };

            // Send data to API
            const registerResponse = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });

            if (!registerResponse.ok) {
                throw new Error("Registration failed");
            }

            alert("Registration successful! Please login.");

            registerForm.reset();

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);
            alert("Unable to register. Please check if Mock API is running.");

        }

    });

}


// ===================================
// PAANILINK LOGIN SYSTEM
// ===================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const role = document.getElementById("role").value;
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        try {

            // Fetch registered users
            const response = await fetch("http://localhost:3000/users");

            if (!response.ok) {
                throw new Error("Could not connect to API");
            }

            const users = await response.json();

            // Verify login credentials
            const loggedInUser = users.find(user =>
                user.email === email &&
                user.password === password &&
                user.role === role
            );

            if (!loggedInUser) {
                alert("Invalid email, password or role!");
                return;
            }

            // Login successful
            alert("Login Successful! Welcome " + loggedInUser.name);

            // Save logged-in user information
            sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

            // Redirect according to user role
          switch (loggedInUser.role) {

    case "customer":
        window.location.href = "customer/dashboard.html";
        break;

    case "officer":
        window.location.href = "officer/dashboard.html";
        break;

    case "operator":
        window.location.href = "operator/dashboard.html";
        break;

        case "driver":
    window.location.href = "driver/dashboard.html";
    break;

    case "admin":
    window.location.href = "admin/dashboard.html";
    break;

    default:
        alert("Dashboard for this role is coming soon!");
}

        } catch (error) {

            console.error("Login Error:", error);

            alert("Login failed! Check whether JSON Server is running.");

        }

    });

}


// ===================================
// PAANILINK LOGOUT SYSTEM
// ===================================

const logoutLinks = document.querySelectorAll('a[href*="login.html"]');

logoutLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        sessionStorage.removeItem("loggedInUser");

        window.location.href = link.getAttribute("href");

    });

});
