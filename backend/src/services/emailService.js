const net = require("net");
const tls = require("tls");

const { logInfo } = require("../utils/logger");

function getMailerConfig() {
  return {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    username: process.env.SMTP_USERNAME || "",
    password: process.env.SMTP_PASSWORD || "",
    fromAddress: process.env.SMTP_FROM_EMAIL || process.env.ADMIN_EMAIL || "admin@fruitstore.com",
    fromName: process.env.SMTP_FROM_NAME || process.env.ADMIN_NAME || "Fruit Store Admin",
  };
}

function createEnvelopeAddress(name, email) {
  const safeName = String(name || "").replace(/"/g, "");
  return safeName ? `"${safeName}" <${email}>` : email;
}

function toBase64(value) {
  return Buffer.from(String(value || ""), "utf8").toString("base64");
}

function escapeSmtpData(value) {
  return String(value || "").replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function waitForResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffer = "";

    const cleanup = () => {
      socket.off("data", handleData);
      socket.off("error", handleError);
      socket.off("end", handleEnd);
    };

    const finish = () => {
      const lines = buffer.split("\r\n").filter(Boolean);
      const lastLine = lines[lines.length - 1] || "";
      const code = Number(lastLine.slice(0, 3));

      if (!code) {
        cleanup();
        reject(new Error("SMTP server returned an invalid response."));
        return;
      }

      if (code >= 400) {
        cleanup();
        reject(new Error(lastLine.slice(4) || "SMTP request failed."));
        return;
      }

      cleanup();
      resolve({ code, message: lastLine.slice(4) });
    };

    const handleData = (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split("\r\n").filter(Boolean);
      const lastLine = lines[lines.length - 1] || "";

      if (/^\d{3} /.test(lastLine)) {
        finish();
      }
    };

    const handleError = (error) => {
      cleanup();
      reject(error);
    };

    const handleEnd = () => {
      cleanup();
      reject(new Error("SMTP connection closed unexpectedly."));
    };

    socket.on("data", handleData);
    socket.on("error", handleError);
    socket.on("end", handleEnd);
  });
}

async function sendCommand(socket, command, expectedCode) {
  socket.write(`${command}\r\n`);
  const response = await waitForResponse(socket);

  if (expectedCode && response.code !== expectedCode) {
    throw new Error(`SMTP command failed: expected ${expectedCode}, received ${response.code}.`);
  }

  return response;
}

function connectSmtp(config) {
  return new Promise((resolve, reject) => {
    const connector = config.secure ? tls.connect : net.connect;
    const socket = connector(
      {
        host: config.host,
        port: config.port,
        servername: config.host,
      },
      () => resolve(socket)
    );

    socket.once("error", reject);
  });
}

async function sendWithSmtp({ to, subject, text, html }) {
  const config = getMailerConfig();
  if (!config.host || !config.username || !config.password) {
    throw new Error("SMTP is not configured.");
  }

  const socket = await connectSmtp(config);

  try {
    await waitForResponse(socket);
    await sendCommand(socket, `EHLO ${config.host}`, 250);
    await sendCommand(socket, "AUTH LOGIN", 334);
    await sendCommand(socket, toBase64(config.username), 334);
    await sendCommand(socket, toBase64(config.password), 235);
    await sendCommand(socket, `MAIL FROM:<${config.fromAddress}>`, 250);
    await sendCommand(socket, `RCPT TO:<${to}>`, 250);
    await sendCommand(socket, "DATA", 354);

    const boundary = `fruit-store-${Date.now()}`;
    const message = [
      `From: ${createEnvelopeAddress(config.fromName, config.fromAddress)}`,
      `To: <${to}>`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      escapeSmtpData(text),
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      escapeSmtpData(html),
      "",
      `--${boundary}--`,
      "",
      ".",
    ].join("\r\n");

    socket.write(message);
    const response = await waitForResponse(socket);
    if (response.code !== 250) {
      throw new Error("SMTP server did not accept the message.");
    }

    await sendCommand(socket, "QUIT", 221);
  } finally {
    socket.end();
  }
}

async function sendPasswordResetEmail({ to, resetUrl, expiresInMinutes }) {
  const subject = "Reset your Fruit Store admin password";
  const text = [
    "You requested a password reset for your Fruit Store admin account.",
    "",
    `Reset your password using this link: ${resetUrl}`,
    "",
    `This link expires in ${expiresInMinutes} minutes.`,
    "If you did not request this change, you can ignore this email.",
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 12px; color: #059669;">Reset your Fruit Store admin password</h2>
      <p>You requested a password reset for your Fruit Store admin account.</p>
      <p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 12px; background: #059669; color: #ffffff; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
      </p>
      <p>If the button does not work, use this link:</p>
      <p><a href="${resetUrl}" style="color: #059669;">${resetUrl}</a></p>
      <p>This link expires in ${expiresInMinutes} minutes.</p>
      <p>If you did not request this change, you can ignore this email.</p>
    </div>
  `;

  try {
    await sendWithSmtp({
      to,
      subject,
      text,
      html,
    });
    logInfo(`Password reset email sent to ${to}.`);
  } catch (error) {
    logInfo(`Password reset email fallback for ${to}. Reset URL: ${resetUrl}`);
    logInfo(`SMTP delivery skipped: ${error.message}`);
  }
}

module.exports = {
  sendPasswordResetEmail,
};
