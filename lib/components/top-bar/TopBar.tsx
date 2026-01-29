import { ScaleCallbacks, ShowCursorPosition, usePositionsContext, useSizesContext } from '../..';
import style from './style.module.css';

interface TopBarProps {
  buttonsComponent?: ((callbacks: ScaleCallbacks) => React.ReactNode) | undefined;
}
export const TopBar = ({ buttonsComponent }: TopBarProps) => {
  const { scaleDown, scaleUp, scaleReste, isMoving, toggleIsMoving } = useSizesContext();
  const { xRef, yRef } = usePositionsContext();

  return (
    <div data-cy='annotator-top-bar' className={style.container}>
      {buttonsComponent ? (
        buttonsComponent({ scaleUp, scaleReste, scaleDown, xRef, yRef, toggleClickAction: toggleIsMoving, clickActionValue: isMoving })
      ) : (
        <>
          <ShowCursorPosition />
          <button onClick={scaleUp}>zoom +</button>
          <button onClick={scaleReste}>reset</button>
          <button onClick={scaleDown}>zoom -</button>
          <button onClick={toggleIsMoving}>{isMoving ? 'annotate' : 'move'}</button>
        </>
      )}
    </div>
  );
};
