import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import PrivateLayout from "./layouts/PrivateLayout";
import CarPage from "./pages/CarPage";
import AddDetailPage from "./pages/AddDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<PrivateLayout />}>
          <Route path="/cars/:id" element={<CarPage />} />
          {/* <Route path="car/:id/detail/:id/edit" element={<CarPage />} /> */}
          <Route path="cars/:carId/detail/add" element={<AddDetailPage />} />
        </Route>
      </Route>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
