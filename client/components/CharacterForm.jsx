import { useState } from 'react';

export default function CharacterForm({ onAdd }) {
  const [name, setName] = useState('');
  const [house, setHouse] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Character name is required!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          house: house.trim() || null,
          image_url: imageUrl.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create character');
      }

      const newCharacter = await response.json();
      onAdd(newCharacter);
      
      // Reset form
      setName('');
      setHouse('');
      setImageUrl('');
    } catch (error) {
      console.error('Error creating character:', error);
      alert('Failed to create character. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      marginBottom: '0',
      background: 'linear-gradient(135deg, #cc0000 0%, #2d7a3d 100%)',
      color: '#000000'
    }}>
      <h2 style={{ color: '#ffffff', marginTop: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Add New Character</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Name: *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter character name"
          required
          style={{ 
            width: '100%', 
            padding: '8px', 
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: '#000000'
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          House:
        </label>
        <input
          type="text"
          value={house}
          onChange={(e) => setHouse(e.target.value)}
          placeholder="Enter house name (optional)"
          style={{ 
            width: '100%', 
            padding: '8px', 
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: '#000000'
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Image URL:
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL (optional)"
          style={{ 
            width: '100%', 
            padding: '8px', 
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: '#000000'
          }}
        />
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1
        }}
      >
        {isSubmitting ? 'Adding...' : 'Add Character'}
      </button>
    </form>
  );
}

