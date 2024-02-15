import { useContext } from 'react';
import { ElementContext } from '../context/elements';

export const useElementContext = () => {
  return useContext(ElementContext);
};
