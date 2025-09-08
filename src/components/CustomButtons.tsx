import { ScaleCallbacks } from '../../lib';

export const CustomButtons = ({ scaleUp, scaleReste, scaleDown, xRef, yRef }: ScaleCallbacks) => {
  return (
    <>
      <div data-cy='annotator-cursor-positions'>
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
      <button onClick={scaleUp}>zoom CUSTOM +</button>
      <button onClick={scaleReste}>reset CUSTOM ✨</button>
      <button onClick={scaleDown}>zoom CUSTOM -</button>
    </>
  );
};
