import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from './components/Home'
import Main from './components/Main'
import Quiz from './components/Quiz'
import MiddleWare from "./components/MiddleWare";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";

function App() {

  return (
    <Router>
      <Routes >

        <Route exact path="/" element={<MiddleWare type="Guest" />} />

        <Route path="/login" element={<MiddleWare type="Login" />} >
          <Route path="/login" element={<Login />} />
        </Route>
      
        <Route path="/register" element={<MiddleWare type="Login" />} >
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route path="/home" element={<MiddleWare type="any" />} >
          <Route path="/home" element={<Home />} />
        </Route>

        <Route path="/quiz" element={<MiddleWare type="any" />} >
          <Route path="/quiz/:quizId" element={<Quiz />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router >
  )
}

export default App
