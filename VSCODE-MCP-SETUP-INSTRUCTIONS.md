# 🔧 VSCode MCP Configuration - COMPLETE GUIDE

**Problem:** MCP servers work in CLI but NOT in VSCode extension!

**Solution:** Add MCP configuration to VSCode settings

---

## 📋 **STEP-BY-STEP SETUP**

### **Step 1: Open VSCode Settings**

1. Open VSCode
2. Press `Ctrl+Shift+P` (Command Palette)
3. Type: `Preferences: Open User Settings (JSON)`
4. Press Enter

This opens: `C:\Users\Fearn\AppData\Roaming\Code\User\settings.json`

---

### **Step 2: Add MCP Configuration**

**Option A: Copy the entire configuration**

I've created a complete MCP config file: `vscode-mcp-settings.json`

**Copy the ENTIRE `claude-code.mcpServers` section** from that file into your `settings.json`.

**Option B: Manual addition**

Add this to your `settings.json`:

```json
{
  "traycer.enableAutoAnalysis": false,
  "traycer.additionalAgents": ["Codex", "Claude Code"],
  "kilo-code.allowedCommands": [...your existing commands...],
  "python.defaultInterpreterPath": "c:\\Python313\\python.exe",

  "claude-code.mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@kazuph/mcp-fetch"]
    },
    "dataforseo-serp": {
      "command": "node",
      "args": ["C:/Users/Fearn/mcp-servers/dataforseo-serp.js"],
      "env": {
        "DATAFORSEO_LOGIN": "craig.fearn@lighthousementoring.co.uk",
        "DATAFORSEO_PASSWORD": "9a2c6ace2bf8b626"
      }
    }
    ... (add all 22 servers from vscode-mcp-settings.json)
  }
}
```

---

### **Step 3: Restart VSCode**

1. Save `settings.json`
2. Close VSCode completely
3. Reopen VSCode
4. MCP servers should now be available!

---

## ✅ **Verification**

### **In VSCode:**
1. Open Claude Code chat (sidebar)
2. Type: "List available MCP tools"
3. You should see all DataForSEO, BrightData, and other tools!

### **Example Test:**
```
You: "Use dataforseo-serp to get Google search results for 'executive coaching UK'"

Claude: [Uses the serp_google_organic_live tool and returns results]
```

---

## 📊 **What Gets Configured**

### **22 MCP Servers for VSCode:**

**Core Tools (8):**
- puppeteer, fetch, chrome-devtools, astro-docs
- brightdata, digitalocean, dataforseo-mcp-server, starwind-ui

**DataForSEO (9):**
- dataforseo, dataforseo-serp, dataforseo-keywords
- dataforseo-backlinks, dataforseo-labs, dataforseo-merchant
- dataforseo-on-page, dataforseo-content, dataforseo-domain

**BrightData (5):**
- brightdata-proxy, brightdata-scraping, brightdata-datasets
- brightdata-serp, brightdata-web-unlocker

---

## 🔍 **Troubleshooting**

### **MCP Servers Not Showing:**
1. Check `settings.json` for syntax errors (missing commas, brackets)
2. Ensure file paths use forward slashes: `C:/Users/...` not `C:\Users\...`
3. Restart VSCode completely

### **Individual Server Not Working:**
1. Open VSCode Developer Console: `Help > Toggle Developer Tools`
2. Check Console tab for MCP errors
3. Verify the server file exists at the specified path

### **Still Not Working:**
1. Check if the extension is `claude-code` or different name
2. Try workspace settings instead: `.vscode/settings.json` in project
3. Verify Node.js is in PATH: `node --version` in terminal

---

## 🎯 **Now You Have:**

✅ **CLI Claude Code** - All MCP servers via `.claude.json`
✅ **VSCode Extension** - All MCP servers via `settings.json`
✅ **Global Access** - Works in every project in both CLI and VSCode!

---

## 📝 **Key Differences: CLI vs VSCode**

| Feature | CLI `claude` | VSCode Extension |
|---------|-------------|------------------|
| Config File | `.claude.json` | `settings.json` |
| Config Key | `mcpServers` | `claude-code.mcpServers` |
| Scope | User/Local/Project | User/Workspace |
| Location | `~/.claude.json` | `AppData/Roaming/Code/User/settings.json` |
| Setup Command | `claude mcp add` | Manual JSON edit |

---

## 🚀 **After Setup**

### **Test in VSCode:**
```
1. Open Claude Code chat
2. Ask: "What MCP tools do you have access to?"
3. Claude will list all 65+ tools from 22 servers!
```

### **Use DataForSEO:**
```
"Research keyword 'executive coaching' using dataforseo-keywords"
```

### **Use BrightData:**
```
"Scrape competitor website using brightdata-scraping"
```

---

**The setup is now COMPLETE for both CLI and VSCode!** 🎉
