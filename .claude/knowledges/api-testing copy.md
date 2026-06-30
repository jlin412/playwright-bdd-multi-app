# API Testing Knowledge

Use this checklist for API planning, manual API test design, and automation planning.

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

## Security
- Authentication
- Authorization
- Cross-tenant access
- Rate limiting
- Injection payloads
- Mass assignment
- Sensitive data exposure
- Token expiration
- Replay risk
- HTTPS only
- CORS where relevant

## Reliability and Performance
- Response time
- Timeout
- Retry behavior
- Idempotency
- Concurrency
- Race conditions
- Duplicate submissions
- Transaction rollback
- Partial failure
- Downstream service failure
- Caching
- Eventual consistency

## Data Validation
- Database created/updated/deleted correctly
- No duplicate records
- Audit log created
- Related objects updated
- Soft delete vs hard delete
- Cleanup required
- Data isolation between tests

## Manual Test Output Guidance
For planning, list endpoint-level test scenarios only.
For manual test cases, include method, endpoint, headers, request data, expected status, expected response, validation, priority, risk, and automation candidate.
For automation planning, decide existing API client vs new method, reusable schemas, fixtures, auth helpers, data builders, and tags.
