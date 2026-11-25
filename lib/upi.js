/**
 * Offline UPI handle (VPA) validation.
 *
 * A UPI ID / VPA (Virtual Payment Address) has the shape:
 *
 *     localpart@server
 *
 * for example: name@paytm, user@yupi, me@oksbi, first.last@upi.
 *
 * The authoritative grammar (UPI SDK / NPCI) is:
 *
 *     localpart : [a-zA-Z0-9._-]{1,}      (letters, digits, . _ -)
 *     '@'
 *     server    : [a-zA-Z]{1,}            (letters only, lower-case in practice)
 *
 * We validate the format locally with no network call.
 *
 * IMPORTANT: there is no reliable, free, no-key way to check whether a
 * VPA is actually *active* (i.e. linked to a real, verified bank account).
 * That requires bank / RTP integration via a payment aggregator
 * (penny-drop or VPA-resolution APIs, e.g. Razorpay, Cashfree, Digi KYC,
 * API Express — all paid and business-KYC gated). So this package offers
 * format validation only. `active` is left undefined.
 */

const VPA_RE = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;

/**
 * Validate a UPI handle (VPA) offline.
 *
 * @param {string} upiId - the UPI ID to validate, e.g. "name@paytm".
 * @returns {{ valid: boolean, validFormat?: boolean, active?: undefined, error?: string, upiId?: string }}
 */
function verifyHandle(upiId) {
  if (typeof upiId !== 'string') {
    return { valid: false, error: 'UPI ID must be a string' };
  }

  const raw = upiId.trim();

  if (raw.length === 0) {
    return { valid: false, error: 'UPI ID must not be empty' };
  }

  if (!VPA_RE.test(raw)) {
    return {
      valid: false,
      validFormat: false,
      error:
        'Invalid UPI format. Expected localpart@server, e.g. name@paytm ' +
        '(localpart of letters/digits/._- ; server of letters after @)',
    };
  }

  const [localpart, server] = raw.split('@');

  if (localpart.length === 0) {
    return {
      valid: false,
      validFormat: false,
      error: 'Missing localpart before @',
    };
  }

  if (server.length === 0) {
    return {
      valid: false,
      validFormat: false,
      error: 'Missing server after @',
    };
  }

  return {
    valid: true,
    validFormat: true,
    // No free, no-key way to confirm a VPA is live. Active-check needs
    // bank / RTP integration via a payment aggregator.
    active: undefined,
    upiId: raw,
  };
}

export { verifyHandle };
