# 🚗 SmartParking Management System



A full-stack parking management system built with ASP.NET Core, Entity Framework Core, React, Material UI, and Microsoft SQL Server.



The project allows parking providers to manage parking lots and drivers to register vehicles and reserve parking spaces.



---



## ✨ Features



### Authentication

- User registration

- User login

- JWT authentication

- Driver / Provider roles



### Parking Providers

- Create parking lots

- View own parking lots

- Update parking lots

- Delete parking lots



### Drivers

- Register multiple vehicles

- View registered vehicles

- Many-to-many relationship between Users and Vehicles



### Reservations

- Reserve parking spaces

- Automatic free slot assignment

- Reservation confirmation

- Reservation status management



---



## 🛠️ Tech Stack



### Backend

- ASP.NET Core Web API

- Entity Framework Core

- SQL Server

- JWT Authentication



### Frontend

- React

- Material UI

- Axios

- React Router



---



## 🗄️ Database



Main entities:



- Users

- Vehicles

- VehicleAssignments

- ParkingLots

- ParkingSlots

- Reservations



Relationships include:



- User ↔ Vehicle (Many-to-Many)

- ParkingLot → ParkingSlots (One-to-Many)

- VehicleAssignment → Reservations

- ParkingSlot → Reservations



---



## 🚀 Getting Started



### Backend



```bash

cd SmartParking.API

dotnet restore

dotnet run

```



Backend runs on:



```

https://localhost:7205

```



---



### Frontend



```bash

cd smartparking-web

npm install

npm run dev

```



Frontend runs on:



```

http://localhost:5173

```



---



## 📸 Current Functionality



- ✅ Authentication

- ✅ Parking lot management

- ✅ Vehicle management

- ✅ Reservation creation

- ✅ Reservation history

- ✅ Responsive React UI



---



## 📚 Future Improvements



- Payment integration

- Google Maps integration

- QR code parking access

- Notifications

- Admin dashboard

- Search and filtering

- Reservation cancellation

- Real-time parking availability



---



## 👨‍💻 Author



**Lusine Mkrtchyan**



GitHub:

https://github.com/Luys-sys

