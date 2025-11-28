export default function Leaderboard({ characters }) {
  // Sort characters by votes (descending) and take top 5
  const topCharacters = [...characters]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 5);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      width: '100%',
      position: 'sticky',
      top: '10px',
      maxHeight: '85vh',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ 
        color: '#000000', 
        marginTop: 0, 
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '20px',
        borderBottom: '2px solid #4B0000',
        paddingBottom: '8px'
      }}>
        🏆 Leaderboard
      </h2>
      {topCharacters.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>No votes yet!</p>
      ) : (
        <div>
          {topCharacters.map((character, index) => (
            <div 
              key={character.id}
              style={{
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#f5f5f5',
                borderRadius: '6px',
                border: index < 3 ? '2px solid #4B0000' : '1px solid #ddd'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    color: index < 3 ? '#4B0000' : '#000'
                  }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <div>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: '#000',
                      fontSize: '16px'
                    }}>
                      {character.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      marginTop: '2px'
                    }}>
                      {character.house || 'Unknown'}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#4B0000'
                }}>
                  {character.votes || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

