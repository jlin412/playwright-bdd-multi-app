# Core UI Checklist

**UI functional coverage gate.** Cross-cutting concerns are not repeated here —
reference the dedicated checklists:

- Security → [security.md](security.md)
- Accessibility → [accessibility.md](accessibility.md)
- Performance & reliability → [performance.md](performance.md)

## Core Functional Areas
- Authentication
- Authorization
- User roles
- Navigation
- Menus
- Routing
- Deep links
- Forms
- Required fields
- Optional fields
- Input validation
- Boundary values
- Special characters
- Duplicate submission
- CRUD flows
- Search
- Filtering
- Sorting
- Pagination
- Tables
- Data grids
- Dashboards
- Reports
- Export
- Import
- File upload
- File download
- Modals
- Popups
- Toast messages
- Tooltips
- Wizards
- Multi-step flows
- Date picker
- Time picker
- Calendar
- Rich text editor
- Profile
- Settings
- Notifications
- Email triggers
- Audit trail
- Error handling
- Empty states
- Loading states
- Success states
- Cancel flows
- Retry flows

## Session Behavior
Functional session flows. For session **security** posture (cookie flags, refresh
tokens, forced logout), see [security.md](security.md) § Session Security.

- Login
- Logout
- Session timeout
- Refresh page
- Browser back/forward
- Multiple tabs
- Remember me
- Token expiration
- Forced logout
- Concurrent sessions

## UI Negative Testing
- Blank inputs
- Invalid formats
- Max length
- Min length
- Unsupported characters
- Invalid file type
- Large file size
- Duplicate records
- Unauthorized access
- Broken navigation
- Slow response
- Interrupted operation

## Browser and Device Coverage
- Chrome
- Firefox
- Safari
- Edge
- Desktop
- Tablet
- Mobile browser
- Responsive layouts
- Different screen sizes
- Zoom levels
