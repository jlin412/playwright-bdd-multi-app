# Core API Checklist

**API functional coverage gate.** Cross-cutting concerns are not repeated here —
reference the dedicated checklists:

- Security → [security.md](security.md)
- Performance & reliability → [performance.md](performance.md)

## Core API Areas
- Resources
- Endpoints
- CRUD operations
- HTTP methods
- Path parameters
- Query parameters
- Headers
- Request body
- Response body
- Authentication
- Authorization
- User roles
- Status codes
- Error model
- Schema validation
- Required fields
- Optional fields
- Nullable fields
- Enumerations
- Data types
- Date/time formats
- IDs
- Pagination
- Filtering
- Sorting
- Search
- File upload
- File download
- Webhooks
- Events
- Audit logs
- Versioning
- Deprecation

## Positive Testing
- Valid request
- Valid auth
- Required fields supplied
- Optional fields supplied
- Correct response code
- Correct response body
- Correct database update
- Correct downstream behavior

## Negative Testing
- Missing auth
- Invalid token
- Expired token
- Wrong role
- Cross-user access
- Missing required field
- Invalid data type
- Invalid enum
- Invalid ID
- Malformed JSON
- Empty payload
- Unsupported media type
- Duplicate request
- Invalid query parameter
- Invalid path parameter

## Boundary Testing
- Minimum length
- Maximum length
- Empty string
- Null value
- Zero
- Negative number
- Very large number
- Large payload
- Special characters
- Unicode
- Date boundary
- Pagination first/last page

## Status Code Coverage
- 200 OK
- 201 Created
- 202 Accepted
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 415 Unsupported Media Type
- 422 Validation Error
- 429 Too Many Requests
- 500 Internal Server Error

## Data Validation
- Database created/updated/deleted correctly
- No duplicate records
- Audit log created
- Related objects updated
- Soft delete vs hard delete
- Cleanup required
- Data isolation between tests
