# Send Question timing (time limit + start time) to Players, not just phase

Originally Players received no timing data at all for a Question — only the bare `game:phase` change — since the countdown was deliberately a Host-Screen-only affordance (CONTEXT.md's original "Question" definition: "no text, no countdown" on Player devices). The UI refinement pass wanted a real post-answer countdown circle on the Player's device instead of a static "answer locked in" message.

Decision: extend the Player-facing event for the Question phase to include `timeLimitSeconds` and `startedAtMs` (timing only — never question text, options, or the correct answer), and drive the post-answer countdown from that, synced to the same server clock the Host countdown already uses. The alternative (a cosmetic, non-synced spinner) was rejected because it could visibly drift from the real Reveal transition, which would look broken rather than lively.
