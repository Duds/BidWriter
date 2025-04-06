import { useState } from 'react';

const FolderSelector = () => {
  const [projectPath, setProjectPath] = useState('');
  const [bidFolder, setBidFolder] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/generate-proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, bidFolder }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={projectPath}
        onChange={(e) => setProjectPath(e.target.value)}
        placeholder="Enter project path"
        required
      />
      <input
        type="text"
        value={bidFolder}
        onChange={(e) => setBidFolder(e.target.value)}
        placeholder="Enter bid folder name"
        required
      />
      <button type="submit">Generate Proposal</button>
    </form>
  );
};

export default FolderSelector; 