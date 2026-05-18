name: "Good First Issue: Define Remittance Types"
about: "Add TypeScript types for RemittanceCorridor, PathPaymentQuote, and AnchorFee."
title: "[TYPE] Define core remittance interfaces"
labels: ["good first issue", "typescript"]
body:
  - type: markdown
    attributes:
      value: |
        We need to formalize the data structures used for routing and fee comparison.
  - type: input
    id: scope
    attributes:
      label: "Affected Files"
      description: "Suggest where these types should live."
      placeholder: "e.g., src/types.ts"
