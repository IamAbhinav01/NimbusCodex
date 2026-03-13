import { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import EnvironmentGrid from '../components/EnvironmentGrid/EnvironmentGrid';
import EnvironmentDrawer from '../components/EnvironmentDrawer/EnvironmentDrawer';
import { environments, type Environment } from '../data/environments';

export default function Home() {
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EnvironmentGrid
          environments={environments}
          onSelectEnv={setSelectedEnv}
        />
      </main>
      <EnvironmentDrawer
        env={selectedEnv}
        onClose={() => setSelectedEnv(null)}
      />
    </>
  );
}
