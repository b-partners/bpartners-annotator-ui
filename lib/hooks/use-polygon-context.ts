import { useContext } from 'react';
import { PolygonContext } from '../context/polygon';

export const usePolygonContext = () => {
  const context = useContext(PolygonContext);

  return context;
};
