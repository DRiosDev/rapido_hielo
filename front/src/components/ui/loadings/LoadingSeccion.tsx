import { Spin } from "antd";
import { LOGO } from "../../../constants/LOGO";

interface LoadingScreenProps {
  textLoading?: string;
}

export const LoadingSection = (props: LoadingScreenProps) => {
  const { textLoading } = props;

  return (
    <>
      <div
        role="status"
        className={`flex bg-white z-50 py-5  w-full justify-center
       flex-col items-center `}
      >
        <div
          className="flex flex-col items-center justify-center gap-4"
          role="status"
        >
          <img src={LOGO} width={150} alt="logo-vortex" />
          <Spin size="large" />
        </div>
        {textLoading && <p>{textLoading}</p>}
      </div>
    </>
  );
};
