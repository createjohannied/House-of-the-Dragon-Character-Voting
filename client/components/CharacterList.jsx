import { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import CharacterForm from './CharacterForm';

export default function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Delete character handler
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this character?')) {
      return;
    }

    fetch(`http://localhost:4000/api/characters/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
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
    <div>
      <div style={{ maxWidth: '600px', margin: '0 auto 30px auto' }}>
        <CharacterForm onAdd={handleAdd} />
      </div>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        gap: '10px'
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
