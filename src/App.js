import React from "react";
import "antd/dist/antd.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StaffHome from "./staff-side/StaffHome";
import Home from "./student-side/Home";
import ConversationList from "./staff-side/ConversationList";
import Dashboard from "./staff-side/Dashboard";
import Settings from "./staff-side/Settings";
import ShowConversation from "./staff-side/components/ShowConversation";
import ProtectedRoute from "./staff-side/ProtectedRoute";
import { setTokenHeader } from "./api/api";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/staff" element={<ProtectedRoute />}>
          <Route path="/staff" element={<StaffHome />}>
            <Route path="conversations" element={<ConversationList />} />
            <Route path="conversations/:id" element={<ShowConversation />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
