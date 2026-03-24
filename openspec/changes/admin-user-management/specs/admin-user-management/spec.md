## ADDED Requirements

### Requirement: Admin can list all users

The system SHALL allow admin users to retrieve a paginated list of all users in the system.

#### Scenario: List users with pagination
- **WHEN** an admin requests `GET /v1/users/admin/users?page=1&limit=20`
- **THEN** the system SHALL return `{ users: [...], total: N, page: 1, limit: 20 }`
- **AND** each user object SHALL include `username`, `email`, `role`, `isActive`, `avatar`, `createdAt`

#### Scenario: List users without pagination params
- **WHEN** an admin requests `GET /v1/users/admin/users`
- **THEN** the system SHALL default to `page=1` and `limit=20`

#### Scenario: List users page beyond total
- **WHEN** an admin requests `GET /v1/users/admin/users?page=9999`
- **THEN** the system SHALL return `{ users: [], total: N, page: 9999, limit: 20 }`

#### Scenario: Search users by username
- **WHEN** an admin requests `GET /v1/users/admin/users?search=john`
- **THEN** the system SHALL return only users where username contains "john" (case-insensitive)
- **AND** the `total` SHALL reflect only matching users

#### Scenario: Search users by email
- **WHEN** an admin requests `GET /v1/users/admin/users?search=example.com`
- **THEN** the system SHALL return only users where email contains "example.com" (case-insensitive)

#### Scenario: Search combined with pagination
- **WHEN** an admin requests `GET /v1/users/admin/users?search=john&page=1&limit=10`
- **THEN** the system SHALL filter by search, then paginate the results

---

### Requirement: Admin can view single user

The system SHALL allow admin users to retrieve details of a specific user by ID.

#### Scenario: Get existing user
- **WHEN** an admin requests `GET /v1/users/admin/users/:userId`
- **THEN** the system SHALL return the user object with all fields

#### Scenario: Get non-existent user
- **WHEN** an admin requests `GET /v1/users/admin/users/invalid-id`
- **THEN** the system SHALL return 404 Not Found with message "User not found"

---

### Requirement: Admin can change user role

The system SHALL allow admin users to change the role of any user.

#### Scenario: Promote user to admin
- **WHEN** an admin requests `PUT /v1/users/admin/users/:userId/role` with body `{ "role": "admin" }`
- **THEN** the system SHALL update the user's role to "admin"
- **AND** return the updated user object

#### Scenario: Demote admin to client
- **WHEN** an admin requests `PUT /v1/users/admin/users/:userId/role` with body `{ "role": "client" }`
- **THEN** the system SHALL update the user's role to "client"
- **AND** return the updated user object

#### Scenario: Admin cannot demote themselves
- **WHEN** an admin requests `PUT /v1/users/admin/users/:ownUserId/role` with body `{ "role": "client" }`
- **THEN** the system SHALL return 400 Bad Request with message "Cannot modify your own role"

#### Scenario: Invalid role value
- **WHEN** an admin requests `PUT /v1/users/admin/users/:userId/role` with body `{ "role": "superuser" }`
- **THEN** the system SHALL return 400 Bad Request with validation error

---

### Requirement: Admin can toggle user active status

The system SHALL allow admin users to activate or deactivate any user account.

#### Scenario: Deactivate user
- **WHEN** an admin requests `PUT /v1/users/admin/users/:userId/status` with body `{ "isActive": false }`
- **THEN** the system SHALL update the user's `isActive` to false
- **AND** return the updated user object
- **AND** the user SHALL be unable to log in

#### Scenario: Activate user
- **WHEN** an admin requests `PUT /v1/users/admin/users/:userId/status` with body `{ "isActive": true }`
- **THEN** the system SHALL update the user's `isActive` to true
- **AND** return the updated user object

#### Scenario: Admin cannot deactivate themselves
- **WHEN** an admin requests `PUT /v1/users/admin/users/:ownUserId/status` with body `{ "isActive": false }`
- **THEN** the system SHALL return 400 Bad Request with message "Cannot modify your own status"

---

### Requirement: Admin routes require admin role

The system SHALL only allow users with `role: 'admin'` to access admin endpoints.

#### Scenario: Admin user accesses admin route
- **WHEN** a user with `role: 'admin'` makes a request to an admin endpoint
- **THEN** the system SHALL process the request normally

#### Scenario: Non-admin user accesses admin route
- **WHEN** a user with `role: 'client'` makes a request to an admin endpoint
- **THEN** the system SHALL return 403 Forbidden with message "Admin access required"

#### Scenario: Unauthenticated user accesses admin route
- **WHEN** a request without a valid token is made to an admin endpoint
- **THEN** the system SHALL return 401 Unauthorized

---

### Requirement: Frontend admin route protection

The frontend SHALL protect admin routes so non-admin users see a 404 NotFound page.

#### Scenario: Admin user accesses admin page
- **WHEN** a user with `role: 'admin'` navigates to `/admin/users`
- **THEN** the system SHALL display the admin users page

#### Scenario: Non-admin user attempts to access admin page
- **WHEN** a user with `role: 'client'` navigates to `/admin/users`
- **THEN** the system SHALL display the NotFound page (404)
- **AND** the URL SHALL remain `/admin/users`

---

### Requirement: Frontend displays user management table

The frontend admin page SHALL display a table of all users with controls to manage them.

#### Scenario: Display users table
- **WHEN** the admin users page loads
- **THEN** the system SHALL display a MUI DataGrid table
- **AND** show columns: Avatar, Username, Email, Role, Status, Actions

#### Scenario: Change user role from table
- **WHEN** an admin selects a new role from the role dropdown for a user
- **THEN** the system SHALL call `PUT /v1/users/admin/users/:userId/role`
- **AND** update the table with the new role

#### Scenario: Toggle user status from table
- **WHEN** an admin toggles the active switch for a user
- **THEN** the system SHALL call `PUT /v1/users/admin/users/:userId/status`
- **AND** update the table with the new status

#### Scenario: Pagination works
- **WHEN** the admin clicks "Next" on the pagination
- **THEN** the system SHALL fetch the next page of users
- **AND** display the new results

#### Scenario: Search filters users
- **WHEN** the admin types in the search box
- **THEN** the system SHALL filter users by username OR email (case-insensitive)
- **AND** display only matching results
- **AND** reset to page 1
