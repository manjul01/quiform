import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BuildForm from "./pages/BuildForm";
import FormPage from "./pages/FormPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import Feedback from "./pages/FeedbackPage";
import Header from "./components/Header";
import DashBoard from "./pages/DashBoard";
import Responses from "./pages/Responses";
import UserSubmission from "./pages/UserSubmission";
import RoutesWithHeader from "./pages/RoutesWithHeader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/login/:source" element={<LoginPage />} />
        <Route path="/user/signup/:source" element={<SignUpPage />} />
        <Route path="/feedback-page" element={<Feedback />} />
        <Route element={<RoutesWithHeader />}>
          <Route path="/user/dashboard" element={<DashBoard />} />
          <Route path="/form/responses/:formId" element={<Responses />} />
          <Route
            path="/form/user-submission/:formId/:userId"
            element={<UserSubmission />}
          />
          <Route path="/user/build-form/:formType" element={<BuildForm />} />
        </Route>

        <Route path="/form/:formId" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
