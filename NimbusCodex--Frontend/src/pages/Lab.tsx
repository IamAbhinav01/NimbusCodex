import { useSearchParams, Navigate } from 'react-router-dom';
import { environments } from '../data/environments';
import Workspace from '../components/Workspace/Workspace';

export default function Lab() {
  const [params] = useSearchParams();
  const envId = params.get('env');
  const environment = environments.find((e) => e.id === envId) ?? environments[0];

  if (!environment) return <Navigate to="/" replace />;

  return <Workspace environment={environment} />;
}
