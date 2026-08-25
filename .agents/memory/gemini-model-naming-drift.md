---
name: Gemini model name drift
description: Gemini model IDs (e.g. gemini-2.5-flash) can be retired for new API keys over time; the API's 404 error names the current replacement.
---

When calling the Gemini API directly (not via a proxy), a model name that is current per training knowledge or a user's spec can already be retired by the time the request runs — the Gemini API returns a 404 with a message like "This model models/X is no longer available to new users. Please update your code to use models/Y".

**Why:** model availability changes over calendar time independent of this codebase; hardcoding a model name from a spec or memory can silently break once Google retires it for new API keys.

**How to apply:** if a Gemini call fails with a 404 "no longer available" error, read the replacement model name directly out of the error message and use it — don't guess or fall back to an older model from training data.
