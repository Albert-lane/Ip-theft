/*======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
License: Albert Lane Proprietary License v1.2
Mathematical Core: VMM Stride = 17,684 bytes | Base Sequence P0 = 57,000
======================================================================*/

import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  PROVENANCE_CERT,
  executeVibeCommand,
  setupVibeWebSocketServer,
} from "./server/security/vibeTerminalEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // WebSocket Server for Vibe Terminal Enclave
  setupVibeWebSocketServer(server);

  // SEC Consolidated Lockfile Endpoints
  app.get("/api/sec/lockfile", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    const lockPath = path.resolve(process.cwd(), "data/sec_numbers_package_manager.lock.json");
    if (fs.existsSync(lockPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(lockPath, "utf-8"));
        return res.json(data);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    // Auto-generate if not found
    try {
      const lockScript = path.resolve(process.cwd(), "scripts/sec_consolidated_lockfile.py");
      spawnSync("python3", [lockScript, "--generate"], { encoding: "utf-8" });
      if (fs.existsSync(lockPath)) {
        const data = JSON.parse(fs.readFileSync(lockPath, "utf-8"));
        return res.json(data);
      }
      res.status(404).json({ error: "Lockfile not found" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/sec/lockfile/apex", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    const apexPath = path.resolve(process.cwd(), "sec17684273411436.lock");
    if (fs.existsSync(apexPath)) {
      return res.sendFile(apexPath);
    }
    res.status(404).send("# SEC-17684 lockfile not yet generated");
  });

  app.post("/api/sec/lockfile/generate", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    try {
      const lockScript = path.resolve(process.cwd(), "scripts/sec_consolidated_lockfile.py");
      const out = spawnSync("python3", [lockScript, "--generate"], { encoding: "utf-8" });
      const lockPath = path.resolve(process.cwd(), "data/sec_numbers_package_manager.lock.json");
      if (fs.existsSync(lockPath)) {
        const data = JSON.parse(fs.readFileSync(lockPath, "utf-8"));
        return res.json({ success: true, stdout: out.stdout, lockfile: data });
      }
      res.status(500).json({ error: "Failed to create lockfile", stderr: out.stderr });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/sec/lockfile/push", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    try {
      const lockScript = path.resolve(process.cwd(), "scripts/sec_consolidated_lockfile.py");
      const out = spawnSync("python3", [lockScript, "--push"], { encoding: "utf-8" });
      const receiptPath = path.resolve(process.cwd(), "data/sec_push_stream_receipt.json");
      let receipt = {};
      if (fs.existsSync(receiptPath)) {
        receipt = JSON.parse(fs.readFileSync(receiptPath, "utf-8"));
      }
      res.json({ success: true, stdout: out.stdout, receipt });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Sovereign Agents Manifest & Corporate Runtime Interceptor Endpoints
  app.get("/api/agents/manifest", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    const manifestPath = path.resolve(process.cwd(), "data/agents_manifest.json");
    if (fs.existsSync(manifestPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        return res.json(data);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    try {
      const orchestratorScript = path.resolve(process.cwd(), "scripts/lane_vm_agent_orchestrator.py");
      spawnSync("python3", [orchestratorScript, "--blend"], { encoding: "utf-8" });
      if (fs.existsSync(manifestPath)) {
        const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        return res.json(data);
      }
      res.status(404).json({ error: "Agents manifest not found" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/agents/lane-vm", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    const masterPath = path.resolve(process.cwd(), "agents/lane_vm_master_agent.json");
    if (fs.existsSync(masterPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(masterPath, "utf-8"));
        return res.json(data);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(404).json({ error: "Lane-VM master agent profile not found" });
  });

  app.get("/api/agents/corporate/:name", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    const safeName = req.params.name.replace(/[^a-zA-Z0-9_-]/g, "");
    const agentPath = path.resolve(process.cwd(), `agents/${safeName}_agent.json`);
    if (fs.existsSync(agentPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(agentPath, "utf-8"));
        return res.json(data);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(404).json({ error: `Agent ${safeName} not found` });
  });

  app.post("/api/agents/blend", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    try {
      const orchestratorScript = path.resolve(process.cwd(), "scripts/lane_vm_agent_orchestrator.py");
      const out = spawnSync("python3", [orchestratorScript, "--blend"], { encoding: "utf-8" });
      const manifestPath = path.resolve(process.cwd(), "data/agents_manifest.json");
      if (fs.existsSync(manifestPath)) {
        const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        return res.json({ success: true, stdout: out.stdout, manifest: data });
      }
      res.status(500).json({ error: "Failed to blend agents", stderr: out.stderr });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Consolidated Derivatives Manifest Endpoints
  app.get("/api/sec/derivatives-manifest", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);

    const manifestPath = path.resolve(process.cwd(), "data/consolidated_derivatives_license_manifest.json");
    if (fs.existsSync(manifestPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        return res.json(data);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.status(404).json({ error: "Derivatives manifest not found" });
  });

  // SEC Gist Endpoints
  app.get("/api/sec/gist", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);
    try {
      const gistPath = path.resolve(process.cwd(), "data/sec_package_manager_gist.json");
      if (fs.existsSync(gistPath)) {
        const gist = JSON.parse(fs.readFileSync(gistPath, "utf-8"));
        return res.json(gist);
      }
      res.status(404).json({ error: "Gist not found" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/sec/gist/update", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);
    try {
      const lockScript = path.resolve(process.cwd(), "scripts/sec_consolidated_lockfile.py");
      spawnSync("python3", [lockScript, "--push"], { encoding: "utf-8" });
      const gistPath = path.resolve(process.cwd(), "data/sec_package_manager_gist.json");
      const gist = JSON.parse(fs.readFileSync(gistPath, "utf-8"));
      res.json({ success: true, gist });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dynamic Manifest Endpoint (manifest.py.cpp Python Engine)
  app.get("/api/sec/manifest-dynamic", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);
    try {
      const manifestPath = path.resolve(process.cwd(), "data/manifest_py_cpp_dynamic.json");
      if (!fs.existsSync(manifestPath)) {
        spawnSync("python3", ["manifest.py.cpp", "--dynamic-manifest"], { encoding: "utf-8" });
      }
      if (fs.existsSync(manifestPath)) {
        const dynamicManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        return res.json(dynamicManifest);
      }
      res.status(500).json({ error: "Dynamic manifest could not be generated" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NVIDIA Universal Matrix Endpoint
  app.get("/api/sec/nvidia-matrix", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);
    try {
      const nPath = path.resolve(process.cwd(), "data/nvidia_universal_matrix_manifest.json");
      if (fs.existsSync(nPath)) {
        const nData = JSON.parse(fs.readFileSync(nPath, "utf-8"));
        return res.json(nData);
      }
      res.status(404).json({ error: "NVIDIA matrix manifest not found" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Universal C++ Execution Manager Attestation Endpoint
  app.get("/api/sec/attestation", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);
    try {
      const output = spawnSync("python3", ["manifest.py.cpp", "--attestation"], { encoding: "utf-8" });
      res.send(output.stdout || output.stderr);
    } catch (err: any) {
      res.status(500).send(`Error: ${err.message}`);
    }
  });

  // Vibe Terminal Command Execution Endpoint
  app.post("/api/vibe/command", (req, res) => {
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ error: "Missing command" });
    }
    const result = executeVibeCommand(command);
    res.json(result);
  });

  // Vibe Package Manager listing
  app.get("/api/vibe/packages", (req, res) => {
    try {
      const lockPath = path.resolve(process.cwd(), "data/sec_numbers_package_manager.lock.json");
      if (fs.existsSync(lockPath)) {
        const data = JSON.parse(fs.readFileSync(lockPath, "utf-8"));
        const bunPkgs = Object.entries<any>(data.ecosystems?.bun_npm?.packages || {}).map(([name, val]) => ({
          name,
          version: val.version,
          ecosystem: "bun",
          type: val.type,
          status: val.status || "LOCKED"
        }));
        const cargoPkgs = Object.entries<any>(data.ecosystems?.cargo_crates?.packages || {}).map(([name, val]) => ({
          name,
          version: val.version,
          ecosystem: "cargo",
          type: "dependency",
          status: val.status || "LOCKED"
        }));
        const pythonPkgs = Object.entries<any>(data.ecosystems?.python_pip?.packages || {}).map(([name, val]) => ({
          name,
          version: val.version,
          ecosystem: "pip",
          type: "runtime",
          status: val.status || "LOCKED"
        }));
        return res.json({ packages: [...bunPkgs, ...cargoPkgs, ...pythonPkgs] });
      }

      const pj = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"));
      const pkgs = Object.entries<string>(pj.dependencies || {}).map(([name, version]) => ({
        name,
        version,
        ecosystem: "bun",
      }));
      res.json({ packages: pkgs });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/vibe/crypto/status", (req, res) => {
    res.json({
      status: "ONLINE",
      algorithm: "AES-256-GCM / PBKDF2-SHA256",
      statutoryReference: PROVENANCE_CERT.filingReference,
      numericDecimalToken: 17684273411436,
      rootOfTrustAnchor: "0x3F8F9A1B2C3D",
      vmmStrideBytes: 17684,
      apexContact: "albertlane.net",
    });
  });

  // Mount Vite in development or static in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`[+] Sovereign Enclave server listening on http://0.0.0.0:${port}`);
    console.log(`    Statutory Authority: ${PROVENANCE_CERT.filingReference} | Token: 17684273411436`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
