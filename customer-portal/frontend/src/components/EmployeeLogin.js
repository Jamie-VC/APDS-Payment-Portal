import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeLogin = ({ closeModal }) => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState(''); // State to store validation errors
    const navigate = useNavigate(); // Create a navigate instance

    const modalRef = useRef(null); // Reference to the modal container

    // Basic regex patterns for validation
    const usernamePattern = /^[a-zA-Z0-9]{3,20}$/; // Example: Username must be 3-20 alphanumeric characters
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // At least 8 characters, at least 1 letter, 1 number, and 1 special symbol

    // Handle form input changes
    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    // Validate inputs using regex
    const validateInputs = () => {
        const { username, password } = loginData;

        if (!usernamePattern.test(username)) {
            setErrorMessage('Username must be 3-20 alphanumeric characters.');
            return false;
        }

        if (!passwordPattern.test(password)) {
            setErrorMessage('Password must be at least 8 characters long and contain both letters, numbers, and a special character.');
            return false;
        }

        setErrorMessage(''); // Clear error message if validation passes
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        // Validate form inputs before submitting
        if (!validateInputs()) {
            return; // Stop submission if inputs are invalid
        }

        try {
            const response = await axios.post('https://localhost:4000/api/employees/login', loginData); // POST request to backend
            if (response.status === 200) {
                console.log('Employee logged in successfully:', response.data.message);
                closeModal(); // Close the modal after successful login
                navigate('/dashboard', { state: { successMessage: `Logged in successfully as "${loginData.username}"!` } });
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || 'Login failed');
                console.error('Login error:', error.response.data); // Log error if login fails
            } else {
                setErrorMessage('An unexpected error occurred');
                console.error('Login error:', error.message);
            }
        }
    };

    // Close the modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                closeModal(); // Close the modal if click is outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeModal]);

    return (
        <div className="login-modal" ref={modalRef}>
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span> {/* Close button */}
                <h2>Employee Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            onChange={handleChange}
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
    
                {/* Display validation error messages */}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
        </div>
    );
};

export default EmployeeLogin;
