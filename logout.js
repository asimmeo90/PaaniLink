document.querySelectorAll('a[href*="login.html"]').forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        sessionStorage.removeItem("loggedInUser");

        window.location.href = link.getAttribute("href");
    });
});