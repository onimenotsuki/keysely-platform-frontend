import { Navigate, useParams } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

import { createListSpaceStepPath } from './paths';

const ListSpaceEntryRedirect = () => {
  const { user } = useAuth();
  const { lang } = useParams<{ lang?: string }>();

  if (!user || !lang) {
    return <Navigate to="/" replace />;
  }

  const targetPath = createListSpaceStepPath(lang, user.id, 0);

  return <Navigate to={targetPath} replace />;
};

export default ListSpaceEntryRedirect;
