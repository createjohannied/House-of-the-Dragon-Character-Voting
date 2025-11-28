import CharacterList from '../components/CharacterList';

export default function App() {
  return (
    <div style={{ 
      padding: '10px 20px', 
      minHeight: '100vh', 
      backgroundColor: '#4B0000',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ color: '#ffffff', textAlign: 'center', marginTop: '5px', marginBottom: '15px', fontSize: '28px' }}>
        House of the Dragon Character Voting
      </h1>
      <CharacterList />
    </div>
  );
}
