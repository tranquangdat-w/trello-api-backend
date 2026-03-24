## Why

The application lacks an admin panel for managing users. Administrators need the ability to view all users, toggle their active status, and change their roles (client/admin). Non-admin users attempting to access admin routes should see a 404 NotFound page for security through obscurity.

## What Changes

**Backend:**
- Add `isAdmin` middleware to protect admin-only routes
- Add `GET /users` endpoint to list all users with pagination
- Add `GET /users/:id` endpoint to get a single user
- Add `PUT /users/:id/role` endpoint to update user role
- Add `PUT /users/:id/status` endpoint to toggle user active/inactive

**Frontend:**
- Add `/admin/users` route with admin-only protection
- Create admin users page with MUI DataGrid table
- Add role dropdown (client/admin) per user
- Add active/inactive toggle per user
- Add `AdminRoute` component that shows NotFound for non-admin users

## Capabilities

### New Capabilities
- `admin-user-management`: Admin panel for managing users (list, toggle status, change roles)

### Modified Capabilities
- (none)

## Impact

**Backend:**
- `src/middlewares/authJWTMiddleWares.js` - Add `isAdmin` middleware
- `src/models/userModel.js` - Add `findAll`, `findById`, count methods
- `src/services/userServices.js` - Add admin service functions
- `src/controllers/userControllers.js` - Add admin controller functions
- `src/routes/v1/userRoutes.js` - Add admin routes

**Frontend:**
- `src/App.jsx` - Add `/admin/users` route with `AdminRoute`
- `src/pages/Admin/` - Create AdminUsers page with UserManagement component
- `src/redux/` - Add admin users slice
- `src/apis/index.js` - Add admin API calls
