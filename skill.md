---
name: upi-mcp
version: 0.1.0
description: MCP server for UPI handle (VPA) verification. Validates the format of a UPI ID such as name@paytm locally, with no API key.
author: King-AAA2012
license: MIT
---

# upi-mcp â€” Skill

A single MCP (Model Context Protocol) server for Indian data. It lets Claude
Desktop, Claude Code, Cline, or any other MCP client call tools backed by real
Indian data.


## Requirements
- **Node.js 18+
No API key is required.

## How to Install / Run

```bash
npm install
node server.js      # boots the MCP server over stdio
```

### Register with an MCP client

Add a server entry to your MCP client config JSON:

```json
{
  "mcpServers": {
    "upi-mcp": {
      "command": "node",
      "args": ["C:/Users/Aditya Shah/Desktop/Code/upi-mcp/server.js"]
    }
  }
}
```

## How to Verify (Tests)

```bash
npm test
```

## Selling / Redistributing

This skill is provided under MIT, so it may be sold or redistributed. Ship it
as its own zip (upi-mcp-0.1.0.zip) in the packages/ folder alongside the other
india-mcp packages.

