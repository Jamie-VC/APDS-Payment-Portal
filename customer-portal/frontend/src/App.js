import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import PaymentForm from './components/PaymentForm';
import EmployeeLogin from './components/EmployeeLogin'; // Import Employee Login component
import './App.css';
import TransactionHistory from './components/TransactionHistory';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSignup, setShowSignup] = useState(false); // State to control modal visibility
    const [showLogin, setShowLogin] = useState(false);   // State to control login modal visibility
    const [showEmployeeLogin, setShowEmployeeLogin] = useState(false); // State to control employee login modal visibility

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLogin(false); // Close the login modal after successful login
    };

    const toggleSignupModal = () => {
        setShowSignup(!showSignup); // Toggle the signup modal
    };

    const toggleLoginModal = () => {
        setShowLogin(!showLogin); // Toggle the login modal visibility
    };

    const toggleEmployeeLoginModal = () => {
        setShowEmployeeLogin(!showEmployeeLogin); // Toggle the employee login modal visibility
    };

    return (
        <div className="App">
            <Router>
                <header className="App-header">
                    <p>Welcome to the App! Use the forms below to Sign Up, Login, or Make a Payment.</p>
                    <nav>
                        <button onClick={toggleSignupModal}>Sign Up</button>
                        <button onClick={toggleLoginModal}>Login</button>
                        <button onClick={toggleEmployeeLoginModal}>Employee Login</button> {/* Employee Login Button */}
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
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/employee/transactions" element={<TransactionHistory />} />
                    <Route path="/payment" element={<PaymentForm />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
