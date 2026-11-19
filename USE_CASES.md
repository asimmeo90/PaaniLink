# PaaniLink – Use Case Documentation

## 1. Introduction
This document describes the interactions between different users and the PaaniLink Water Tanker Booking and Dispatch System.

## 2. Actors

The system has five main actors:

1. Customer
2. Zone Officer
3. Hydrant Operator
4. Driver
5. Administrator

## 3. Use Cases by Actor

### 3.1 Customer

**Use Cases:**
- Register Account
- Login
- Book Water Tanker
- Select Water Type
- Select Tanker Size
- Enter Delivery Address
- View Booking Status
- Confirm Delivery
- Report Delivery Issue
- Logout

**Description:**

The customer registers an account and logs into the system. The customer submits a tanker booking request by selecting water type and tanker size and entering delivery details. The customer can track booking status and confirm delivery or report an issue after delivery.

### 3.2 Zone Officer

**Use Cases:**
- Login
- View Booking Requests
- Approve Booking
- Reject Booking
- Logout

**Description:**

The Zone Officer reviews customer booking requests and decides whether to approve or reject each request.

### 3.3 Hydrant Operator

**Use Cases:**
- Login
- View Approved Bookings
- View Available Tankers
- View Available Drivers
- Assign Tanker
- Assign Driver
- Logout

**Description:**

The Hydrant Operator manages approved bookings by selecting suitable available tankers and drivers based on availability and tanker capacity.

### 3.4 Driver

**Use Cases:**
- Login
- View Assigned Bookings
- Start Trip
- Complete Delivery
- Logout

**Description:**

The driver views assigned bookings, starts the delivery trip, and updates the booking when the water delivery is completed.

### 3.5 Administrator

**Use Cases:**
- Login
- View System Statistics
- View All Bookings
- View Tanker Records
- View Driver Records
- Monitor Resource Availability
- Logout

**Description:**

The administrator monitors system activity through a centralized dashboard, including booking statistics and tanker and driver availability.

## 4. Main System Workflow

1. Customer submits a booking.
2. Zone Officer reviews the booking.
3. Officer approves or rejects it.
4. Hydrant Operator assigns a tanker and driver to an approved booking.
5. Driver starts the trip.
6. Driver completes the delivery.
7. Customer confirms delivery or reports an issue.
8. Administrator monitors the overall system.

## 5. Preconditions and Postconditions

| Use Case | Preconditions | Postconditions |
|---|---|---|
| Register | User is not registered | Customer account is created |
| Login | Valid account exists | User dashboard opens |
| Book Tanker | Customer is logged in | Booking is created with pending status |
| Approve Booking | Booking is pending | Booking becomes approved |
| Reject Booking | Booking is pending | Booking becomes rejected |
| Assign Resources | Booking is approved and resources are available | Booking becomes assigned |
| Start Trip | Booking is assigned to driver | Booking becomes in_transit |
| Complete Delivery | Trip is in progress | Booking becomes delivered |
| Confirm Delivery | Booking is delivered | Booking becomes confirmed |
| Report Issue | Booking is delivered | Booking becomes disputed |

## 6. Assumptions
- Customers can register through the registration page.
- Staff accounts are added by the administrator/developer in the current demo data.
- Each booking is reviewed by a Zone Officer.
- Tanker and driver availability is checked during assignment.
- JSON Server is used as a mock API for the current implementation.
- Production-level security and backend validation are future enhancements.

## 7. Conclusion
The use cases define how each actor interacts with PaaniLink. The system provides a structured workflow for booking, approval, assignment, delivery, and monitoring of water tanker services.