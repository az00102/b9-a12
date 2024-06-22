import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import axios from 'axios';
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";

const Register = () => {
    const { createUser, signUpWithGoogle, signUpWithGitHub } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const auth = getAuth();

    const onSubmit = async (data) => {
        const { email, password, name, photoURL, role } = data;

        try {
            // Password verification
            if (!/(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password)) {
                throw new Error("Password must contain at least 6 characters including at least one uppercase and one lowercase letter.");
            }

            // Check if user already exists in Firebase
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                throw new Error("The email address is already in use by another account.");
            }

            // Save user information to the database (excluding password)
            const payload = { email, name, photoURL, role };
            const response = await axios.post('https://b9-a12-serverrr.vercel.app/register', payload);

            if (response.data.success) {
                // User creation in Firebase
                await createUser(email, password, name, photoURL);
                toast.success("Registration successful! Redirecting to login page...");
                navigate("/login");
            } else {
                throw new Error("Failed to save user information to MongoDB.");
            }
        } catch (error) {
            if (error.message === 'The email address is already in use by another account.') {
                toast.error(error.message);
            } else {
                toast.error(error.message || "An error occurred during registration.");
            }
        }
    };

    const handleSocialSignUp = async (signUpMethod) => {
        try {
            const result = await signUpMethod();
            const user = result.user;
            const payload = {
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                role: 'tourist', // Set default role for social sign-up
            };

            // Check if user already exists in the database
            const { data } = await axios.get(`https://b9-a12-serverrr.vercel.app/users?email=${user.email}`);
            if (data.exists) {
                toast.info("User already exists. Redirecting to login page...");
                navigate("/login");
            } else {
                // Save user information to the database (excluding password)
                const response = await axios.post('https://b9-a12-serverrr.vercel.app/users', payload);
                if (response.data.success) {
                    toast.success("Registration successful! Redirecting to login page...");
                    navigate("/login");
                } else {
                    throw new Error("Failed to save user information to MongoDB.");
                }
            }
        } catch (error) {
            console.error("Error in social sign-up: ", error);
            toast.error("An error occurred during social sign-up.");
        }
    };

    return (
        <div className="w-full flex justify-center py-10 bg-white dark:bg-slate-900">
            <Helmet>
                <title>EpicEscapes | Register</title>
            </Helmet>
            <ToastContainer />
            <div className="w-full max-w-md p-4 rounded-md shadow sm:p-8 bg-gray-50 text-gray-800 border-2 border-[#FF6F61] dark:bg-black dark:text-white">
                <h2 className="mb-3 text-3xl font-semibold text-center">Create your account</h2>
                <p className="text-sm text-center dark:text-gray-600">Already have an account?
                    <Link to={`/login`} rel="noopener noreferrer" className="ml-2 underline text-[#FF6F61] font-bold">Sign in here</Link>
                </p>

                <div className="flex items-center w-full my-4">
                    <hr className="w-full dark:text-gray-600" />
                    <p className="px-3 dark:text-gray-600">OR</p>
                    <hr className="w-full dark:text-gray-600" />
                </div>

                <div className="my-6 space-y-4">
                    <button
                        aria-label="Sign Up with Google"
                        type="button"
                        onClick={() => handleSocialSignUp(signUpWithGoogle)}
                        className="flex items-center justify-center w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 ring-violet-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                        </svg>
                        <p>Sign Up with Google</p>
                    </button>
                    <button aria-label="Sign Up with GitHub" role="button" className="flex items-center justify-center w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 ring-violet-600" onClick={() => handleSocialSignUp(signUpWithGitHub)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                            <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
                        </svg>
                        <p>Sign Up with GitHub</p>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm">Name</label>
                            <input
                                type="text"
                                {...register("name", { required: true })}
                                id="name"
                                placeholder="John Doe"
                                className={`w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-sm text-red-500">Name is required</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm">Email address</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                id="email"
                                placeholder="leroy@jenkins.com"
                                className={`w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-sm text-red-500">Email is required</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="photoURL" className="block text-sm">Photo URL</label>
                            <input
                                type="text"
                                {...register("photoURL")}
                                id="photoURL"
                                placeholder="https://example.com/photo.jpg"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm">Password</label>
                            <input
                                type="password"
                                {...register("password", {
                                    required: true,
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                id="password"
                                placeholder="*****"
                                className={`w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:dark:border-violet-600 ${errors.password ? 'border-red-500' : ''}`}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        {/* Role selection */}
                        {/* <div className="space-y-2">
                            <label htmlFor="role" className="block text-sm">Select Role</label>
                            <select
                                {...register("role")} // Ensure this is correctly bound to the form control
                                id="role"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
                            >
                                <option value="tourist">Tourist</option>
                            </select>
                        </div> */}
                    </div>
                    <button type="submit" className="w-full px-8 py-3 font-semibold rounded-md bg-[#FF6F61] text-gray-50">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
