## 1. Backend - Model Layer

- [x] 1.1 Add `findAll` method to userModel.js with pagination and search support
- [x] 1.2 Add `countDocuments` method to userModel.js for pagination total
- [x] 1.3 Update picker.js to include `isActive` in allowed fields

## 2. Backend - Middleware

- [x] 2.1 Add `isAdmin` middleware to authJWTMiddleWares.js
- [x] 2.2 Add error handling for non-admin access (403 Forbidden)

## 3. Backend - Service Layer

- [x] 3.1 Add `getAllUsers` function to userServices.js with pagination and search
- [x] 3.2 Add `getUserById` function to userServices.js
- [x] 3.3 Add `updateUserRole` function to userServices.js with self-protection
- [x] 3.4 Add `updateUserStatus` function to userServices.js with self-protection

## 4. Backend - Controller Layer

- [x] 4.1 Add `getAllUsers` controller to userControllers.js
- [x] 4.2 Add `getUserById` controller to userControllers.js
- [x] 4.3 Add `updateUserRole` controller to userControllers.js
- [x] 4.4 Add `updateUserStatus` controller to userControllers.js

## 5. Backend - Validation & Routes

- [x] 5.1 Add `updateRole` validation schema to userValidations.js
- [x] 5.2 Add `updateStatus` validation schema to userValidations.js
- [x] 5.3 Add admin routes to userRoutes.js under `/admin/users`
- [x] 5.4 Apply `isAdmin` middleware to all admin routes

## 6. Backend - Constants

- [x] 6.1 Add `USER_PER_PAGE_DEFAULT` and `PAGE_DEFAULT` to constants.js

## 7. Frontend - Redux Slice

- [x] 7.1 Create `adminUsersSlice.js` in src/redux/adminUsers/
- [x] 7.2 Add `fetchUsersAPI` async thunk
- [x] 7.3 Add `fetchUserByIdAPI` async thunk (used inline in fetchUsersAPI)
- [x] 7.4 Add `updateUserRoleAPI` async thunk
- [x] 7.5 Add `updateUserStatusAPI` async thunk
- [x] 7.6 Add reducer cases for all thunks
- [x] 7.7 Add slice to store.js

## 8. Frontend - API Layer

- [x] 8.1 API calls are in adminUsersSlice (no separate file needed)
- [x] 8.2 Same as 8.1
- [x] 8.3 Same as 8.1
- [x] 8.4 Same as 8.1

## 9. Frontend - Admin Route Protection

- [x] 9.1 Create `AdminRoute` component in src/pages/Auth/AdminRoute.jsx
- [x] 9.2 AdminRoute shows NotFound for non-admin users
- [x] 9.3 Add `/admin/*` routes to App.jsx with AdminRoute wrapper

## 10. Frontend - Admin Users Page

- [x] 10.1 Create AdminLayout.jsx in src/pages/Admin/
- [x] 10.2 Create AdminUsers.jsx route component in src/pages/Admin/
- [x] 10.3 Create UserManagement.jsx component with MUI DataGrid
- [x] 10.4 Add columns: Avatar, Username, Email, Role dropdown, Status switch, Actions
- [x] 10.5 Implement search input and pagination controls
- [x] 10.6 Connect role change to API
- [x] 10.7 Connect status toggle to API
- [x] 10.8 Connect search to API (filters by username or email)
