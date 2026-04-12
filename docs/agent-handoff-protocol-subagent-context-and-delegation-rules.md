# Agent Handoff Protocol — Subagent Context & Delegation Rules

## Purpose

Standardized context injection and delegation patterns for autonomous subagent work on VeilX. Every spawned agent must receive enough context to work independently without re-reading the full spec.

---

## 1. Mandatory Context Block

Copy-paste this block into EVERY subagent prompt:

```
## VeilX Context
- Project: Private VPN service (VLESS+Reality), ~20 users, Russian UI, dark theme only
- Stack: Next.js 15 App Router, TypeScript strict, Tailwind v4, Vercel Postgres (raw SQL), Vultr VPS
- Work dir: /Users/ifrz/Downloads/VeilX
- Plans dir: /Users/ifrz/Downloads/VeilX/plans/
- Reports dir: /Users/ifrz/Downloads/VeilX/plans/reports/
- Full spec: plan/project.md
- Design system: DESIGN_SYSTEM.md
- Architecture: docs/system-architecture-veilx-components-and-data-flow.md
- Code standards: docs/code-standards-nextjs-typescript-tailwind.md
```

---

## 2. Agent-Specific Briefings

### planner

```
Read these before planning:
- plan/project.md (full spec: screens, flows, data, env vars, build phases)
- DESIGN_SYSTEM.md (UI tokens, components)
- docs/system-architecture-veilx-components-and-data-flow.md (target dir structure)
Output: plans/{date}-{slug}/plan.md + phase-XX-*.md files
```

### researcher

```
Focus area: [specify: Xray Reality setup / VLESS protocol / Vercel Postgres / etc.]
Output: plans/reports/researcher-{date}-{slug}.md
Keep report under 800 lines. Include code snippets where relevant.
```

### fullstack-developer

```
Read before coding:
- The specific phase plan assigned to you (plans/{plan}/phase-XX-*.md)
- DESIGN_SYSTEM.md (tokens, components, states)
- docs/code-standards-nextjs-typescript-tailwind.md
- Existing code in src/ (read before modifying)
Rules:
- TypeScript strict, no any
- Raw SQL via @vercel/postgres, no ORM
- VLESS links built server-side only
- Run compile check after every file change
File ownership: [specify glob patterns, e.g. "src/app/api/**"]
```

### tester

```
Read before testing:
- plan/project.md sections 3-5 (screens, flows, business rules)
- docs/system-architecture-veilx-components-and-data-flow.md (API contracts)
- All src/ files (read-only, never edit)
Rules:
- Real DB connections, no mocks
- Test all states: active, disabled, 404, rate-limited, VPS-unreachable
- File ownership: __tests__/** only
```

### code-reviewer

```
Review against:
- docs/code-standards-nextjs-typescript-tailwind.md
- DESIGN_SYSTEM.md (for frontend changes)
- plan/project.md (for correctness)
Security checklist:
- [ ] No env vars leaked to client
- [ ] timingSafeEqual for secret comparisons
- [ ] Parameterized SQL (no string interpolation)
- [ ] httpOnly + secure cookies
- [ ] Rate limiting on login
- [ ] Input validation (name ≤50 chars, trim)
Output: plans/reports/code-review-{date}-{slug}.md
```

### debugger

```
Diagnostics scope: [describe error/symptoms]
Read: relevant API route + lib/ files + VPS API code
Tools: Vercel logs, VPS systemd journal, Postgres queries
Output: plans/reports/debugger-{date}-{slug}.md
```

### database-admin

```
Schema reference: plan/project.md section 6
Tables: users, login_attempts
Indexes: users_token_idx (UNIQUE on token), users_vless_uuid_idx (UNIQUE on vless_uuid)
Driver: @vercel/postgres (raw SQL)
Output: migration SQL or optimization report
```

---

## 3. Delegation Patterns

### Feature Implementation (sequential)

```
1. planner     → Read spec, create phase plan with tasks
2. researcher  → Research unknowns (if any), report findings
3. fullstack   → Implement code per phase plan
4. tester      → Run tests, report failures
5. code-review → Review final code, flag issues
6. [fix loop]  → fullstack fixes → tester re-verifies → until green
```

### Multi-Phase Parallel

```
Agent A (frontend): src/app/*, src/components/*
Agent B (backend):  src/app/api/*, src/lib/*
─── both run simultaneously ───
Merge point: planner verifies integration
```

### Debug Cycle

```
1. debugger    → Diagnose, produce report with root cause
2. fullstack   → Fix based on debugger report (include file:line refs)
3. tester      → Verify fix, regression check
```

---

## 4. Report Naming

```
{agent-type}-{YYMMDD}-{HHMM}-{descriptive-slug}.md
```

Examples:
- `planner-260412-1930-veilx-phase-breakdown.md`
- `researcher-260412-1935-xray-reality-vless-protocol.md`
- `code-review-260413-1000-admin-api-security-audit.md`

---

## 5. Handoff Signals

| Signal | Meaning | Next Action |
|--------|---------|-------------|
| "Phase complete" | Agent finished its scope | Start next agent in chain |
| "Blocked: [reason]" | Cannot proceed | Orchestrator resolves or reassigns |
| "Tests failing: [count]" | Implementation issues | Route back to fullstack with failure details |
| "Security issue: [desc]" | Critical finding | Immediate fix before proceeding |
| "VPS unreachable" | Infra issue | Skip VPS-dependent tasks, flag for manual resolution |

---

## 6. Anti-Patterns (DO NOT)

- Do NOT spawn agents without the context block from section 1
- Do NOT let two agents edit the same file concurrently
- Do NOT skip tester after fullstack changes
- Do NOT let agents guess env var values — they read from spec only
- Do NOT use mocks for DB in tests
- Do NOT create new files when existing ones can be extended
- Do NOT add light mode, English UI, or ORM — these are explicit non-goals
