import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const initialValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const API_BASE_URL = "http://localhost:3000";

export default function Register() {
  const [formValues, setFormValues] = useState(initialValues);
  const [formError, setFormError] = useState(initialValues);

  const navigate = useNavigate();

  const change = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validate = (values) => {
    const error = {};

    if (!values.name) {
      error.name = "Name is required!";
    }
    if (!values.email) {
      error.email = "E-Mail is required!";
    }
    if (!values.password) {
      error.password = "Password is required!";
    } else if (values.password.length < 8) {
      error.pl = "Password must be greater than 8 Characters";
    }

    if (!values.confirm_password) {
      error.confirm_password = "Confirm Password is required!";
    }
    if (values.password !== values.confirm_password) {
      error.incorrect = "Both Password must be Same";
    }
    return error;
  };

  const postData = async (e) => {
    e.preventDefault();
    setFormError(validate(formValues));
    const { name, email, password } = formValues;
    const isError = validate(formValues);
    console.log(validate(formValues), isError);
    if (Object.keys(isError).length === 0) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });
        const data = await response.json();
        console.log(data);
        if (!data) {
          window.alert("Invalid Registration");
          console.log("Invalid Registration");
        } else if (
          data.status === 409 ||
          data.message === "Email already exists"
        ) {
          window.alert("Email already exists, try another email");
          console.log("Email already exists");
        } else {
          window.alert("Registration Successfull");
          console.log("Registration Successfull");
          console.log(formValues);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        window.alert("Error occurred during registration.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            New User, Register here
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={postData}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  className="block w-full mt-1 border-2 border-black rounded-md text-xl px-3 py-1
          bg-white text-black"
                  onChange={change}
                />
                <p className="text-red-500"> {formError.name} </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full mt-1 border-2 border-black rounded-md text-xl px-3 py-1
          bg-white text-black"
                  onChange={change}
                />
                <p className="text-red-500">{formError.email}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full mt-1 border-2 border-black rounded-md text-xl px-3 py-1
          bg-white text-black"
                  onChange={change}
                />
                <p className="text-red-500">{formError.password}</p>
                <p className="text-red-500">{formError.pl}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="current-confirm_password"
                  required
                  className="block w-full mt-1 border-2 border-black rounded-md text-xl px-3 py-1
          bg-white text-black"
                  onChange={change}
                />
                <p className="text-red-500">{formError.confirm_password}</p>
                <p className="text-red-500">{formError.incorrect}</p>
              </div>
            </div>

            <p className="text-blue-500">
              {" "}
              Already Registered?{" "}
              <a onClick={() => navigate("/")}> Login here </a>
            </p>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-500 text-lg"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
