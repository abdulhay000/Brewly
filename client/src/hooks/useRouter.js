import { useContext } from "react";
import { RouterContext } from "../app/providers";

export default function useRouter() {
  return useContext(RouterContext);
}
