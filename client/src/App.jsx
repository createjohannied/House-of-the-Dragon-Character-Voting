import CharacterList from '../components/CharacterList';

export default function App() {
  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh', 
      backgroundColor: '#4B0000',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#ffffff', textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>
        House of the Dragon Character Voting
      </h1>
      <CharacterList />
    </div>
  );
}
