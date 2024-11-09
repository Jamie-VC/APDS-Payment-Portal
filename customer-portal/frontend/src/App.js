import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import PaymentForm from './components/PaymentForm';
import EmployeeLogin from './components/EmployeeLogin';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLogin(false);
    };

    const toggleSignupModal = () => {
        setShowSignup(!showSignup);
    };

    const toggleLoginModal = () => {
        setShowLogin(!showLogin);
    };

    const toggleEmployeeLoginModal = () => {
        setShowEmployeeLogin(!showEmployeeLogin);
    };

    return (
        <div className="App">
            <Router>
                <header className="App-header">
                    <p>Welcome to the App! Use the forms below to Sign Up, Login, or Make a Payment.</p>
                    <nav>
                        <button onClick={toggleSignupModal}>Sign Up</button>
                        <button onClick={toggleLoginModal}>Login</button>
                        <button onClick={toggleEmployeeLoginModal}>Employee Login</button>
                        {isLoggedIn && <Link to="/payment">Make a Payment</Link>}
                    </nav>
                </header>

                {/* Conditionally render the Signup modal */}
                {showSignup && <Signup closeModal={toggleSignupModal} />}

                {/* Conditionally render the Login modal */}
                {showLogin && <Login onLogin={handleLogin} closeModal={toggleLoginModal} />}

                {/* Conditionally render the Employee Login modal */}
                {showEmployeeLogin && <EmployeeLogin closeModal={toggleEmployeeLoginModal} />}

                <Routes>
                    <Route path="/" element={<p>Welcome to the Home Page!</p>} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/payment" element={<PaymentForm />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
