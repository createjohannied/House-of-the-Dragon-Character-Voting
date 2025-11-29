import { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import CharacterForm from './CharacterForm';

export default function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [votedCharacters, setVotedCharacters] = useState(() => {
    const saved = localStorage.getItem('votedCharacters');
    return saved ? JSON.parse(saved) : [];
  });

  // Save voted characters to localStorage
  useEffect(() => {
    localStorage.setItem('votedCharacters', JSON.stringify(votedCharacters));
  }, [votedCharacters]);

  // Fetch characters from server
  useEffect(() => {
    fetch('http://localhost:4000/api/characters')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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

  // Add character
  const handleAdd = (newCharacter) => {
    setCharacters([...characters, newCharacter]);
  };

  // Vote for character
  const handleVote = (id) => {
    if (votedCharacters.includes(id)) {
      alert('You have already voted for this character.');
      return;
    }

    fetch(`http://localhost:4000/api/characters/${id}/vote`, { method: 'PUT' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to vote');
        return res.json();
      })
      .then(updated => {
        setCharacters(characters.map(c => c.id === id ? updated : c));
        setVotedCharacters([...votedCharacters, id]);
      })
      .catch(err => {
        console.error('Error voting:', err);
        alert('Failed to vote. Please try again.');
      });
  };

  // Delete character
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this character?')) return;

    fetch(`http://localhost:4000/api/characters/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete character');
        return res.json();
      })
      .then(() => {
        setCharacters(characters.filter(c => c.id !== id));
      })
      .catch(err => {
        console.error('Error deleting character:', err);
        alert('Failed to delete character. Please try again.');
      });
  };

  if (loading) return <div style={{ padding: '20px', color: '#ffffff' }}>Loading characters...</div>;
  if (error) return (
    <div style={{ padding: '20px', color: '#ffcccc' }}>
      <h2>Error loading characters</h2>
      <p>{error}</p>
      <p>Make sure the server is running on http://localhost:4000</p>
    </div>
  );
  if (characters.length === 0) return <div style={{ padding: '20px', color: '#ffffff' }}>No characters found.</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto 20px', textAlign: 'center' }}>
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
            marginBottom: '15px'
          }}
        >
          {showAddForm ? '✕ Hide Add Character Form' : '+ Add New Character'}
        </button>
        {showAddForm && <CharacterForm onAdd={handleAdd} />}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '15px'
      }}>
        {characters.map(c => (
          <CharacterCard
            key={c.id}
            character={c}
            onVote={handleVote}
            onDelete={handleDelete}
            hasVoted={votedCharacters.includes(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
