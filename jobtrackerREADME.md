# Job Tracker

A full-stack web application for running a job search end to end — tracking applications and their statuses, the skills each role calls for, the people attached to each opportunity, and a dashboard that rolls it all up.

[**Live demo →**](https://jobtracker-frontend-2hea.onrender.com/) · demo login `TestUser` / `Test123!`

> Hosted on Render's free tier, so the first request after a period of inactivity takes \~30–60 seconds to wake the server. Subsequent requests are fast.

Built as the capstone project for CS467 at Oregon State University.

---

## Features

- **Application tracking** — create, update, and delete job applications with status (`applied` → `waiting` → `interviewed` → `decision`), company, title, and application date. Listings are paginated.  
- **Skill library** — maintain a set of technical skills with a 1–5 comfort level, and map skills to the jobs that require them.  
- **Contacts** — track recruiters, referrers, and interviewers, and associate them with specific applications via a typed relationship.  
- **Dashboard** — aggregate stats in a single call: totals by status, skill counts, average comfort level, and skill coverage as a percentage of applications.  
- **Authentication** — registration and login issuing JWTs, bcrypt-hashed passwords, and a token-based password reset flow that resists email enumeration.

## Tech stack

| Layer | Technology |
| :---- | :---- |
| Frontend | React, Vite, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL |
| Auth | JSON Web Tokens, bcrypt |
| Testing | Postman collection run via Newman |
| Hosting | Render |

## Architecture

frontend/   React \+ Vite single-page app

backend/    Express REST API, auth middleware, controllers

tests/      Postman collection \+ environment, run with Newman

Every route outside `/api/auth` is protected by middleware that validates a bearer token and resolves the requesting user, so all queries are scoped to the authenticated account.

---

## Running locally

**Prerequisites:** Node.js, npm, and a local MySQL instance.

**1\. Clone**

git clone https://github.com/JacobStew88/CS467\_JobTracker.git

cd CS467\_JobTracker

**2\. Database**

Install MySQL for your platform and create a database for the app. Keep the connection URL — the backend needs it.

**3\. Backend**

cd backend

npm install

Create a `.env` file in `backend/`:

PORT=3000

DATABASE\_URL=mysql://user:password@localhost:3306/jobtracker

JWT\_SECRET=your-secret-here

npm run dev

**4\. Frontend**

cd frontend

npm install

npm run dev

**5\. Tests**

cd tests

newman run job\_tracker\_full\_test\_suite\_v5.postman\_collection.json \\

  \-e job\_tracker\_local.postman\_environment.json

---

## API reference

Base path: `/api`. All endpoints except `/api/auth/*` require a valid JWT in the `Authorization` header as a bearer token:

Authorization: Bearer \<token\>

Nested resources follow the pattern `resource1/:id1/resource2/:id2`.

### Authentication — `/api/auth`

Validation rules: email must be well-formed; username 3–20 characters; password at least 8 characters with an uppercase letter, a lowercase letter, a number, and a special character.

| Method | Endpoint | Description | Success |
| :---- | :---- | :---- | :---- |
| POST | `/auth/create-account` | Register a new user and return a JWT | 201 |
| POST | `/auth/login` | Authenticate and return a JWT | 200 |
| POST | `/auth/forgot-password` | Begin password reset | 200 |
| POST | `/auth/reset-password` | Complete reset with the issued token | 200 |

Request/response examples **POST `/api/auth/create-account`**

{

  "email": "user@example.com",

  "username": "dev\_user",

  "password": "StrongPassword123\!"

}

→ `201 Created` · `{ "token": "eyJhb..." }`

**POST `/api/auth/login`**

{ "username": "dev\_user", "password": "StrongPassword123\!" }

→ `200 OK` · `{ "token": "eyJhb..." }`

**POST `/api/auth/forgot-password`**

{ "email": "user@example.com" }

→ `200 OK` · `{ "message": "If an account exists, a password reset link has been generated." }`

The response is deliberately generic whether or not the account exists, to prevent email enumeration.

**POST `/api/auth/reset-password`**

{ "token": "a1b2c3d4e5f6g7h8...", "newPassword": "NewStrongPassword123\!" }

→ `200 OK`, or `400` if the token is missing/expired or the password fails complexity rules.

### User profile — `/api/users`

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | `/users` | Retrieve the authenticated user's profile |
| PUT | `/users` | Partially update `username` and/or `email` |
| DELETE | `/users` | Permanently delete the user and all associated data |

`DELETE` requires `{ "password": "..." }` in the body as a confirmation step.

### Jobs — `/api/jobs`

Statuses: `applied`, `waiting`, `interviewed`, `decision`.

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | `/jobs` | Create an application |
| GET | `/jobs` | Paginated list — `?limit=10&offset=0` (default 10, max 50\) |
| GET | `/jobs/:id` | Retrieve one application |
| PUT | `/jobs/:id` | Partially update any of company, title, status, date |
| DELETE | `/jobs/:id` | Delete an application |

{

  "company\_name": "Google",

  "job\_title": "Software Engineer Intern",

  "status": "applied",

  "application\_date": "2026-06-01"

}

### Skills — `/api/skills`

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | `/skills` | Create a skill — `skill_name`, `comfort_level` 1–5 |
| GET | `/skills` | List all skills |
| GET | `/skills/:id` | Retrieve one skill |
| PUT | `/skills/:id` | Update name and/or comfort level |
| DELETE | `/skills/:id` | Delete a skill |

### Contacts — `/api/contacts`

`first_name` is the only required field.

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | `/contacts` | Create a contact |
| GET | `/contacts` | List all contacts |
| GET | `/contacts/:id` | Retrieve one contact |
| PUT | `/contacts/:id` | Update contact details |
| DELETE | `/contacts/:id` | Delete a contact |

### Relations

Links jobs to skills and contacts. Both IDs are supplied in the URL.

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | `/skills/:skillId/jobs/:jobId` | Map a skill to a job |
| GET | `/skills/jobs/:jobId` | All skills required for a job |
| DELETE | `/skills/:skillId/jobs/:jobId` | Unmap (does not delete the skill) |
| POST | `/contacts/job/:jobId/contact/:contactId` | Link a contact — body: `{ "relationship_type" }` |
| GET | `/contacts/job/:jobId` | All contacts for a job, with relationship type |
| DELETE | `/contacts/job/:jobId/contact/:contactId` | Unlink (does not delete the contact) |

### Stats — `/api/stats`

`GET /api/stats/getDashboardStatsController` returns everything the dashboard needs in one round trip:

{

  "totalJobs": 24,

  "applied": 10,

  "waiting": 8,

  "interviewed": 4,

  "decision": 2,

  "totalSkills": 5,

  "averageComfortLevel": 7.4,

  "skillCoverage": \[

    { "skillName": "React", "comfortLevel": 9, "jobsWithSkill": 18, "percentageOfJobs": 75.0 }

  \]

}

### Error codes

| Status | Meaning |
| :---- | :---- |
| 400 | Invalid request body |
| 404 | Resource does not exist |
| 500 | Server-side error |

---

## Known limitations

- **Relation endpoints don't verify ownership.** The join routes between jobs, skills, and contacts accept IDs from the URL without confirming those records belong to the requesting user, which means an authenticated user could alter another user's relations. The fix is an ownership check in the middleware layer before the join is written — worth doing before this is used with real data.  
- Render's free tier spins down when idle, so the first request after a quiet period is slow.

## Roadmap

- Ownership validation on all relation endpoints  
- Rate limiting on the auth routes  
- Email delivery for the password reset flow (currently token-only)

