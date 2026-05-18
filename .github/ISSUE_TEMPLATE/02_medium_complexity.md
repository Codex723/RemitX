name: "Medium: Path Payment Comparison Engine"
about: "Implement logic to query multiple payment paths and rank them by total cost including anchor fees."
title: "[FEAT] Implement path payment comparison engine"
labels: ["enhancement", "medium"]
body:
  - type: markdown
    attributes:
      value: |
        The current router needs to be expanded to evaluate multiple potential paths and select the one with the lowest total cost (spread + fees).
