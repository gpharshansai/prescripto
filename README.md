# Prescripto - Doctor Appointment Platform

Prescripto is a full-stack doctor appointment booking platform built using the MERN stack. Patients can find doctors, book and manage appointments, and submit reviews. Images and data are stored locally

The application also includes separate Admin and Doctor dashboards for managing doctors, appointments, schedules, availability, and patients.

## Features

### Patient Features

- User registration and login
- Secure authentication using JWT
- Patient profile management
- Search doctors by name or speciality
- Filter doctors by speciality
- Filter available doctors
- Sort doctors by:
  - Consultation fee
  - Name
  - Rating
- View doctor details
- View doctor ratings and patient reviews
- View doctor-specific working days and timings
- View available appointment slots
- Book doctor appointments
- Reschedule appointments
- Cancel appointments
- Appointment history
- Submit doctor reviews and ratings after completed appointments
- Installable Progressive Web App (PWA)

### Doctor Features

- Doctor login
- Doctor dashboard
- View appointments
- View patient information
- Mark appointments as completed
- Cancel appointments
- Update profile information
- Update consultation fee
- Enable or disable appointment availability
- Configure working days
- Configure individual working hours
- Add leave / unavailable dates
- View earnings
- View appointment statistics
- View patient statistics

### Admin Features

- Admin authentication
- Add doctors
- Manage doctors
- View all appointments
- Cancel appointments
- Manage doctor availability
- View dashboard statistics

## Reviews and Ratings

Patients can review doctors only after their appointments have been completed.

The review system includes:

- 1 to 5 star ratings
- Written patient reviews
- One review per completed appointment
- Average doctor rating calculation
- Total review count
- Doctor rating display on doctor cards
- Patient reviews displayed on doctor profile pages

## Doctor Scheduling System

Doctors can manage their own appointment schedule from the Doctor Panel.

Doctors can:

- Select working days
- Set different start and end times for each day
- Mark specific dates as leave
- Disable appointment availability

Patients automatically see only valid and available appointment slots.

## Progressive Web App

Prescripto is configured as a Progressive Web App.

Users can install Prescripto on supported desktop and mobile devices and open it like a standalone application.

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication

- JSON Web Token
- bcrypt

### Storage

- MongoDB - application data
- Local disk - uploaded doctor and patient images

## Project Architecture

```text
Prescripto
│
├── frontend
│   ├── components
│   ├── pages
│   ├── context
│   └── assets
│
├── admin
│   ├── components
│   ├── pages
│   ├── context
│   └── assets
│
└── backend
    ├── config
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    └── server.js
```

## Run with Podman

The Podman Compose stack runs the frontend, admin panel, backend API, and a local
MongoDB. It builds each service from its `Containerfile`.

1. Install Podman and a Compose provider such as `podman-compose`
   (`python -m pip install podman-compose`). On Windows, start the Podman
   machine with `podman machine start` (create one first with
   `podman machine init` if needed).
2. From the project root, copy `.env.example` to `.env` and set a private
   `JWT_SECRET` and `ADMIN_PASSWORD`:
   `Copy-Item .env.example .env`
3. Build and start the stack:
   `podman compose up --build`
4. Open the patient app at `http://localhost:5173` or the admin panel at
   `http://localhost:5174`. The backend API is available at `http://localhost:4000`.
5. Stop the containers with `podman compose down`; add `--volumes` only if you
   also intend to delete the local MongoDB data.

The ports are bound to localhost for local development. MongoDB data and uploaded
images are stored in named volumes. The only required configuration is a private
JWT secret and admin credentials; no third-party API keys are used.

### Deploy on a Red Hat Enterprise Linux cloud VM

These steps expose the app directly on VM ports for testing. For a public
production deployment, put the services behind a domain and HTTPS reverse proxy
instead of sending credentials over plain HTTP.

1. Install Podman and a Compose provider supported by `podman compose` on the VM.
   Clone this project and change to its root directory.
2. Copy `.env.example` to `.env`. Set strong, unique values for `JWT_SECRET` and
   `ADMIN_PASSWORD`, then configure:

   ```env
   HOST_BIND_IP=0.0.0.0
   VITE_BACKEND_URL=http://<PUBLIC_IP_OR_DOMAIN>:4000
   ```

   Replace `<PUBLIC_IP_OR_DOMAIN>` with the VM's reachable public IP or domain.
   `VITE_BACKEND_URL` is embedded into the frontend during its image build.
3. Allow TCP ports `5173`, `5174`, and `4000` in both the cloud firewall/security
   group and the VM firewall. If `firewalld` is active, run:

   ```bash
   sudo firewall-cmd --permanent --add-port=5173/tcp
   sudo firewall-cmd --permanent --add-port=5174/tcp
   sudo firewall-cmd --permanent --add-port=4000/tcp
   sudo firewall-cmd --reload
   ```
4. Build and start the stack from the project root:

   ```bash
   podman compose up --build -d
   ```

5. Open `http://<PUBLIC_IP_OR_DOMAIN>:5173` for the patient app,
   `http://<PUBLIC_IP_OR_DOMAIN>:5174` for the admin/doctor panel, and
   `http://<PUBLIC_IP_OR_DOMAIN>:4000` to check the API.

MongoDB is not published to a host port. To stop the stack, run
`podman compose down`; do not add `--volumes` unless you intend to delete its
database and uploaded images. When changing the VM address or domain, update
`VITE_BACKEND_URL` and rebuild with `podman compose up --build -d`.
