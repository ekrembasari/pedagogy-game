
export type CognitiveStrugglePattern =
  | 'RandomGuessing'
  | 'SingleVariableFixation'
  | 'CrossCheckFailure'
  | 'InconsistentReasoning'
  | 'None'; // Represents no detectable struggle

// ⭐️ GOLDEN RULE:
// CognitiveStrugglePattern types may ONLY be imported by
// analysis, reporting, or AI-related modules.
// Any usage in application or presentation layers is strictly forbidden.
