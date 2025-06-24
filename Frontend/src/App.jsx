import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import HomeFeed from "./Pages/HomeFeed";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />}>
            <Route index element={<HomeFeed/>}/>
            <Route path="profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
