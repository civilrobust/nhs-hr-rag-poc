Replace the sources section (around line 160-180) with this improved version:

{msg.sources && (
  <div className="sources">
    <div className="sources-header">
      📄 Sources: 
      <span className="sources-hint">
        (Multiple sections from same policy may appear - showing most relevant parts)
      </span>
    </div>
    {msg.sources.map((source, j) => (
      <div key={j} className="source-item">
        <span className="source-name">
          {source.source}
          <span className="chunk-indicator"> • Section {j + 1}</span>
        </span>
        <span className="source-relevance">
          {(1 / (1 + source.distance)).toFixed(2)} score
        </span>
      </div>
    ))}
  </div>
)}
