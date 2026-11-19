
const userData = sessionStorage.getItem("loggedInUser");

const driverBookingList = document.getElementById("driverBookingList");
const driverWelcome = document.getElementById("driverWelcome");

if (!userData) {
    window.location.href = "../login.html";
} else {

    const driver = JSON.parse(userData);

    driverWelcome.textContent = "Welcome, " + driver.name + "!";

    async function loadDriverBookings() {

        try {

            const response = await fetch("http://localhost:3000/bookings");

            if (!response.ok) {
                throw new Error("Unable to load bookings");
            }

            const bookings = await response.json();

            const myBookings = bookings.filter(booking =>
                booking.assignedDriverId === driver.id
            );

            driverBookingList.innerHTML = "";

            if (myBookings.length === 0) {
                driverBookingList.textContent =
                    "No bookings assigned to you yet.";
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
                    "Customer: " + booking.customerName,
                    "Water Type: " + booking.waterType,
                    "Tanker: " + booking.assignedTanker,
                    "Tanker Size: " + booking.tankerSize + " Gallons",
                    "Delivery Address: " + booking.deliveryAddress,
                    "Customer Contact: " + booking.contactNumber,
                    "Status: " + booking.status
                ];

                details.forEach(detail => {
                    const p = document.createElement("p");
                    p.textContent = detail;
                    card.appendChild(p);
                });

                if (booking.status === "assigned") {

                    const startButton = document.createElement("button");

                    startButton.textContent = "Start Trip";
                    startButton.className = "auth-btn";

                    startButton.addEventListener("click", () => {
                        updateTripStatus(booking, "in_transit");
                    });

                    card.appendChild(startButton);

                } else if (booking.status === "in_transit") {

                    const completeButton = document.createElement("button");

                    completeButton.textContent = "Complete Delivery";
                    completeButton.className = "auth-btn";

                    completeButton.addEventListener("click", () => {
                        updateTripStatus(booking, "delivered");
                    });

                    card.appendChild(completeButton);

                }

                driverBookingList.appendChild(card);

            });

        } catch (error) {

            console.error("Driver Error:", error);

            driverBookingList.textContent =
                "Unable to load your bookings.";

        }

    }


    async function updateTripStatus(booking, newStatus) {

        try {

            const response = await fetch(
                "http://localhost:3000/bookings/" + booking.id,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Status update failed");
            }

            if (newStatus === "delivered") {

                // Release tanker
                await fetch(
                    "http://localhost:3000/tankers/" +
                    booking.assignedTankerId,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            status: "available"
                        })
                    }
                );

                // Release driver
                await fetch(
                    "http://localhost:3000/drivers/" +
                    booking.assignedDriverId,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            status: "available"
                        })
                    }
                );

                alert("Delivery completed successfully!");

            } else {

                alert("Trip started successfully!");

            }

            loadDriverBookings();

        } catch (error) {

            console.error("Trip Update Error:", error);

            alert("Unable to update trip status.");

        }

    }

    loadDriverBookings();

}
