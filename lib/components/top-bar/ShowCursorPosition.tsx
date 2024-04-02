import { usePositionsContext } from '../../hooks';
import style from './style.module.css';

export const ShowCursorPosition = () => {
  const {
    cursorPosition: { x, y },
  } = usePositionsContext();

  return (
    <div data-cy='annotator-cursor-positions' className={style.positionContainer}>
      <div>
        <p data-cy='annotator-x-positions'>x : {x}</p>
      </div>
      <div>
        <p data-cy='annotator-y-positions'>y : {y}</p>
      </div>
    </div>
  );
};
