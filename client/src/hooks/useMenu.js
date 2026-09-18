import { useContext } from "react";
import { MenuContext } from "../context/MenuContext";

export default function useMenu() {
  return useContext(MenuContext);
}
