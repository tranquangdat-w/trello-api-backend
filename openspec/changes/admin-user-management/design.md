## Context

The backend has a user model with `role` ('client' | 'admin') and `isActive` boolean fields, but no admin-only endpoints exist. The frontend has no admin section at all. This change adds full admin user management capability.

**Current State:**
- User model: supports `role` and `isActive` fields
- Auth middleware: `isAuthorized` only checks token validity
- No admin-only routes
- Frontend: no admin routes or pages

**Stakeholders:** Application administrators who need to manage user accounts

## Goals / Non-Goals

**Goals:**
- Provide admin-only API endpoints for user management
- Create admin dashboard UI for managing users
- Protect admin routes from non-admin access
- Show 404 for non-admin users attempting to access admin routes (security through obscurity)

**Non-Goals:**
- User self-service role changes (only admins can change roles)
- User deletion functionality
- Audit logging of admin actions
- Bulk user operations

## Decisions

### 1. API Structure: Separate vs Extended Routes

**Decision:** Extend existing user routes with admin sub-routes (`/users/admin/*`)

**Rationale:**
- Keeps related user endpoints together
- Simpler than creating a new `adminRoutes.js`
- Consistent with existing patterns

**Alternative considered:** Create separate `/admin/users/*` routes
- Would require new route file and controller
- Less cohesive with existing user management

### 2. Frontend Route Location

**Decision:** `/admin/users`

**Rationale:**
- Clear separation between user-facing routes and admin routes
- Easy to add more admin sections later (`/admin/boards`, etc.)
- Follows common admin URL conventions

**Alternative considered:** `/setting/users`
- Less explicit about admin nature
- Could confuse regular users

### 3. User Protection Pattern

**Decision:** Admin users can be deactivated, but cannot remove their own admin role or deactivate themselves

**Rationale:**
- Prevents accidental lockout
- At least one admin always exists
- Clear and simple rule

**Alternative considered:** Allow self-modification
- Risk of admins locking themselves out
- Complex edge cases

### 4. Pagination Strategy

**Decision:** Backend returns pagination metadata; frontend uses MUI DataGrid

**Rationale:**
- MUI DataGrid has built-in pagination support
- Consistent with existing frontend patterns (boards already use pagination)
- Simple skip/limit implementation on backend

## API Design

```
GET    /v1/users/admin/users
       Query: ?page=1&limit=20&search=keyword
       Response: { users: [...], total: number, page: number, limit: number }
       - search: filters by username OR email (case-insensitive partial match)

GET    /v1/users/admin/users/:userId
       Response: { user }

PUT    /v1/users/admin/users/:userId/role
       Body: { role: 'client' | 'admin' }
       Response: { user }

PUT    /v1/users/admin/users/:userId/status
       Body: { isActive: true | false }
       Response: { user }
```

**Pagination defaults:** 20 users per page (configurable via `limit` query param)

## Frontend Structure

```
pages/Admin/
├── AdminLayout.jsx      # Shared admin layout (sidebar, header)
├── AdminUsers.jsx       # Route component
└── Users/
    ├── UserManagement.jsx    # Main table component
    └── UserRow.jsx          # Individual row (optional)
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Admin middleware misconfigured allows client access | Add integration tests for admin endpoints |
| Pagination edge cases (page > total) | Backend returns empty array, frontend handles gracefully |
| Race condition when updating role/status | Use optimistic updates with rollback on error |

## Resolved Decisions

1. **Pagination limit**: 20 users per page (configurable)
2. **Search/filter**: Yes - search by username OR email (case-insensitive partial match)
3. **User notifications**: No - status changes are silent (no email sent)
