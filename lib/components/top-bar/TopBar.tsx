import { ScaleCallbacks, ShowCursorPosition, useSizesContext } from '../..';
import style from './style.module.css';

interface TopBarProps {
  buttonsComponent?: ((callbacks: ScaleCallbacks) => React.ReactNode) | undefined;
}
export const TopBar = ({ buttonsComponent }: TopBarProps) => {
  const { scaleDown, scaleUp, scaleReste } = useSizesContext();

  return (
    <div className={style.container}>
      <ShowCursorPosition />
      {buttonsComponent ? (
        buttonsComponent({ scaleUp, scaleReste, scaleDown })
      ) : (
        <>
          <button onClick={scaleUp}>zoom +</button>
          <button onClick={scaleReste}>reset</button>
          <button onClick={scaleDown}>zoom -</button>
        </>
      )}
    </div>
  );
};
