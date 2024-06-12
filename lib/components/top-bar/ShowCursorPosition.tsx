import { usePositionsContext } from '../../hooks';
import style from './style.module.css';

export const ShowCursorPosition = () => {
  const { xRef, yRef } = usePositionsContext();

  return (
    <div data-cy='annotator-cursor-positions' className={style.positionContainer}>
      <div>
        <p ref={xRef} data-cy='annotator-x-positions'>
          x : 0
        </p>
      </div>
      <div>
        <p ref={yRef} data-cy='annotator-y-positions'>
          y : 0
        </p>
      </div>
    </div>
  );
};
