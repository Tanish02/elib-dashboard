import useTokenStore from "@/store";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const token = useTokenStore((state) => state.token);

  if (token) {
    return <Navigate to={"/dashboard/home"} replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

//  end code

export default AuthLayout;
