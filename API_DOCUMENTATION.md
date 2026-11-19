# PaaniLink – API Documentation

## 1. Introduction
PaaniLink uses JSON Server to provide a mock REST API for communication between the frontend and project data.

**Base URL:**
`http://localhost:3000`

## 2. API Resources

| Resource | Endpoint | Purpose |
|---|---|---|
| Users | `/users` | User information |
| Bookings | `/bookings` | Booking records |
| Tankers | `/tankers` | Tanker information |
| Drivers | `/drivers` | Driver information |
| Zones | `/zones` | Zone information |

## 3. API Endpoints

### 3.1 Users

**Get all users**

- Method: GET
- Endpoint: `/users`
- Purpose: Retrieve registered users for login verification.

**Register a customer**

- Method: POST
- Endpoint: `/users`
- Purpose: Create a new customer account.

Example request:

```json
{
  "name": "Ali",
  "phone": "03000000000",
  "address": "Karachi",
  "email": "ali@example.com",
  "password": "example123",
  "role": "customer"
}
```

### 3.2 Bookings

**Get all bookings**

- Method: GET
- Endpoint: `/bookings`
- Purpose: Retrieve booking records.

**Create booking**

- Method: POST
- Endpoint: `/bookings`
- Purpose: Submit a new water tanker request.

**Update booking status**

- Method: PATCH
- Endpoint: `/bookings/:id`
- Purpose: Update booking status after approval, rejection, assignment, delivery, or customer confirmation.

Example request:

```json
{
  "status": "approved"
}
```

**Assign tanker and driver**

- Method: PATCH
- Endpoint: `/bookings/:id`
- Purpose: Save assigned tanker and driver details.

Example request:

```json
{
  "status": "assigned",
  "assignedTanker": "TK-101",
  "assignedTankerId": "T001",
  "assignedDriver": "Ali Ahmed",
  "assignedDriverId": "D001"
}
```

### 3.3 Tankers

**Get all tankers**

- Method: GET
- Endpoint: `/tankers`
- Purpose: Retrieve tanker records and availability.

**Update tanker availability**

- Method: PATCH
- Endpoint: `/tankers/:id`
- Purpose: Mark a tanker as busy or available.

Example request:

```json
{
  "status": "busy"
}
```

### 3.4 Drivers

**Get all drivers**

- Method: GET
- Endpoint: `/drivers`
- Purpose: Retrieve driver records and availability.

**Update driver availability**

- Method: PATCH
- Endpoint: `/drivers/:id`
- Purpose: Update driver status.

Example request:

```json
{
  "status": "busy"
}
```

### 3.5 Zones

**Get zones**

- Method: GET
- Endpoint: `/zones`
- Purpose: Retrieve zone information.

Note: Zone resource is currently reserved for future development.

## 4. Booking Status Values

| Status | Description |
|---|---|
| pending | Booking submitted |
| approved | Booking approved by officer |
| rejected | Booking rejected by officer |
| assigned | Tanker and driver assigned |
| in_transit | Driver has started the trip |
| delivered | Driver completed delivery |
| confirmed | Customer confirmed delivery |
| disputed | Customer reported a delivery issue |

## 5. Frontend API Communication

The project uses JavaScript Fetch API to communicate with JSON Server.

Example:

```javascript
fetch("http://localhost:3000/bookings")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("API Error:", error);
    });
```

## 6. HTTP Methods

| Method | Usage |
|---|---|
| GET | Retrieve data |
| POST | Create new records |
| PATCH | Update existing records |

## 7. Important Note
This documentation describes the currently implemented mock API using JSON Server. Authentication, authorization, database transactions, and production-level validation require a secure backend implementation.