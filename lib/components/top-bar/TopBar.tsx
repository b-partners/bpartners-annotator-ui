import { ScaleCallbacks, ShowCursorPosition, usePositionsContext, useSizesContext } from '../..';
import style from './style.module.css';

interface TopBarProps {
  buttonsComponent?: ((callbacks: ScaleCallbacks) => React.ReactNode) | undefined;
}
export const TopBar = ({ buttonsComponent }: TopBarProps) => {
  const { scaleDown, scaleUp, scaleReste } = useSizesContext();
  const { xRef, yRef } = usePositionsContext();

  return (
    <div data-cy='annotator-top-bar' className={style.container}>
      {buttonsComponent ? (
        buttonsComponent({ scaleUp, scaleReste, scaleDown, xRef, yRef })
      ) : (
        <>
          <ShowCursorPosition />
          <button onClick={scaleUp}>zoom +</button>
          <button onClick={scaleReste}>reset</button>
          <button onClick={scaleDown}>zoom -</button>
        </>
      )}
    </div>
  );
};
