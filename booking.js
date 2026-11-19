
// ===================================
// PAANILINK CUSTOMER BOOKING SYSTEM
// ===================================

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        // Get logged-in customer
        const userData = sessionStorage.getItem("loggedInUser");

        if (!userData) {
            alert("Please login first!");
            window.location.href = "../login.html";
            return;
        }

        const user = JSON.parse(userData);

        // Get booking details
        const waterType = document.getElementById("waterType").value;
        const tankerSize = document.getElementById("tankerSize").value;
        const deliveryAddress = document.getElementById("deliveryAddress").value.trim();
        const contactNumber = document.getElementById("contactNumber").value.trim();

        if (!waterType || !tankerSize || !deliveryAddress || !contactNumber) {
            alert("Please fill in all fields!");
            return;
        }

        // Create booking object
        const newBooking = {
            customerId: user.id,
            customerName: user.name,
            waterType: waterType,
            tankerSize: tankerSize,
            deliveryAddress: deliveryAddress,
            contactNumber: contactNumber,
            status: "pending",
            bookingDate: new Date().toISOString()
        };

        try {

            const response = await fetch("http://localhost:3000/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newBooking)
            });

            if (!response.ok) {
                throw new Error("Booking failed");
            }

            const savedBooking = await response.json();

            alert("Booking submitted successfully! Booking ID: " + savedBooking.id);

            bookingForm.reset();

            // Refresh booking list
            if (typeof loadMyBookings === "function") {
                loadMyBookings();
            }

        } catch (error) {

            console.error("Booking Error:", error);
            alert("Unable to submit booking. Please check JSON Server.");

        }

    });

}


// ===================================
// PAANILINK MY BOOKINGS SYSTEM
// ===================================

const bookingList = document.getElementById("bookingList");

async function loadMyBookings() {

    if (!bookingList) return;

    const userData = sessionStorage.getItem("loggedInUser");

    if (!userData) {
        bookingList.textContent = "Please login to view your bookings.";
        return;
    }

    const user = JSON.parse(userData);

    try {

        const response = await fetch("http://localhost:3000/bookings");

        if (!response.ok) {
            throw new Error("Unable to fetch bookings");
        }

        const bookings = await response.json();

        // Get only logged-in customer's bookings
        const myBookings = bookings.filter(booking =>
            String(booking.customerId) === String(user.id)
        );

        bookingList.innerHTML = "";

        if (myBookings.length === 0) {
            bookingList.textContent = "You have no bookings yet.";
            return;
        }

        myBookings.forEach(booking => {

            const card = document.createElement("div");

            card.style.border = "1px solid #ccc";
            card.style.padding = "15px";
            card.style.margin = "15px 0";
            card.style.borderRadius = "8px";

            const details = [
                "Booking ID: " + booking.id,
                "Water Type: " + booking.waterType,
                "Tanker Size: " + booking.tankerSize + " Gallons",
                "Address: " + booking.deliveryAddress,
                "Contact: " + booking.contactNumber,
                "Status: " + booking.status
            ];

            details.forEach(detail => {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;
                card.appendChild(paragraph);
            });


            // ===================================
            // CUSTOMER DELIVERY CONFIRMATION
            // ===================================

            if (booking.status === "delivered") {

                const confirmButton = document.createElement("button");

                confirmButton.textContent = "Confirm Delivery";
                confirmButton.className = "auth-btn";

                confirmButton.addEventListener("click", function() {
                    confirmDelivery(booking.id, "confirmed");
                });

                card.appendChild(confirmButton);


                const issueButton = document.createElement("button");

                issueButton.textContent = "Report Issue";
                issueButton.className = "auth-btn";
                issueButton.style.marginLeft = "10px";

                issueButton.addEventListener("click", function() {
                    confirmDelivery(booking.id, "disputed");
                });

                card.appendChild(issueButton);

            }


            // Show final customer response
            if (booking.status === "confirmed") {

                const message = document.createElement("p");
                message.textContent = "Delivery successfully confirmed!";
                message.style.color = "green";

                card.appendChild(message);

            }

            if (booking.status === "disputed") {

                const message = document.createElement("p");
                message.textContent = "Delivery issue reported. Awaiting review.";
                message.style.color = "red";

                card.appendChild(message);

            }

            bookingList.appendChild(card);

        });

    } catch (error) {

        console.error("My Bookings Error:", error);
        bookingList.textContent = "Unable to load bookings.";

    }

}


// Load bookings when dashboard opens
if (bookingList) {
    loadMyBookings();
}


// ===================================
// CUSTOMER DELIVERY CONFIRMATION
// ===================================

async function confirmDelivery(bookingId, decision) {

    try {

        // Get latest booking before updating
        const checkResponse = await fetch(
            "http://localhost:3000/bookings/" + bookingId
        );

        if (!checkResponse.ok) {
            throw new Error("Booking not found");
        }

        const booking = await checkResponse.json();

        // Only the actual customer can confirm their booking
        const userData = sessionStorage.getItem("loggedInUser");

        if (!userData) {
            alert("Please login first!");
            return;
        }

        const user = JSON.parse(userData);

        if (String(booking.customerId) !== String(user.id)) {
            alert("You cannot update another customer's booking!");
            return;
        }

        if (booking.status !== "delivered") {
            alert("This booking is not ready for confirmation!");
            return;
        }

        const response = await fetch(
            "http://localhost:3000/bookings/" + bookingId,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: decision,
                    customerFeedbackDate: new Date().toISOString()
                })
            }
        );

        if (!response.ok) {
            throw new Error("Unable to update delivery");
        }

        if (decision === "confirmed") {
            alert("Delivery confirmed successfully!");
        } else {
            alert("Delivery issue reported successfully!");
        }

        // Refresh bookings
        loadMyBookings();

    } catch (error) {

        console.error("Delivery Confirmation Error:", error);
        alert("Unable to submit your response.");

    }

}
