#!/usr/bin/env node
/**
 * upi-mcp — MCP server for UPI handle (VPA) verification.
 *
 * Tools:
 *   upi_handle_verify — validate a UPI ID format locally (no key needed)
 *
 * Data source: pure local format validation. There is no reliable, free,
 * no-key API to check whether a UPI handle is actually *active*; that needs
 * bank / RTP integration through a payment aggregator. See README.md.
 */

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { verifyHandle } from './lib/upi.js';

const TOOLS = [
  {
    name: 'upi_handle_verify',
    description:
      'Verify a UPI handle (VPA - Virtual Payment Address) such as name@paytm. ' +
      'Checks the format (localpart@server). Use when a user asks to validate a ' +
      'UPI ID before sending a payment. NOTE: this confirms format only; there is ' +
      'no reliable free way to confirm a VPA is linked to a live account.',
    inputSchema: {
      type: 'object',
      properties: {
        upi_id: {
          type: 'string',
          description: 'UPI ID / VPA to verify, e.g. name@paytm or user@oksbi.',
        },
      },
      required: ['upi_id'],
    },
  },
];

const server = new Server(
  { name: 'upi-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const wrap = (ok, content) => ({
    content: [{ type: 'text', text: JSON.stringify(ok, null, 2) }],
  });

  if (name === 'upi_handle_verify') {
    const raw = args?.upi_id;
    if (!raw) {
      return wrap(false, [{ type: 'text', text: 'Missing required argument: upi_id' }]);
    }
    return wrap(true, [{ type: 'text', text: JSON.stringify(verifyHandle(raw), null, 2) }]);
  }

  return {
    error: `Unknown tool: ${name}`,
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('upi-mcp server running on stdio');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
