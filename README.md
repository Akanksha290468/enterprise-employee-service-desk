# Enterprise Employee Service Desk & Workflow Management Portal

An intermediate-level enterprise web application built with **HTML, CSS, JavaScript, Bootstrap-style responsive layout, Node.js, Express and SQLite**. It demonstrates the complete flow: frontend → REST API → backend business rules → database → authentication/authorization → workflow → audit trail.

## 1. Features implemented

- Login/logout using server-side sessions; passwords are hashed with bcrypt.
- Four roles: Employee, Department Executive, Manager and Admin.
- Protected API routes and role checks on the server (not just hidden frontend links).
- Employee request creation, request list, detail view, comments and notifications.
- Departments and request categories seeded automatically.
- Request assignment with assignment history.
- Controlled request lifecycle; invalid transitions are rejected. Employees can formally reopen their own closed request.
- Priorities: Low, Medium, High and Critical.
- SLA targets: Critical 4h, High 8h, Medium 24h, Low 72h; request detail shows deadline, remaining time and breach state.
- Search by request ID/title and filter by status/priority.
- Manager/admin dashboards with department, status, priority and workload summaries.
- Admin user creation and activation/deactivation.
- Public comments and staff-only internal notes.
- Status history, notifications and audit logs.
- Attachment upload with extension allow-list and 5 MB size limit.
- Postman collection and starter workflow tests.

## 2. Requirements

Install **Node.js 22 LTS (64-bit)** and VS Code. This package is pinned to Node 22 because its SQLite driver uses a native binary. Do not use Node 26 for this project. If your terminal still shows v26, uninstall that version, install Node 22 LTS, close every terminal/VS Code window, reopen VS Code, and verify `node -v` starts with `v22`. Internet is required once to download npm packages. No separate database server is needed: SQLite is stored locally in `backend/data/service_desk.db`.

## 3. Run in VS Code (Windows)

1. Extract `enterprise-employee-service-desk.zip` to a folder.
2. Open VS Code → File → Open Folder → select `enterprise-service-desk`.
3. Open Terminal → New Terminal.
4. Select **Command Prompt** from the terminal dropdown (recommended on Windows). If you use PowerShell, use `npm.cmd` rather than `npm`. Check Node and npm:
   ```powershell
   node -v
   npm -v
   ```
5. Install packages:
   ```powershell
   npm.cmd install
   ```
6. Copy `.env.example` to `.env`. Change `SESSION_SECRET` to a long random value. (The project also starts with a development fallback, but use a private secret for real deployment.)
7. Start the server:
   ```powershell
   npm.cmd start
   ```
8. Open **http://localhost:3000** in Chrome/Edge.
9. Keep the terminal open while using the application. Press `Ctrl + C` to stop it.

For auto-restart during development, use `npm.cmd run dev`.

## 4. Demo login accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@company.com | Admin@123 |
| Manager | manager@company.com | Manager@123 |
| Department Executive | executive@company.com | Exec@123 |
| Employee | employee@company.com | User@123 |

These are demonstration credentials only. Change or remove them before deployment. Demo records are created automatically on the first launch.

## 5. How to demonstrate the project

1. Sign in as Employee. Create a request such as “Laptop software access”. Select IT Support and High priority.
2. Open Requests and view the request detail. Show the request ID, SLA target, activity timeline and comments.
3. Sign out. Sign in as Manager. Open Requests, assign the new request to an IT executive and show the manager dashboard.
4. Sign out. Sign in as Executive. Open the request, add a comment and move it through In Progress → Resolved.
5. Sign in as Employee again. Check the notification and request status. If a request is closed, demonstrate the formal reopen action only through the permitted reopen API flow.
6. Sign in as Admin. Open Administration, create a test user, deactivate/activate a user and show the audit activity.

## 6. API overview

| Method | Endpoint | Purpose / access |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current session |
| GET | `/api/requests` | List/search/filter visible requests |
| POST | `/api/requests` | Create request (multipart form supported) |
| GET | `/api/requests/:id` | Request details, comments, history, SLA |
| PUT | `/api/requests/:id/assign` | Assign request (Manager/Admin) |
| PUT | `/api/requests/:id/status` | Controlled status update |
| POST | `/api/requests/:id/comments` | Add comment/internal note |
| GET | `/api/categories` | Categories |
| GET | `/api/departments` | Departments |
| GET | `/api/staff` | Assignable department staff (Manager/Admin) |
| GET | `/api/dashboard/employee` | Employee KPIs |
| GET | `/api/dashboard/manager` | Manager/Admin operational KPIs |
| GET | `/api/dashboard/admin` | Admin users and audit view |
| GET | `/api/notifications` | User notifications |
| GET | `/api/admin/reports` | Request report (Manager/Admin) |
| POST | `/api/admin/users` | Create user (Admin) |
| PATCH | `/api/admin/users/:id/active` | Activate/deactivate (Admin) |

Import `postman/Service-Desk.postman_collection.json` into Postman. First call the login request; Postman should retain the session cookie for subsequent requests when cookie handling is enabled.

## 7. Database design

The schema is initialized by `backend/db.js`. Main tables:

- `users` → department and role
- `departments` → service teams
- `categories` → linked to departments
- `service_requests` → employee, category, department, priority, status and assignee
- `assignments` → assignment history
- `comments` → request conversation and staff-only notes
- `status_history` → lifecycle events
- `notifications` → in-app messages
- `audit_logs` → important system actions

