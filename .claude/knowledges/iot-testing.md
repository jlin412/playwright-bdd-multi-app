# IoT Testing Knowledge

Use this checklist for IoT ecosystem planning and manual testing.

## Ecosystem Areas
- Device
- Firmware
- Mobile app
- Web portal
- Cloud backend
- Gateway/hub
- Protocols
- Telemetry
- Commands
- Notifications
- Rules/automation
- User roles
- Permissions

## Provisioning and Pairing
- New device setup
- BLE pairing
- Wi-Fi setup
- QR code setup
- Device registration
- Factory reset
- Re-pairing
- Duplicate device

## Connectivity
- Wi-Fi loss
- Bluetooth loss
- Cloud unavailable
- Mobile offline
- Device offline
- Router restart
- Reconnect behavior

## Commands and State
- Command success
- Command failure
- Timeout
- Retry
- Duplicate command
- Device state sync
- Cloud state sync
- Mobile state sync

## Firmware
- Update success
- Interrupted update
- Rollback
- Low battery during update
- Version display
- Compatibility

## Security
- Unauthorized device
- Guest access
- Revoked access
- Token expiration
- Replay risk
- Encryption
- Audit logs

## Output Guidance
Planning should cover device-cloud-mobile interactions.
Manual tests should validate physical device state, mobile state, cloud state, and logs where possible.
