# Astro MCP Queries Used by the Agent

This document lists all the Astro documentation queries the agent will make during its audit.

## 🔍 MCP Server Used
**astro-docs** - Official Astro documentation MCP server

## 📋 Query Categories

### Component Best Practices
```
"How to properly use the Astro Image component"
"Astro component prop typing with TypeScript"
"Best practices for Astro component structure"
"How to use slots in Astro components"
"Astro component composition patterns"
"Proper semantic HTML in Astro components"
```

### Performance Optimization
```
"Best practices for client directives in Astro"
"When to use client:load vs client:visible vs client:idle"
"Astro image optimization techniques"
"How to implement lazy loading in Astro"
"Astro performance optimization best practices"
"Reducing bundle size in Astro"
"Font loading optimization in Astro"
"CSS optimization in Astro"
```

### TypeScript Configuration
```
"Astro TypeScript configuration best practices"
"How to type component props in Astro"
"TypeScript interface for Astro props"
"Astro strict TypeScript mode"
"Type-safe Astro components"
```

### Accessibility
```
"Astro accessibility best practices"
"WCAG compliance in Astro"
"Semantic HTML in Astro"
"ARIA labels in Astro components"
"Keyboard navigation in Astro"
"Accessible forms in Astro"
```

### SEO
```
"Astro SEO best practices"
"How to add meta tags in Astro"
"Astro sitemap configuration"
"Structured data (Schema.org) in Astro"
"OpenGraph meta tags in Astro"
"Canonical URLs in Astro"
"SEO-friendly URL structure in Astro"
```

### View Transitions
```
"How to implement View Transitions in Astro"
"Astro View Transitions API best practices"
"Page transitions performance in Astro"
```

### Content Collections
```
"How to use content collections in Astro"
"Content collections schema definition"
"Querying content collections in Astro"
```

### Configuration
```
"astro.config.mjs best practices"
"Astro integrations configuration"
"Build optimization in astro.config.mjs"
"Image integration setup in Astro"
"Sitemap integration in Astro"
```

### Layouts
```
"Astro layout composition patterns"
"Base layout best practices in Astro"
"Layout inheritance in Astro"
```

### Routing
```
"Astro routing best practices"
"Dynamic routes in Astro"
"File-based routing in Astro"
```

## 🔄 Query Workflow

The agent queries the Astro MCP in this pattern:

### Phase 1: Initial Research
Before starting fixes, the agent queries:
1. "Astro best practices overview"
2. "Astro performance optimization"
3. "Astro accessibility guidelines"
4. "Astro SEO best practices"

### Phase 2: Issue-Specific Research
For each issue type found, query relevant docs:
- Found `<img>` tags → Query image component usage
- Found `client:load` → Query client directive best practices
- Missing TypeScript → Query prop typing patterns
- Missing alt tags → Query accessibility requirements

### Phase 3: Fix Verification
After implementing fixes:
- Query to verify the fix matches current best practices
- Confirm no deprecated patterns used
- Validate modern Astro patterns

## 📊 Query Frequency

**Expected MCP Queries During Full Audit:**
- Initial research: ~10 queries
- Per-file analysis: ~2-3 queries per file
- Fix verification: ~1 query per fix type
- Final validation: ~5 queries

**Total for typical site (50 files):** ~150-200 Astro documentation queries

This ensures EVERY decision is backed by official Astro documentation!

## 🎯 Example Query Session

```
Agent: "Querying Astro docs: How to properly use the Astro Image component"
MCP Response: [Official Astro Image component documentation]

Agent: "Querying Astro docs: Best practices for client directives performance"
MCP Response: [Client directive optimization guidelines]

Agent: "Querying Astro docs: TypeScript interface for Astro props"
MCP Response: [Prop typing patterns and examples]
```

## ✅ Benefits of MCP-Driven Approach

1. **Always Current:** Uses latest Astro documentation
2. **Accurate:** Every fix based on official best practices
3. **Comprehensive:** Covers all aspects of Astro development
4. **Verified:** No guessing, all changes are documented-backed
5. **Educational:** Reports include links to relevant docs

---

**The agent uses the Astro MCP extensively - it's the foundation of every decision!**
