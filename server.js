const https = require("https");
const fs = require("fs");
const os = require("os");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"), // Path to your key
  cert: fs.readFileSync("./localhost.pem"),    // Path to your certificate
};

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      handle(req, res);
    })
    .listen(3000, "0.0.0.0", () => {
      const interfaces = os.networkInterfaces();
      const localIP =
        Object.values(interfaces)
          .flat()
          .find((iface) => iface.family === "IPv4" && !iface.internal)?.address ||
        "your-local-ip";

      console.log("🚀 Server ready on:");
      console.log(`   Local:   https://localhost:3000`);
      console.log(`   Network: https://${localIP}:3000`);
    });
});