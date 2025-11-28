export default function CharacterCard({ character, onVote, hasVoted }) {
  if (!character) {
    return null;
  }

  return (
    <div style={{ 
      border: '1px solid gray', 
      padding: '15px', 
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ color: '#000000', marginTop: 0, fontSize: '24px' }}>{character.name || 'Unknown'}</h3>
      <p style={{ color: '#000000', margin: '8px 0', fontSize: '16px' }}>House: {character.house || 'Unknown'}</p>
      <p style={{ color: '#000000', margin: '8px 0', fontSize: '16px' }}>Votes: {character.votes || 0}</p>
      {character.image_url && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
          <img 
            src={character.image_url} 
            alt={character.name} 
            style={{ 
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #ccc'
            }} 
          />
        </div>
      )}
      {hasVoted && (
        <div style={{
          padding: '10px',
          marginTop: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ✓ Thank you for voting!
        </div>
      )}
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => onVote(character.id)}
          disabled={hasVoted}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: hasVoted ? '#cccccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: hasVoted ? 'not-allowed' : 'pointer',
            opacity: hasVoted ? 0.6 : 1
          }}
        >
          {hasVoted ? 'Already Voted' : 'Vote'}
        </button>
      </div>
    </div>
  );
}
  