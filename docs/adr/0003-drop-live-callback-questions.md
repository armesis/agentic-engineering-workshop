# Drop the live-callback questions feature; Question Bank loads once at server startup

The original plan reserved 2-3 "live-callback" question slots to be written during the break and injected into the Question Bank without restarting the server, requiring some hot-reload mechanism (file-watcher vs. manual reload endpoint).

Decision: drop the feature entirely. The Question Bank CSV is read once when the server starts; there is no reload mechanism of any kind. This removes an entire category of edge cases (partial file writes, reload mid-Question, presenter forgetting to trigger reload) for a feature whose value (in-the-room inside jokes) wasn't worth that complexity.
