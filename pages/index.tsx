import { NextUIProvider } from "@nextui-org/react";
import type { NextPage } from "next";

import Home from "@/modules/home/components/Home";

const HomePage: NextPage = () => {
  return (
    <NextUIProvider>
      <Home />
    </NextUIProvider>
  );
};

export default HomePage;
