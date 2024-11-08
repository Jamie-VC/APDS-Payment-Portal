import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        idNumber: '',
        accountNumber: '',
        password: '',
    });
    const [message, setMessage] = useState(''); // State for success message
    const navigate = useNavigate(); // Hook to navigate
    const [errors, setErrors] = useState({}); // State for input validation errors
    const modalRef = useRef(); // Reference to modal content to detect clicks outside

    // Regex patterns for validation
    const patterns = {
        name: /^[a-zA-Z]{2,30}$/, // Letters only, 2 to 30 characters
        surname: /^[a-zA-Z]{2,30}$/, // Letters only, 2 to 30 characters
        idNumber: /^\d{6,16}$/, // 6 to 16 digits
        accountNumber: /^\d{5,16}$/, // 5 to 16? digits
        password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, // At least 8 characters, at least 1 letter, 1 number, and 1 special symbol
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        validateInput(e.target.name, e.target.value); // Validate input on change
    };

    // Validate input based on regex patterns
    const validateInput = (name, value) => {
        if (patterns[name]) {
            if (!patterns[name].test(value)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: `Invalid ${name}. Please follow the format of the hint text`
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: ''
                }));
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit
        if (Object.values(errors).some(error => error)) {
            alert("Please fix the errors before submitting.");
            return; // Prevent submission if there are validation errors
        }

        try {
            // POST request to backend
            const response = await axios.post('https://localhost:4000/api/users/signup', formData);
            console.log('Response data:', response.data); // Log the response from the server
            setMessage('Signup successful!'); // Set success message
            setTimeout(() => {
                navigate('/login'); // Redirect to login page after a short delay
                closeModal(); // Close the modal after successful signup
            }, 2000); // Adjust the delay as needed
        } catch (error) {
            // If there is a response from the server, log it
            if (error.response) {
                console.error('Error occurred:', error.response.data); // Log the error if signup fails
                alert(`Signup failed: ${error.response.data.error}`);
            } else {
                console.error('Error occurred:', error.message); // Log general errors
                alert(`Signup failed: ${error.message}`);
            }
        }
    };

    // Close the modal when clicked outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeModal]);

    return (
        <div className="modal">
            <div className="modal-content" ref={modalRef}>
                <button onClick={closeModal} className="close-btn">X</button>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        placeholder="Name (2-30 letters)"
                        required
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

                    <input
                        type="text"
                        name="surname"
                        onChange={handleChange}
                        placeholder="Surname (2-30 letters)"
                        required
                    />
                    {errors.surname && <p style={{ color: 'red' }}>{errors.surname}</p>}

                    <input
                        type="text"
                        name="idNumber"
                        onChange={handleChange}
                        placeholder="ID Number (6-16 digits)"
                        required
                    />
                    {errors.idNumber && <p style={{ color: 'red' }}>{errors.idNumber}</p>}

                    <input
                        type="text"
                        name="accountNumber"
                        onChange={handleChange}
                        placeholder="Account Number (5-16 digits)"
                        required
                    />
                    {errors.accountNumber && <p style={{ color: 'red' }}>{errors.accountNumber}</p>}

                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password (min 8 chars, 1 letter, 1 number, 1 Symbol)"
                        required
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

                    <button type="submit">Sign Up</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Signup;
