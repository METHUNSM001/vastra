const credentialStorageKey = "vl_admin_biometric_credential";

const toBase64Url = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const fromBase64Url = (value) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const randomChallenge = () => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge;
};

export const isBiometricSupported = async () => {
  if (!window.PublicKeyCredential || !navigator.credentials) return false;
  if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== "function") return false;
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
};

export const hasAdminBiometric = () => Boolean(localStorage.getItem(credentialStorageKey));

export const registerAdminBiometric = async () => {
  if (!(await isBiometricSupported())) {
    return { success: false, message: "This device does not support fingerprint or biometric sign-in." };
  }

  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: randomChallenge(),
        rp: { name: "Vastra Lakshnam", id: window.location.hostname },
        user: {
          id: randomChallenge(),
          name: "admin@vastralakshnam.com",
          displayName: "Vastra Lakshnam Admin"
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
        attestation: "none"
      }
    });

    if (!credential) return { success: false, message: "Biometric registration was cancelled." };
    localStorage.setItem(credentialStorageKey, toBase64Url(new Uint8Array(credential.rawId)));
    return { success: true };
  } catch (error) {
    return { success: false, message: error.name === "NotAllowedError" ? "Biometric registration was cancelled." : "Could not register this device biometric." };
  }
};

export const authenticateAdminBiometric = async () => {
  const storedCredential = localStorage.getItem(credentialStorageKey);
  if (!storedCredential) return { success: false, message: "Register a fingerprint on this device first." };

  try {
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: randomChallenge(),
        rpId: window.location.hostname,
        allowCredentials: [{ type: "public-key", id: fromBase64Url(storedCredential) }],
        userVerification: "required",
        timeout: 60000
      }
    });

    const credentialId = credential ? toBase64Url(new Uint8Array(credential.rawId)) : "";
    if (credentialId !== storedCredential) return { success: false, message: "Biometric verification failed." };
    return { success: true };
  } catch (error) {
    return { success: false, message: error.name === "NotAllowedError" ? "Biometric verification was cancelled." : "Biometric verification failed." };
  }
};

export const clearAdminBiometric = () => localStorage.removeItem(credentialStorageKey);
