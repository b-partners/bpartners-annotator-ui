import { useSizesContext } from '../..';
import style from './style.module.css';

export const TopBar = () => {
  const { scaleDown, scaleUp, scaleReste } = useSizesContext();
  return (
    <div className={style.container}>
      <button onClick={scaleUp}>zoom +</button>
      <button onClick={scaleReste}>reset</button>
      <button onClick={scaleDown}>zoom -</button>
    </div>
  );
};
