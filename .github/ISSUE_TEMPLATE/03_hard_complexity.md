name: "Hard: Real-Time DEX Rate Tracker"
about: "Build a stateful tracker that monitors the Stellar DEX and sends user alerts when rates hit a threshold."
title: "[FEAT] Real-time DEX Monitor and Alert System"
labels: ["hard", "high-priority"]
body:
  - type: markdown
    attributes:
      value: |
        We need a robust background service or state manager that polls the Stellar DEX and triggers callbacks when user-defined rate thresholds are crossed.
