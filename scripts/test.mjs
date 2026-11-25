import assert from 'node:assert';
import { verifyHandle } from '../lib/upi.js';

let passed = 0;
function ok(name, fn) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log('UPI handle (VPA) validation tests:');

// --- valid formats accepted ---
ok('accepts simple handle (name@paytm)', () => {
  const r = verifyHandle('name@paytm');
  assert.strictEqual(r.valid, true);
  assert.strictEqual(r.validFormat, true);
  assert.strictEqual(r.upiId, 'name@paytm');
});

ok('accepts handle with dots (first.last@upi)', () => {
  assert.strictEqual(verifyHandle('first.last@upi').valid, true);
});

ok('accepts handle with underscore and digits (user_01@oksbi)', () => {
  assert.strictEqual(verifyHandle('user_01@oksbi').valid, true);
});

ok('accepts handle with dash (my-name@yupi)', () => {
  assert.strictEqual(verifyHandle('my-name@yupi').valid, true);
});

ok('accepts leading/trailing whitespace (trims)', () => {
  assert.strictEqual(verifyHandle('  name@paytm  ').valid, true);
});

// --- invalid formats rejected ---
ok('rejects missing @', () => {
  const r = verifyHandle('namepaytm');
  assert.strictEqual(r.valid, false);
  assert.match(String(r.error), /format/i);
});

ok('rejects empty localpart (@server)', () => {
  const r = verifyHandle('@paytm');
  assert.strictEqual(r.valid, false);
  assert.match(String(r.error), /localpart/);
});

ok('rejects empty server (localpart@)', () => {
  const r = verifyHandle('name@');
  assert.strictEqual(r.valid, false);
  assert.match(String(r.error), /server/);
});

ok('rejects digits in server part (name@paytm123)', () => {
  assert.strictEqual(verifyHandle('name@paytm123').valid, false);
});

ok('rejects spaces inside handle (name @paytm)', () => {
  assert.strictEqual(verifyHandle('name @paytm').valid, false);
});

ok('rejects multiple @ signs (a@b@c)', () => {
  assert.strictEqual(verifyHandle('a@b@c').valid, false);
});

ok('rejects empty string', () => {
  assert.strictEqual(verifyHandle('').valid, false);
});

ok('rejects whitespace-only string', () => {
  assert.strictEqual(verifyHandle('   ').valid, false);
});

ok('rejects non-string input', () => {
  assert.strictEqual(verifyHandle(42).valid, false);
});

ok('active is undefined (no live-check available)', () => {
  assert.strictEqual(verifyHandle('name@paytm').active, undefined);
});

console.log(`\n${passed} passed, 0 failed`);
