---
name: Tailwind v4 spacing/max-w token collision
description: Custom --spacing-sm/md/lg/xl theme tokens silently shrink Tailwind's built-in max-w-{sm,md,lg,xl} utility scale.
---

When a Tailwind v4 project defines custom `@theme inline` spacing tokens named `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl` (e.g. 16/24/40/64px), Tailwind's generated `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl` utilities resolve to those spacing values instead of the framework's default max-width scale (24rem/28rem/32rem/36rem). This happens silently — no build error — and produces elements that are a few dozen pixels wide instead of the intended container width, often manifesting as text wrapping one word per line.

**Why:** Tailwind v4's `@theme` merges custom tokens into the same namespace as its built-ins; a spacing token with a keyword name (`sm`/`md`/`lg`/`xl`) collides with the `max-w-*` scale which shares those same keywords.

**How to apply:** In any project with this token pattern, never use `max-w-sm`, `max-w-md`, `max-w-lg`, or `max-w-xl` (also watch `max-w-xs` if `--spacing-xs` is defined). Use an explicit arbitrary value instead, e.g. `max-w-[24rem]`, `max-w-[20rem]`, `max-w-[28rem]`. This bug recurred a second time (after being fixed project-wide once) when new code was added later, so grep for `max-w-{xs,sm,md,lg,xl}` after adding any new UI in such a project before shipping.
