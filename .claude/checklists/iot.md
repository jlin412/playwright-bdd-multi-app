# IoT Checklist

**IoT ecosystem coverage gate.** Cross-cutting concerns are not repeated here —
reference the dedicated checklists:

- Security → [security.md](security.md) (plus the IoT-specific items below)
- Performance → [performance.md](performance.md) § IoT Performance

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

## IoT-Specific Security
General security items (auth, authorization, tokens, encryption, audit logs) live in
[security.md](security.md). IoT adds:

- Unauthorized / rogue device
- Physical device tamper
- Guest vs owner device access
- Revoked device access
- Replay of device commands
