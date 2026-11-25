# upi-mcp

MCP server for **UPI handle (VPA) verification**. It exposes a single tool,
`upi_handle_verify`, that checks whether a UPI ID is valid in **format** —
validated entirely offline, no API key required.

## What it does

A UPI ID (also called a **VPA — Virtual Payment Address**) has the shape:

```
localpart@server
```

for example `name@paytm`, `user@yupi`, `me@oksbi`. The grammar (UPI SDK / NPCI)
is:

```
localpart : [a-zA-Z0-9._-]+     (letters, digits, dot, underscore, hyphen)
'@'
server    : [a-zA-Z]+           (letters only)
```

`upi_handle_verify` returns:

```json
{ "valid": true, "validFormat": true, "upiId": "name@paytm" }
```

or, for a bad input:

```json
{ "valid": false, "validFormat": false, "error": "Invalid UPI format. ..." }
```

### Data source note — format validation only

There is **no reliable, free, no-key way to check whether a UPI handle is
actually active** (i.e. linked to a real, verified bank account). Confirming
liveness requires bank / RTP integration through a payment aggregator
(penny-drop or VPA-resolution APIs — e.g. Razorpay, Cashfree, Digi KYC, API
Express — all paid and business-KYC gated).

So this package validates **format only**. The `active` field is always
`undefined`; if you need live-activation checks, wire in a paid aggregator and
call it from `lib/upi.js`.

## Quick start

Requires **Node.js 18+**.

```bash
cd upi-mcp
npm install
npm start        # runs: node server.js
npm test         # runs: node scripts/test.mjs
```

## MCP client configuration (stdio)

Add this to your MCP client config (e.g. `claude_desktop_config.json` or any
MCP-compatible client):

```json
{
  "mcpServers": {
    "upi": {
      "command": "node",
      "args": ["/absolute/path/to/india-mcp/upi-mcp/server.js"],
      "transportType": "stdio"
    }
  }
}
```

(On Windows, point `args` at the full path to `server.js`.)

## Tool

### `upi_handle_verify`

Verifies the format of a UPI ID.

**Arguments**

| name     | type   | required | description                                  |
| -------- | ------ | -------- | -------------------------------------------- |
| `upi_id` | string | yes      | UPI ID / VPA to verify, e.g. `name@paytm`    |

**Example**

```json
{
  "name": "upi_handle_verify",
  "arguments": { "upi_id": "name@paytm" }
}
```

**Response**

```json
{ "valid": true, "validFormat": true, "upiId": "name@paytm" }
```

## How validation works

`verifyHandle()` in `lib/upi.js`:

1. Trims the input.
2. Rejects empty / non-string input.
3. Matches against `/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/`.
4. Confirms both the localpart and the server are non-empty.

It does **not** make any network call, so it is fast, free, and deterministic.

## Project layout

```
upi-mcp/
├── lib/
│   └── upi.js        # verifyHandle() — offline format validation
├── scripts/
│   └── test.mjs      # test suite
├── server.js         # MCP server (ListTools + CallTool, stdio)
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## License

MIT. See [LICENSE](./LICENSE).
