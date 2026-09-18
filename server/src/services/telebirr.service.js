let telebirrConfigPromise;
let telebirrClientPromise;

export async function getTelebirrConfig() {
  const required = [
    "TELEBIRR_FABRIC_APP_ID",
    "TELEBIRR_APP_SECRET",
    "TELEBIRR_MERCHANT_APP_ID",
    "TELEBIRR_MERCHANT_CODE",
    "TELEBIRR_PRIVATE_KEY",
    "TELEBIRR_NOTIFY_URL",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Telebirr is not configured. Missing: ${missing.join(", ")}`,
    );
  }

  if (!telebirrConfigPromise) {
    telebirrConfigPromise = import("@melakudemeke/telebirr-js").then(
      ({ Config }) => {
        const options = {
          fabricAppId: process.env.TELEBIRR_FABRIC_APP_ID,
          appSecret: process.env.TELEBIRR_APP_SECRET,
          merchantAppId: process.env.TELEBIRR_MERCHANT_APP_ID,
          merchantCode: process.env.TELEBIRR_MERCHANT_CODE,
          privateKey: process.env.TELEBIRR_PRIVATE_KEY,
          notifyUrl: process.env.TELEBIRR_NOTIFY_URL,
          redirectUrl: process.env.TELEBIRR_REDIRECT_URL || undefined,
        };
        return process.env.TELEBIRR_ENVIRONMENT === "production"
          ? Config.forProduction(options)
          : Config.forTest(options);
      },
    );
  }
  return telebirrConfigPromise;
}

export async function getTelebirrClient() {
  if (!telebirrClientPromise) {
    telebirrClientPromise = Promise.all([
      import("@melakudemeke/telebirr-js"),
      getTelebirrConfig(),
    ]).then(([module, config]) => {
      return new module.Telebirr(config);
    });
  }
  return telebirrClientPromise;
}

export const telebirrConfigured = () =>
  Boolean(
    process.env.TELEBIRR_FABRIC_APP_ID &&
    process.env.TELEBIRR_APP_SECRET &&
    process.env.TELEBIRR_MERCHANT_APP_ID &&
    process.env.TELEBIRR_MERCHANT_CODE &&
    process.env.TELEBIRR_PRIVATE_KEY &&
    process.env.TELEBIRR_NOTIFY_URL,
  );
