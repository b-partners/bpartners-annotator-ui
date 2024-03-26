type CustomButtonsProps = {
  scaleUp: () => void;
  scaleReste: () => void;
  scaleDown: () => void;
};

export const CustomButtons = ({ scaleUp, scaleReste, scaleDown }: CustomButtonsProps) => {
  return (
    <>
      <button onClick={scaleUp}>zoom CUSTOM +</button>
      <button onClick={scaleReste}>reset CUSTOM ✨</button>
      <button onClick={scaleDown}>zoom CUSTOM -</button>
    </>
  );
};