Relationships use primary keys and foreign keys. The SQLite file is created automatically after first start.

## 8. Test

Run:
```bash
npm.cmd test
```
The included starter tests verify key workflow transition rules. Also perform manual functional, validation and authorization tests using the checklist below.

## 9. Test-case checklist

| ID | Test | Expected result |
|---|---|---|
| TC01 | Login with valid employee credentials | Employee session starts |
| TC02 | Login with incorrect password | 401 error; no session |
| TC03 | Employee requests admin dashboard API | 403 Forbidden |
| TC04 | Create request without title | 400 validation error |
| TC05 | Create request with valid category | Request ID generated |
| TC06 | Manager assigns to same-department executive | Assignment and history saved |
| TC07 | Assign to another department's staff | Rejected |
| TC08 | Change Submitted to Assigned | Allowed for authorized staff |
| TC09 | Change Closed directly to In Progress | Rejected |
| TC10 | Employee reads another employee's request | 403 Forbidden |
| TC11 | Employee posts internal note | 403 Forbidden |
| TC12 | Upload file larger than 5 MB | Rejected |
| TC13 | Add normal comment | Comment appears in timeline/conversation |
| TC14 | Deactivate user as Admin | User can no longer log in |
| TC15 | Executive tries to create admin user | 403 Forbidden |

## 10. Troubleshooting

- **`npm` is not recognized:** Install Node.js LTS, close and reopen VS Code, then check `node -v` and `npm -v`.
- **Port 3000 already in use:** Set another `PORT` value in `.env`, for example `PORT=3001`, restart and visit that port.
- **Native module install/build issue:** Use current Node.js LTS (18/20/22), delete `node_modules` and `package-lock.json`, then run `npm.cmd install` again. On Windows, install the Visual Studio C++ Build Tools if npm reports a native compilation error for `better-sqlite3`.
- **Login data appears reset:** Do not delete `backend/data/service_desk.db`; that file contains the local database. The database is initialized with demo records only when empty.
- **Attachment not accepted:** Only PDF, PNG, JPG/JPEG, DOC/DOCX up to 5 MB are accepted.

## 11. Security and production notes

This is an educational internship project, not a production-certified HR platform. Before deployment, use HTTPS, a strong secret in `.env`, secure cookie settings, CSRF protection, rate limiting, virus scanning for uploads, MIME/content inspection, database backups, retention rules, stricter audit access, password reset, email verification, and professional accessibility/security testing. Do not publish real employee information or demo credentials.

## 12. GitHub upload

Create an empty repository on GitHub, then in the VS Code terminal:
```bash
git init
git add .
git commit -m "Initial Employee Service Desk project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/enterprise-employee-service-desk.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your GitHub username and use the repository URL GitHub gives you. Never commit `.env`, database files containing real information, or uploaded private documents. `.gitignore` excludes these by default.

## 13. Final submission checklist

- [ ] Source code and folder structure
- [ ] README and setup instructions
- [ ] Database initialized and demo data visible
- [ ] Four role demonstrations
- [ ] Postman collection
- [ ] Test-case checklist and test run
- [ ] Screenshots of login, employee dashboard, request form, request detail, manager dashboard and admin screen
- [ ] GitHub repository URL
- [ ] Final report / viva explanation

## 14. Scope notes

The current version is a runnable core implementation. Optional enhancements for a stronger final submission include email notifications, password reset, CSV export, full date-range filtering, server-side pagination controls, category/SLA administration UI, duplicate-request detection, smart categorization, escalation jobs, and a full ER diagram. These are intentionally listed as next-phase features rather than claimed as completed.

## 15. Included visual references

The `screenshots/` folder contains dashboard and request-form UI preview images plus an application architecture diagram and simplified ER diagram. The two UI images are visual previews for the project report; capture fresh live screenshots from your own running VS Code application after installing dependencies and using the demo accounts before final submission.


## 14. Windows setup (important)

Use Node.js **22 LTS x64**. After installation, restart VS Code. In VS Code choose Terminal → New Terminal and run:

```bat
node -v
npm -v
```

Expected Node output begins with `v22.`. Then run these commands from the project root (the folder containing `package.json`):

```bat
npm.cmd install
copy .env.example .env
npm.cmd start
```

If the terminal says `npm.ps1 cannot be loaded`, either select **Command Prompt** as the terminal profile and use `npm`, or stay in PowerShell and type `npm.cmd` exactly. Do not run commands from inside `backend` or `frontend`.

If `node -v` still displays `v26`, the old Node installation is still first in Windows PATH. Uninstall Node 26 from Windows Settings → Apps → Installed apps, install Node 22 LTS x64 from the official Node.js download page, restart Windows (or sign out/in), reopen VS Code, and verify again.

## 15. Screenshots included

The `screenshots` folder includes dashboard and request-form preview images plus the architecture and ER diagram. The dashboard/form pictures are design previews; after starting the live application, take fresh browser screenshots of your own running instance for final internship evidence. Use Windows Snipping Tool (`Win + Shift + S`) and save them in this folder.

## 16. Email submission

Attach the ZIP or (preferably) share the GitHub repository link, plus the final report PDF and screenshots if your mentor requests them. Suggested subject: `Week 3 Project Submission – Enterprise Employee Service Desk Portal`. Do not send `.env`, the SQLite database, real employee data, or private uploaded documents. See `FINAL_EMAIL_TEMPLATE.md`.
