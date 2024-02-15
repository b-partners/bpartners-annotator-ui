import { useContext } from 'react';
import { PositionsContext } from '../context/positions';

export const usePositionsContext = () => {
  return useContext(PositionsContext);
};
