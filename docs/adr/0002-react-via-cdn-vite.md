# React + Vite for the client, not plain JS or CDN-based React

Considered plain HTML/CSS/JS (lowest setup risk, but hand-rolled DOM updates and leaderboard-reorder animations), React via CDN with in-browser Babel (real React syntax, zero build step, but non-production tooling participants would need to unlearn later), and React + Vite (real, production-grade tooling).

Decision: React + Vite. The workshop's core thesis is that agents absorb syntax/framework complexity so participants can focus on specifying intent — so React's extra vocabulary (components, JSX, hooks) isn't a competing lesson, it's a demonstration of that thesis. Given that, there's no reason to settle for CDN-based React's non-representative setup; Vite is what participants would actually use afterward (including the planned 5-6 week deep-dive course), and Vite/React declarative state makes the leaderboard reorder animations and Host/Player shared components straightforward.

Trade-off accepted: this adds Vite's dev server/build step as another thing that can fail in a participant's environment, stacked on `agy` (already the most likely setup failure point). Mitigated by the presenter verifying participant environments are solid before the session starts, rather than by simplifying the stack.

Follow-on decision: no Vite dev server at all, even during iteration. Express always serves the built static output plus Socket.IO on a single port (matching the single `localhost:1923` login screen used by both Host and Player). Seeing a change means re-running the build step rather than getting hot-reload — accepted to keep the mental model to "one URL, one port" instead of introducing a second dev-server port and a proxy config for a room with complete beginners.
