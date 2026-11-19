
// ===================================
// PAANILINK ADMIN DASHBOARD
// ===================================

const adminStats = document.getElementById("adminStats");
const adminBookingList = document.getElementById("adminBookingList");
const adminTankerList = document.getElementById("adminTankerList");
const adminDriverList = document.getElementById("adminDriverList");

const adminWelcome = document.getElementById("adminWelcome");

const adminUserData = sessionStorage.getItem("loggedInUser");

if (!adminUserData) {

    window.location.href = "../login.html";

} else {

    const admin = JSON.parse(adminUserData);

    if (admin.role !== "admin") {
        alert("Access denied! Admin only.");
        window.location.href = "../login.html";
    } else {

        adminWelcome.textContent = "Welcome, " + admin.name + "!";

        loadAdminDashboard();

    }

}


// ===================================
// LOAD ALL ADMIN DATA
// ===================================

async function loadAdminDashboard() {

    try {

        const [usersResponse, bookingsResponse, tankersResponse, driversResponse] =
            await Promise.all([
                fetch("http://localhost:3000/users"),
                fetch("http://localhost:3000/bookings"),
                fetch("http://localhost:3000/tankers"),
                fetch("http://localhost:3000/drivers")
            ]);

        if (!usersResponse.ok ||
            !bookingsResponse.ok ||
            !tankersResponse.ok ||
            !driversResponse.ok) {

            throw new Error("Unable to load dashboard data");

        }

        const users = await usersResponse.json();
        const bookings = await bookingsResponse.json();
        const tankers = await tankersResponse.json();
        const drivers = await driversResponse.json();

        // Calculate statistics
        const customers = users.filter(user => user.role === "customer");

        const pending = bookings.filter(b => b.status === "pending").length;
        const approved = bookings.filter(b => b.status === "approved").length;
        const rejected = bookings.filter(b => b.status === "rejected").length;
        const assigned = bookings.filter(b => b.status === "assigned").length;
        const inTransit = bookings.filter(b => b.status === "in_transit").length;
        const delivered = bookings.filter(b => b.status === "delivered").length;
        const confirmed = bookings.filter(b => b.status === "confirmed").length;
        const disputed = bookings.filter(b => b.status === "disputed").length;

        const availableTankers = tankers.filter(t => t.status === "available").length;
        const busyTankers = tankers.filter(t => t.status === "busy").length;

        const availableDrivers = drivers.filter(d => d.status === "available").length;
        const busyDrivers = drivers.filter(d => d.status === "busy").length;


        // ===================================
        // DISPLAY STATISTICS
        // ===================================

        adminStats.innerHTML = "";

        const statistics = [
            ["Total Customers", customers.length],
            ["Total Bookings", bookings.length],
            ["Pending Bookings", pending],
            ["Approved Bookings", approved],
            ["Rejected Bookings", rejected],
            ["Assigned Bookings", assigned],
            ["Trips In Transit", inTransit],
            ["Delivered Bookings", delivered],
            ["Confirmed Deliveries", confirmed],
            ["Disputed Deliveries", disputed],
            ["Available Tankers", availableTankers],
            ["Busy Tankers", busyTankers],
            ["Available Drivers", availableDrivers],
            ["Busy Drivers", busyDrivers]
        ];

        statistics.forEach(item => {

            const card = document.createElement("div");

            card.style.border = "1px solid #ccc";
            card.style.padding = "15px";
            card.style.margin = "8px";
            card.style.display = "inline-block";
            card.style.borderRadius = "8px";
            card.style.minWidth = "130px";

            const heading = document.createElement("h4");
            heading.textContent = item[0];

            const number = document.createElement("h2");
            number.textContent = item[1];

            card.appendChild(heading);
            card.appendChild(number);

            adminStats.appendChild(card);

        });


        // ===================================
        // DISPLAY ALL BOOKINGS
        // ===================================

        adminBookingList.innerHTML = "";

        if (bookings.length === 0) {

            adminBookingList.textContent = "No bookings found.";

        } else {

            bookings.forEach(booking => {

                const card = document.createElement("div");

                card.style.border = "1px solid #ccc";
                card.style.padding = "15px";
                card.style.margin = "12px 0";
                card.style.borderRadius = "8px";

                const details = [
                    "Booking ID: " + booking.id,
                    "Customer: " + booking.customerName,
                    "Water Type: " + booking.waterType,
                    "Tanker Size: " + booking.tankerSize + " Gallons",
                    "Address: " + booking.deliveryAddress,
                    "Contact: " + booking.contactNumber,
                    "Assigned Tanker: " + (booking.assignedTanker || "Not Assigned"),
                    "Assigned Driver: " + (booking.assignedDriver || "Not Assigned"),
                    "Status: " + booking.status
                ];

                details.forEach(detail => {

                    const p = document.createElement("p");
                    p.textContent = detail;
                    card.appendChild(p);

                });

                adminBookingList.appendChild(card);

            });

        }


        // ===================================
        // DISPLAY TANKERS
        // ===================================

        adminTankerList.innerHTML = "";

        tankers.forEach(tanker => {

            const p = document.createElement("p");

            p.textContent =
                tanker.tankerNumber +
                " | Capacity: " + tanker.capacity +
                " Gallons | Status: " + tanker.status;

            adminTankerList.appendChild(p);

        });


        // ===================================
        // DISPLAY DRIVERS
        // ===================================

        adminDriverList.innerHTML = "";

        drivers.forEach(driver => {

            const p = document.createElement("p");

            p.textContent =
                driver.name +
                " | Phone: " + driver.phone +
                " | Status: " + driver.status;

            adminDriverList.appendChild(p);

        });

    } catch (error) {

        console.error("Admin Dashboard Error:", error);

        adminStats.textContent = "Unable to load statistics.";
        adminBookingList.textContent = "Unable to load bookings.";
        adminTankerList.textContent = "Unable to load tankers.";
        adminDriverList.textContent = "Unable to load drivers.";

    }

}
