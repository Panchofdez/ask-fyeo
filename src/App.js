import React, { useState } from "react";
import "antd/dist/antd.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StaffHome from "./staff-side/StaffHome";
import Home from "./student-side/Home";
import ConversationList from "./staff-side/ConversationList";
import QuestionList from "./staff-side/QuestionList";
import FAQList from "./staff-side/FAQList";
import Dashboard from "./staff-side/Dashboard";
import Settings from "./staff-side/Settings";
import ShowConversation from "./staff-side/components/ShowConversation";
import ProtectedRoute from "./staff-side/ProtectedRoute";
import LoginModal from "./student-side/components/LoginModal";
import UpdateFAQ from "./staff-side/components/UpdateFAQ";
import ShowFAQ from "./staff-side/components/ShowFAQ";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/staff" element={<ProtectedRoute setShowLogin={setShowLogin} />}>
          <Route path="/staff" element={<StaffHome />}>
            <Route path="questions" element={<QuestionList />} />
            <Route path="questions/conversations/:id" element={<ShowConversation />} />
            <Route path="faq/conversations/:id" element={<ShowConversation />} />
            <Route path="faq/update" element={<UpdateFAQ />} />
            <Route path="faq/add" element={<UpdateFAQ />} />
            <Route path="faq/:id" element={<ShowFAQ />} />
            <Route path="faq/staff" element={<FAQList for_staff={true}/>} />
            <Route path="faq" element={<FAQList for_staff={false} />} />    
            <Route path="conversations" element={<ConversationList />} />
            <Route path="conversations/:id" element={<ShowConversation />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="/" element={<Home />} />
      </Routes>
      <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
    </Router>
  );
};

export default App;
