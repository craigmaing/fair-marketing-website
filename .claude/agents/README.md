# Claude Code Agents

This directory contains specialized agent configurations for automated workflows.

## 🔍 Astro Best Practices Auditor

**File:** `astro-best-practices-auditor.md`

**Purpose:** Comprehensive Astro site auditor that uses the Astro MCP (astro-docs) to systematically review and fix all non-best-practice code across the entire site.

### What It Does

The agent performs a complete audit of your Astro site and fixes:

- ❌ **Performance Issues**
  - Unoptimized images (converts to Astro Image component)
  - Unnecessary `client:load` directives (optimizes to `client:visible`/`client:idle`)
  - Large JavaScript bundles
  - Unoptimized fonts and CSS

- ♿ **Accessibility Violations**
  - Missing alt tags on images
  - Poor semantic HTML structure
  - Missing ARIA labels
  - Keyboard navigation issues
  - Color contrast problems
  - Missing form labels

- 🔍 **SEO Problems**
  - Missing or duplicate meta tags
  - Poor heading hierarchy
  - Missing structured data (Schema.org)
  - Unoptimized sitemap configuration

- 💻 **Code Quality Issues**
  - Missing TypeScript interfaces
  - Unused imports and dead code
  - Deprecated Astro patterns
  - Poor component organization
  - Hardcoded values that should be constants

- ⚙️ **Configuration Problems**
  - Missing astro.config.mjs optimizations
  - Improper integration setup
  - Missing build optimizations

### How to Use

#### Option 1: Trigger with Keywords
Just say any of these phrases:
- "audit astro"
- "fix astro"
- "astro best practices"
- "optimize astro site"
- "review astro code"

#### Option 2: Launch Manually
```bash
# Use the Task tool to launch the agent
Task: "Audit and fix all Astro best practices violations"
Agent: astro-best-practices-auditor
```

#### Option 3: In Conversation
Simply ask:
> "Can you audit the entire Astro site and fix everything that isn't best practice?"

Claude Code will automatically use this agent if it matches the task.

### What You'll Get

The agent will generate three comprehensive reports:

1. **ASTRO-AUDIT-REPORT.md**
   - Executive summary of all issues found
   - Performance analysis with Core Web Vitals
   - Accessibility compliance report
   - SEO analysis and recommendations
   - Code quality assessment
   - Detailed issue list with file:line references

2. **FIXES-APPLIED.md**
   - Complete before/after comparison
   - Every change made with rationale
   - File-by-file breakdown of fixes
   - Performance impact of each fix

3. **RECOMMENDATIONS.md**
   - Future improvements to consider
   - Best practices for ongoing development
   - Architectural suggestions
   - Maintenance guidelines

### Agent Workflow

The agent works through 7 systematic phases:

1. **Initial Scan** - Maps entire project structure
2. **Astro Docs Research** - Queries official Astro documentation for best practices
3. **Issue Identification** - Categorizes all problems found
4. **Prioritization** - Ranks fixes by impact (Critical → Low)
5. **Automated Fixes** - Applies fixes systematically
6. **Validation** - Ensures no breakage, verifies improvements
7. **Documentation** - Generates comprehensive reports

### MCP Integration

This agent heavily uses the **Astro MCP** (`astro-docs`) to:
- Verify every best practice before applying fixes
- Research modern Astro patterns
- Understand component architecture
- Check accessibility guidelines
- Review SEO recommendations
- Validate TypeScript patterns

The agent queries the Astro docs for every major decision to ensure accuracy.

### Success Criteria

The agent will achieve:
- ✅ Zero TypeScript errors
- ✅ All images optimized with Astro Image component
- ✅ Proper TypeScript interfaces on all components
- ✅ WCAG AA accessibility compliance
- ✅ Unique meta tags on all pages
- ✅ Lighthouse score 95+ on all metrics
- ✅ No unused code or imports
- ✅ Semantic HTML throughout
- ✅ Consistent code style

### Example Output

```markdown
# Astro Audit Report - 2025-10-08

## Executive Summary
- **Total Issues Found:** 147
- **Issues Fixed:** 147
- **Performance Improvement:** +23 points (Lighthouse)
- **Accessibility Violations Fixed:** 38
- **SEO Issues Resolved:** 19

## Detailed Fixes

### Performance (42 issues fixed)
- ✅ Converted 12 `<img>` tags to `<Image>` components
- ✅ Changed 8 `client:load` to `client:visible`
- ✅ Optimized font loading with `font-display: swap`
- ✅ Reduced bundle size by 127KB

### Accessibility (38 issues fixed)
- ✅ Added 24 missing alt tags
- ✅ Fixed heading hierarchy on 6 pages
- ✅ Added ARIA labels to 8 interactive elements
...
```

### Configuration Details

The agent is configured with:
- **Deep Thinking:** Enabled for complex architectural decisions
- **Extended Thinking:** Enabled for comprehensive analysis
- **Filesystem Access:** Read, Write, Edit, Glob, Grep
- **MCP Tools:** astro-docs
- **Analysis:** Performance, Accessibility, SEO, Security

### Best Practice Checks

The agent checks against comprehensive best practice lists in these categories:
- Component structure and TypeScript
- Performance optimization
- SEO requirements
- Accessibility standards (WCAG)
- Code quality metrics
- Configuration optimization

See the full configuration file for the complete checklist.

---

## Adding More Agents

To create additional agents:

1. Create a new `.md` file in `.claude/agents/`
2. Use YAML frontmatter with name, description, tools (optional), and model (optional)
3. Write comprehensive system prompt defining role and workflow
4. Document in this README

### Agent Structure Template

```markdown
---
name: agent-name
description: Description of when this agent should be used (this triggers auto-selection)
tools: tool1, tool2, mcp-server-name  # Optional - omit to inherit all tools
model: sonnet  # Optional - sonnet, opus, or haiku
---

# Agent Title

You are [role description].

## Core Responsibilities
- Responsibility 1
- Responsibility 2

## Workflow
1. Step 1
2. Step 2

## Guidelines
- Guideline 1
- Guideline 2

## Success Criteria
- Criteria 1
- Criteria 2
```

---

## Future Agents to Build

Suggested agents for this project:

- **seo-content-optimizer** - Uses DataForSEO MCP to optimize content
- **lighthouse-performance-runner** - Runs performance audits and fixes issues
- **competitor-analyzer** - Uses DataForSEO to analyze competitors
- **accessibility-validator** - Deep accessibility testing and fixes
- **figma-to-astro** - Converts Figma designs to Astro components
- **wordpress-migrator** - Migrates WordPress content to Astro

---

*Last Updated: 2025-10-08*
