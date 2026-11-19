# PaaniLink – Water Tanker Booking and Dispatch System

## 1. Project Overview
PaaniLink is a web-based Water Tanker Booking and Dispatch System designed to simplify the process of booking, approving, assigning, and tracking water tanker deliveries.

The system connects customers, zone officers, hydrant operators, drivers, and administrators through a single platform.

## 2. Objectives
- Provide an online platform for water tanker booking.
- Manage subsidized and commercial water requests.
- Allow officers to approve or reject bookings.
- Allow operators to assign available tankers and drivers.
- Enable drivers to update delivery status.
- Allow customers to confirm delivery or report issues.
- Provide administrators with an overview of system activities.

## 3. Technologies Used
- HTML5 – Website structure
- CSS3 – Styling and responsive design
- JavaScript – Frontend functionality and dynamic DOM
- JSON Server – Mock REST API
- Fetch API – Communication with backend API
- VS Code – Development environment

## 4. User Roles

### Customer
- Register and log in.
- Submit water tanker booking requests.
- View booking status.
- Confirm delivery or report an issue.

### Zone Officer
- View booking requests.
- Approve or reject bookings.

### Hydrant Operator
- View approved bookings.
- Assign available tankers and drivers.

### Driver
- View assigned bookings.
- Start delivery trips.
- Mark deliveries as completed.

### Administrator
- View system statistics.
- Monitor all bookings.
- View tanker and driver availability.

## 5. Main Features
- User registration and login.
- Role-based dashboards.
- Water tanker booking.
- Booking approval and rejection.
- Tanker and driver assignment.
- Delivery status management.
- Customer delivery confirmation.
- Admin dashboard and system overview.
- Dynamic data fetching through Fetch API.
- Responsive user interface.

## 6. Project Folder Structure

```text
PaaniLink/
│
├── index.html
├── login.html
├── register.html
├── db.json
├── package.json
├── README.md
│
├── CSS/
│   └── style.css
│
├── js/
│   ├── auth.js
│   ├── booking.js
│   ├── officer.js
│   ├── operator.js
│   ├── driver.js
│   ├── admin.js
│   ├── logout.js
│   └── guard.js
│
├── customer/
│   └── dashboard.html
│
├── officer/
│   └── dashboard.html
│
├── operator/
│   └── dashboard.html
│
├── driver/
│   └── dashboard.html
│
└── admin/
    └── dashboard.html
```

## 7. Installation and Setup

### Requirements
- Node.js
- Visual Studio Code
- Live Server Extension

### Steps
1. Open the PaaniLink project folder in VS Code.
2. Open the terminal.
3. Install project dependencies:

```bash
npm install
```

4. Start JSON Server:

```bash
npx json-server db.json --port 3000
```

5. Open `index.html` using Live Server.
6. Register a customer account or log in using an existing account.

### API Base URL
```text
http://localhost:3000
```

## 8. API Resources
- `/users` – User accounts
- `/bookings` – Water tanker booking records
- `/tankers` – Tanker information
- `/drivers` – Driver information
- `/zones` – Zone information

## 9. Booking Workflow
1. Customer submits a booking request.
2. Zone Officer reviews the request.
3. Officer approves or rejects the booking.
4. Hydrant Operator assigns an available tanker and driver.
5. Driver starts the trip.
6. Driver completes the delivery.
7. Customer confirms delivery or reports an issue.
8. Administrator monitors system activities.

## 10. Future Enhancements
- Secure authentication and password hashing.
- Production backend using Node.js and Express.
- Database integration using MySQL or MongoDB.
- Real-time delivery tracking.
- Online payment integration.
- Automated SMS notifications.
- Transaction-based resource assignment.

## 11. Development Status
The frontend and role-based workflows have been implemented and tested using JSON Server as a mock REST API. A production backend and database can be integrated in the next development phase.

## 12. Conclusion
PaaniLink provides a centralized digital solution for water tanker booking and dispatch management. It improves coordination between customers, officers, operators, drivers, and administrators while making the booking and delivery process more organized.