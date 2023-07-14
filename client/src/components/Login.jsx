import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const initialValues = { email: "", password: "" };

const API_BASE_URL = "http://localhost:3000";

export default function Login() {
  const [formValues, setFormValues] = useState(initialValues);
  const [formError, setFormError] = useState(initialValues);
  const [token, setToken] = useState("");

  const change = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validate = (values) => {
    const error = {};
    if (!values.email) {
      error.email = "E-Mail is required!";
    }
    if (!values.password) {
      error.password = "Password is required!";
    } else if (values.password.length < 8) {
      error.pl = "Password must be greater than 8 Characters";
    }
    return error;
  };

  const loginData = async (e) => {
    e.preventDefault();
    setFormError(validate(formValues));
    const { email, password } = formValues;
    console.log(validate(formValues));
    const isError = validate(formValues);

    if (Object.keys(isError).length == 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        console.log(res);

        if (res.ok) {
          const data = await res.json();
          const token = data.token;
          console.log(data);
          localStorage.setItem("token", token);
          localStorage.setItem("userId", data.userId);

          setToken(token);
          alert("Login successful");
          navigate("/files");
        } else if (res.status >= 400 && res.status < 500) {
          alert("Invalid email or password");
        } else if (res.status >= 500) {
          alert("Server error. Please try again later");
        } else {
          alert("Unknown error. Please try again later");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={loginData}
          >
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
                  className="block w-full mt-1 border-2 border-black rounded-md text-xl px-3 py-1 bg-white text-black "
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
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
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
            <div className="mt-2 ">
              <p className="text-blue-500">
                {" "}
                New User?{" "}
                <a onClick={() => navigate("/register")}> Registere here </a>
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-500 text-lg"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
