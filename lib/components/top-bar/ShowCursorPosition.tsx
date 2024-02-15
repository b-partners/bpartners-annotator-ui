import { usePositionsContext } from '../../hooks';
import style from './style.module.css';

export const ShowCursorPosition = () => {
  const {
    cursorPosition: { x, y },
  } = usePositionsContext();

  return (
    <div className={style.positionContainer}>
      <div>
        <p>x : {x}</p>
      </div>
      <div>
        <p>y : {y}</p>
      </div>
    </div>
  );
};
