// PAANILINK ROLE PROTECTION

const loggedInUser = sessionStorage.getItem("loggedInUser");
const requiredRole = document.body.dataset.role;

if (!loggedInUser) {
    alert("Please login first!");
    window.location.href = "../login.html";
} else {
    const user = JSON.parse(loggedInUser);

    if (user.role !== requiredRole) {
        alert("Access denied! You are not authorized.");
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "../login.html";
    }
}