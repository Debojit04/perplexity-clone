interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

function Suggestions({
  suggestions,
  onSuggestionClick,
}: SuggestionsProps) {
  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="suggestions">
      <h3>Related questions</h3>

      <div className="suggestion-list">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-item"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Suggestions;
