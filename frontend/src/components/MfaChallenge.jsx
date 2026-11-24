import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../api/client";

export default function MfaChallenge({ challenge, onComplete, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code from your authenticator app.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/auth/mfa/verify", {
        challengeToken: challenge.challengeToken,
        code
      });
      onComplete(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not verify the authenticator code.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mfa-panel">
      {challenge.mfaSetupRequired ? (
        <>
          <h2>Set up two-factor authentication</h2>
          <p>Scan this QR code using Google Authenticator, Microsoft Authenticator, or another TOTP app.</p>
          <div className="mfa-qr">
            <QRCodeSVG value={challenge.otpAuthUrl} size={200} />
          </div>
          <p className="mfa-key-label">Can’t scan it? Enter this setup key in your authenticator app:</p>
          <code className="mfa-key">{challenge.manualKey}</code>
          <p className="mfa-security-note">Keep this key private. Anyone who has it can generate your sign-in codes.</p>
          <p>Enter the current six-digit code from the app to finish setup.</p>
        </>
      ) : (
        <>
          <h2>Two-factor authentication</h2>
          <p>Enter the current six-digit code from your authenticator app.</p>
        </>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label htmlFor="mfa-code">Authenticator code</label>
        <input
          id="mfa-code"
          className="mfa-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
            setError("");
          }}
          required
        />
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Verifying..." : challenge.mfaSetupRequired ? "Enable 2FA and continue" : "Verify and sign in"}
        </button>
      </form>
      <button className="mfa-back" type="button" onClick={onBack} disabled={submitting}>
        Back
      </button>
    </section>
  );
}
