
// ===================================
// PAANILINK OPERATOR SYSTEM
// TANKER & DRIVER ASSIGNMENT
// ===================================

const operatorBookingList = document.getElementById("operatorBookingList");

if (operatorBookingList) {

    // Load approved bookings, tankers and drivers
    async function loadApprovedBookings() {

        try {

            const [bookingResponse, tankerResponse, driverResponse] =
                await Promise.all([
                    fetch("http://localhost:3000/bookings"),
                    fetch("http://localhost:3000/tankers"),
                    fetch("http://localhost:3000/drivers")
                ]);

            if (!bookingResponse.ok ||
                !tankerResponse.ok ||
                !driverResponse.ok) {
                throw new Error("Unable to fetch data");
            }

            const bookings = await bookingResponse.json();
            const tankers = await tankerResponse.json();
            const drivers = await driverResponse.json();

            const approvedBookings = bookings.filter(booking =>
                booking.status === "approved"
            );

            operatorBookingList.innerHTML = "";

            if (approvedBookings.length === 0) {
                operatorBookingList.textContent =
                    "No approved bookings available.";
                return;
            }

            approvedBookings.forEach(booking => {

                const card = document.createElement("div");

                card.style.border = "1px solid #ccc";
                card.style.padding = "15px";
                card.style.margin = "15px 0";
                card.style.borderRadius = "8px";

                // Booking details
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

                // Available tankers with sufficient capacity
                const availableTankers = tankers.filter(tanker =>
                    tanker.status === "available" &&
                    Number(tanker.capacity) >= Number(booking.tankerSize)
                );

                // Available drivers
                const availableDrivers = drivers.filter(driver =>
                    driver.status === "available"
                );

                // Tanker dropdown
                const tankerLabel = document.createElement("label");
                tankerLabel.textContent = "Select Tanker";
                card.appendChild(tankerLabel);

                const tankerSelect = document.createElement("select");

                tankerSelect.style.width = "100%";
                tankerSelect.style.margin = "10px 0";
                tankerSelect.style.padding = "10px";

                tankerSelect.innerHTML =
                    '<option value="">Choose Tanker</option>';

                availableTankers.forEach(tanker => {

                    const option = document.createElement("option");

                    option.value = tanker.id;
                    option.textContent =
                        tanker.tankerNumber +
                        " - " + tanker.capacity + " Gallons";

                    tankerSelect.appendChild(option);

                });

                card.appendChild(tankerSelect);

                // Driver dropdown
                const driverLabel = document.createElement("label");
                driverLabel.textContent = "Select Driver";
                card.appendChild(driverLabel);

                const driverSelect = document.createElement("select");

                driverSelect.style.width = "100%";
                driverSelect.style.margin = "10px 0";
                driverSelect.style.padding = "10px";

                driverSelect.innerHTML =
                    '<option value="">Choose Driver</option>';

                availableDrivers.forEach(driver => {

                    const option = document.createElement("option");

                    option.value = driver.id;
                    option.textContent =
                        driver.name + " - " + driver.phone;

                    driverSelect.appendChild(option);

                });

                card.appendChild(driverSelect);

                // Assignment button
                const assignButton = document.createElement("button");

                assignButton.textContent = "Assign Tanker & Driver";
                assignButton.className = "auth-btn";

                if (availableTankers.length === 0 ||
                    availableDrivers.length === 0) {

                    assignButton.disabled = true;
                    assignButton.textContent =
                        "No Available Tanker or Driver";

                }

                assignButton.addEventListener("click", function() {

                    const selectedTanker = tankerSelect.value;
                    const selectedDriver = driverSelect.value;

                    if (!selectedTanker || !selectedDriver) {
                        alert("Please select both tanker and driver!");
                        return;
                    }

                    assignTankerAndDriver(
                        booking,
                        selectedTanker,
                        selectedDriver
                    );

                });

                card.appendChild(assignButton);

                operatorBookingList.appendChild(card);

            });

        } catch (error) {

            console.error("Operator Error:", error);

            operatorBookingList.textContent =
                "Unable to load bookings. Check JSON Server.";

        }

    }


    // Assign tanker and driver
    async function assignTankerAndDriver(
        booking,
        tankerId,
        driverId
    ) {

        try {

            // Fetch latest booking and resource information
            const [bookingResponse, tankerResponse, driverResponse] =
                await Promise.all([
                    fetch("http://localhost:3000/bookings/" + booking.id),
                    fetch("http://localhost:3000/tankers/" + tankerId),
                    fetch("http://localhost:3000/drivers/" + driverId)
                ]);

            if (!bookingResponse.ok ||
                !tankerResponse.ok ||
                !driverResponse.ok) {
                throw new Error("Unable to verify assignment");
            }

            const latestBooking = await bookingResponse.json();
            const tanker = await tankerResponse.json();
            const driver = await driverResponse.json();

            // Validate latest status and availability
            if (latestBooking.status !== "approved") {
                alert("This booking is no longer available!");
                loadApprovedBookings();
                return;
            }

            if (tanker.status !== "available" ||
                driver.status !== "available") {

                alert("Selected tanker or driver is no longer available!");

                loadApprovedBookings();
                return;

            }

            if (Number(tanker.capacity) < Number(latestBooking.tankerSize)) {
                alert("Selected tanker capacity is insufficient!");
                return;
            }

            // Update booking
            const bookingUpdate = await fetch(
                "http://localhost:3000/bookings/" + booking.id,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: "assigned",
                        assignedTanker: tanker.tankerNumber,
                        assignedTankerId: tanker.id,
                        assignedDriver: driver.name,
                        assignedDriverId: driver.id
                    })
                }
            );

            if (!bookingUpdate.ok) {
                throw new Error("Booking update failed");
            }

            // Mark tanker as busy
            const tankerUpdate = await fetch(
                "http://localhost:3000/tankers/" + tanker.id,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: "busy"
                    })
                }
            );

            if (!tankerUpdate.ok) {
                throw new Error("Tanker update failed");
            }

            // Mark driver as busy
            const driverUpdate = await fetch(
                "http://localhost:3000/drivers/" + driver.id,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: "busy"
                    })
                }
            );

            if (!driverUpdate.ok) {
                throw new Error("Driver update failed");
            }

            alert("Tanker and Driver assigned successfully!");

            loadApprovedBookings();

        } catch (error) {

            console.error("Assignment Error:", error);

            alert("Assignment failed! Please check the database.");

        }

    }

    // Start system
    loadApprovedBookings();

}
