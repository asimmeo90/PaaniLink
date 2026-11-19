
// ===================================
// PAANILINK OFFICER BOOKING SYSTEM
// ===================================

const officerBookingList = document.getElementById("officerBookingList");

if (officerBookingList) {

    async function loadOfficerBookings() {

        try {

            const response = await fetch("http://localhost:3000/bookings");

            if (!response.ok) {
                throw new Error("Unable to fetch bookings");
            }

            const bookings = await response.json();

            officerBookingList.innerHTML = "";

            if (bookings.length === 0) {
                officerBookingList.textContent = "No bookings available.";
                return;
            }

            bookings.forEach(booking => {

                const card = document.createElement("div");

                card.style.border = "1px solid #ccc";
                card.style.padding = "15px";
                card.style.margin = "15px 0";
                card.style.borderRadius = "8px";

                const details = [
                    "Booking ID: " + booking.id,
                    "Customer: " + booking.customerName,
                    "Water Type: " + booking.waterType,
                    "Tanker Size: " + booking.tankerSize + " Gallons",
                    "Delivery Address: " + booking.deliveryAddress,
                    "Contact: " + booking.contactNumber,
                    "Status: " + booking.status
                ];

                details.forEach(detail => {
                    const paragraph = document.createElement("p");
                    paragraph.textContent = detail;
                    card.appendChild(paragraph);
                });

                if (booking.status === "pending") {

                    const approveButton = document.createElement("button");
                    approveButton.textContent = "Approve";
                    approveButton.className = "auth-btn";

                    approveButton.addEventListener("click", function() {
                        updateBookingStatus(booking.id, "approved");
                    });

                    const rejectButton = document.createElement("button");
                    rejectButton.textContent = "Reject";
                    rejectButton.className = "auth-btn";

                    rejectButton.style.marginLeft = "10px";

                    rejectButton.addEventListener("click", function() {
                        updateBookingStatus(booking.id, "rejected");
                    });

                    card.appendChild(approveButton);
                    card.appendChild(rejectButton);
                }

                officerBookingList.appendChild(card);

            });

        } catch (error) {

            console.error("Officer Booking Error:", error);
            officerBookingList.textContent = "Unable to load bookings.";

        }

    }


    // Update booking status
    async function updateBookingStatus(bookingId, newStatus) {

        try {

            const response = await fetch(
                "http://localhost:3000/bookings/" + bookingId,
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

            alert("Booking " + newStatus + " successfully!");

            loadOfficerBookings();

        } catch (error) {

            console.error(error);
            alert("Unable to update booking status.");

        }

    }

    loadOfficerBookings();

}
