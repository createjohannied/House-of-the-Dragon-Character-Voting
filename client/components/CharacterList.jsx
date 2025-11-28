import { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import CharacterForm from './CharacterForm';
import Leaderboard from './Leaderboard';

export default function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [votedCharacters, setVotedCharacters] = useState(() => {
    // Load voted characters from localStorage
    const saved = localStorage.getItem('votedCharacters');
    return saved ? JSON.parse(saved) : [];
  });

  // Save voted characters to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('votedCharacters', JSON.stringify(votedCharacters));
  }, [votedCharacters]);

  // Fetch characters on page load
  useEffect(() => {
    fetch('http://localhost:4000/api/characters')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCharacters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching characters:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Add new character handler
  const handleAdd = (newCharacter) => {
    setCharacters([...characters, newCharacter]);
  };

  // Vote handler
  const handleVote = (id) => {
    // Check if user has already voted for this character
    if (votedCharacters.includes(id)) {
      alert('Thank you for voting! You have already voted for this character.');
      return;
    }

    fetch(`http://localhost:4000/api/characters/${id}/vote`, { method: 'PUT' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(updated => {
        setCharacters(characters.map(c => c.id === id ? updated : c));
        // Mark this character as voted
        setVotedCharacters([...votedCharacters, id]);
        alert('Thank you for voting!');
      })
      .catch(err => {
        console.error('Error voting:', err);
        alert('Failed to vote. Please try again.');
      });
  };


  if (loading) {
    return <div style={{ padding: '20px', color: '#ffffff' }}>Loading characters...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#ffcccc' }}>
        <h2>Error loading characters</h2>
        <p>{error}</p>
        <p>Make sure the server is running on http://localhost:4000</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div style={{ padding: '20px', color: '#ffffff' }}>
        <p>No characters found. The database might be empty.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', width: '100%' }}>
      {/* Main content area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: '500px', margin: '0 auto 15px auto', textAlign: 'center' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: showAddForm ? '#f44336' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '8px'
            }}
          >
            {showAddForm ? '✕ Hide Add Character Form' : '+ Add New Character'}
          </button>
          {showAddForm && (
            <CharacterForm onAdd={handleAdd} />
          )}
        </div>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '15px',
          width: '100%'
        }}>
          {characters.map(c => (
            <CharacterCard 
              key={c.id} 
              character={c} 
              onVote={handleVote} 
              hasVoted={votedCharacters.includes(c.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Leaderboard sidebar */}
      <div style={{ flexShrink: 0, width: '280px' }}>
        <Leaderboard characters={characters} />
      </div>
    </div>
  );
}
