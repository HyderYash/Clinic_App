import { useRouter } from "next/router";
import { useEffect } from "react";

const Protected = (WrappedComponent) => {
  const ComponentWrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return ComponentWrapper;
};

export default Protected;
