import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { RouterProvider } from "./app/providers";
import { AuthProvider } from "./context/AuthContext";
import { MenuProvider } from "./context/MenuContext";

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <MenuProvider>
          <AppRoutes />
        </MenuProvider>
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
