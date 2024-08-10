import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { loginUser } from "@/services/auth.js";
import { Button } from "@/components/ui/Button";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
            const token = await loginUser(values.email, values.password);
            localStorage.setItem('token', token);
            navigate('/');
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-dark-blue-500">
            <div className="sm:w-1/2 w-full flex justify-center items-center p-4">
                <p>Some image</p>
            </div>
            <div className="sm:w-1/2 w-full flex flex-col justify-center items-center p-4 space-y-4">
                <h1 className="text-xl sm:text-2xl mb-4">Login</h1>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="bg-white p-4 rounded-lg w-full max-w-md">
                            <div className="grid gap-2">
                                <div className="grid gap-1">
                                    <label htmlFor="email" className="font-semibold">Email</label>
                                    <Field
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className={`w-full p-2 ${errors.email && touched.email ? 'border border-red-500' : 'border border-gray-300'}`}
                                    />
                                    {errors.email && touched.email ? (
                                        <div className="text-red-500 text-sm">{errors.email}</div>
                                    ) : null}
                                </div>
                                <div className="relative grid gap-1">
                                    <label htmlFor="password" className="font-semibold">Password</label>
                                    <Field
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className={`w-full p-2 ${errors.password && touched.password ? 'border border-red-500' : 'border border-gray-300'}`}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-8">
                                        <button
                                            type="button"
                                            className="text-gray-600 hover:text-black"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {errors.password && touched.password ? (
                                        <div className="text-red-500 text-sm">{errors.password}</div>
                                    ) : null}
                                </div>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2"/>
                                    ) : 'Login'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <p className="text-gray-500">Don’t have an account? <Link to="/register" className="underline">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;
