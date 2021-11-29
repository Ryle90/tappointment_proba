import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import './App.scss'

import Calculator from "./components/Calculator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator/>} />
      </Routes>
    </Router>
  );
}
