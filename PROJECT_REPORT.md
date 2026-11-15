# Project Report
## Enterprise Employee Service Desk & Workflow Management Portal

### Abstract
The Enterprise Employee Service Desk & Workflow Management Portal is a centralized web application designed to manage internal employee requests across departments such as IT, HR, Finance, Administration and Facilities. It replaces unstructured email and chat-based handling with a traceable workflow. Employees can create requests and monitor progress, executives can process assigned work, managers can oversee departmental operations, and administrators can manage user access.

### Problem Statement
When internal requests are handled through scattered emails and messaging applications, organizations face poor visibility, unclear ownership, delayed responses and difficulty measuring service quality. A centralized system is required to standardize request intake, assignment, communication, status tracking and service-level monitoring.

### Objectives
1. Provide one portal for employees to raise service requests.
2. Implement role-based access for Employee, Executive, Manager and Admin.
3. Maintain a controlled request lifecycle and assignment history.
4. Calculate SLA deadlines from priority-based targets.
5. Provide comments, notifications, activity history and audit logs.
6. Present operational summaries for managers and administrators.

### Technology Stack
Frontend: HTML5, CSS3, JavaScript, Fetch API.
Backend: Node.js and Express.js.
Database: SQLite.
Security: bcrypt password hashing, server-side sessions, authorization middleware, validation and file-size/type restrictions.
Tools: Visual Studio Code, npm, Postman, Git and GitHub.

### Modules
Authentication; Employee Dashboard; Request Creation; Request Management; Assignment; Priority and SLA; Comments; Notifications; Manager Analytics; Admin User Management; Audit Trail; REST API.

### Workflow
Submitted → Assigned → In Progress → Pending Information (when required) → In Progress → Resolved → Closed. The server validates every transition. Closed requests are not directly moved back to In Progress; employees must use the formal reopen action.

### Security
Passwords are stored as bcrypt hashes. Sessions are stored server-side in SQLite. Protected routes verify the logged-in user and role. Request access is scoped to the employee's own requests or the user's department. Staff-only internal notes are hidden from employees. File uploads are limited to an allow-list of document/image extensions and 5 MB.

### Testing
The project includes starter workflow tests and a manual test checklist in README.md. Functional tests should cover login, request creation, assignment, status updates, comments and notifications. Validation tests should cover missing fields, incorrect login and invalid uploads. Authorization tests should verify that employees cannot access admin APIs and managers cannot manage another department's requests.

### Conclusion
The project demonstrates the main architecture and business workflow of an enterprise service desk. It connects a responsive frontend to REST APIs, backend validation and a relational database. It provides a foundation for future enhancements such as email alerts, SLA escalation, smart categorization, duplicate detection and advanced reporting.
