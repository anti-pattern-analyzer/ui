import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash, faSpinner} from '@fortawesome/free-solid-svg-icons';
import nasa from "@/assets/nasa.jpg";
import { registerUser } from "@/services/auth.js";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const RegisterSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
        password: Yup.string()
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .required('Password is required'),
    });

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-dark-blue-500">
            <div className="sm:w-1/2 w-full flex justify-center items-center p-4">
                <img src={nasa} className="rounded-3xl max-w-full h-auto" alt="NASA"/>
            </div>
            <div className="sm:w-1/2 w-full flex flex-col justify-center items-center p-4 space-y-4">
                <h1 className="text-xl sm:text-2xl mb-4">Register</h1>
                <Formik
                    initialValues={{ name: '', email: '', password: '' }}
                    validationSchema={RegisterSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        try {
                            await registerUser(values.name, values.email, values.password);
                            navigate('/login');
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="bg-white p-4 rounded-lg w-full max-w-md">
                            <div className="grid gap-2">
                                <div className="grid gap-1">
                                    <label htmlFor="name" className="font-semibold">Name</label>
                                    <Field as={Input} id="name" name="name" type="text" />
                                    {errors.name && touched.name ? (<div className="text-red-500 text-xs">{errors.name}</div>) : null}
                                </div>
                                <div className="grid gap-1">
                                    <label htmlFor="email" className="font-semibold">Email</label>
                                    <Field as={Input} id="email" name="email" type="email" />
                                    {errors.email && touched.email ? (<div className="text-red-500 text-xs">{errors.email}</div>) : null}
                                </div>
                                <div className="relative grid gap-1">
                                    <label htmlFor="password" className="font-semibold">Password</label>
                                    <Field as={Input} id="password" name="password" type={showPassword ? "text" : "password"} />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-8"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                    {errors.password && touched.password ? (<div className="text-red-500 text-xs">{errors.password}</div>) : null}
                                </div>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2 h-4 w-4"/> : 'Register'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <p className="text-gray-500">Already have an account? <Link to="/login" className="underline">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
