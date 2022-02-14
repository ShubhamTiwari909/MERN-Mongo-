import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FiDelete } from "react-icons/fi";

const App = () => {
  const [list, setList] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayUpdateForm, setDisplayUpdateForm] = useState(false);
  const [updateTask, setUpdateTask] = useState("");
  const [updateId, setUpdateId] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleUpdate = (e) => {
    setUpdateTask(e.target.value);
  };

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(6, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    password: Yup.string()
      .min(10, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/")
      .then((result) => {
        setList(result.data);
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {};
  }, []);

  //add task
  let sendData = (e) => {
    axios
      .post("http://localhost:3001/post", {
        email: email,
        username: username,
        password: password,
      })
      .then((res) => console.log("submited"))
      .catch((err) => console.log(err.data));
    setEmail("");
    setUsername("");
    setPassword("");
    e.preventDefault();
    window.location.reload();
  };

  //delete task
  const deleteTask = (taskid) => {
    console.log(taskid);
    axios
      .delete(`http://localhost:3001/delete/${taskid}`)
      .then((response) => {
        console.log("Delete Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    window.location.href += "http://localhost:3000/";
    window.location.reload();
  };

  const setUpdateForm = (id) => {
    let filtered = list.filter(function (item) {
      return item._id === id;
    });
    setUpdateId(filtered[0]._id);
  };
  const updateList = () => {
    axios
      .put("http://localhost:3001/update", {
        updateId: updateId,
        task: updateTask,
      })
      .then((response) => {
        console.log("Updated Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    window.location.href += "http://localhost:3000/";
    window.location.reload();
  };
  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
          username: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={(e) => {}}
      >
        {({ errors, touched }) => (
          <Form className="grid grid-cols-4 gap-3 place-items-center my-5 mx-20">
            <div className="">
              <label htmlFor="">Email</label>
              <Field
                name="email"
                type="email"
                className="ring-2 ring-indigo-300 px-4 py-2 mx-10 rounded-md focus:outline-none focus:scale-110 transition-all duration-700 ease-in-out addForm"
                value={email}
                onChange={handleEmail}
              />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
            </div>

            <div className="">
              <label htmlFor="">Username</label>
              <Field
                name="username"
                type="text"
                className="ring-2 ring-indigo-300 px-4 py-2 mx-10 rounded-md focus:outline-none focus:scale-110 transition-all duration-700 ease-in-out addForm"
                value={username}
                onChange={handleUsername}
              />
              {errors.username && touched.username ? (
                <div>{errors.username}</div>
              ) : null}
            </div>

            <div className="">
              <label htmlFor="">Password</label>
              <Field
                type="password"
                name="password"
                className="ring-2 ring-indigo-300 px-4 py-2 mx-10 rounded-md focus:outline-none focus:scale-110 transition-all duration-700 ease-in-out addForm"
                value={password}
                onChange={handlePassword}
              />
              {errors.password && touched.password ? (
                <div>{errors.password}</div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 place-items-center">
              <button
                className="bg-gradient-to-r from-red-500 via-red-700 to-red-800 text-slate-200 rounded-md px-6 py-3
            my-5"
                type="submit"
                name="submit"
                onClick={sendData}
              >
                ADD
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mx-20">
        {list.map((item) => {
          return (
            <div key={item._id} className="flex justify-between bg-slate-800 p-4 my-5 ring-4 ring-indigo-300 rounded-md text-white">
              <div className="flex flex-col">
                <h1>Email - {item.email}</h1>
                <h1>Username - {item.username}</h1>
                <h1>Password - {item.password}</h1>
              </div>
              <div className="flex justify-between space-x-5">
                <button className="p-1" onClick={() => deleteTask(item._id)}>
                  <FiDelete size="1.4rem" color="crimson" />
                </button>
                <button
                  onClick={() => {
                    setUpdateForm(item._id);
                    setDisplayUpdateForm(!displayUpdateForm);
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className=""
        style={{ display: displayUpdateForm ? "block" : "none" }}
      >
        <form
          onSubmit={updateList}
          className="flex lg:flex-row md:flex-row my-10 sm:flex-col sm:mx-40 UpdateForm"
        >
          <input
            className="p-2 ring-2 ring-indigo-800 rounded-md  focus:outline-none"
            type="text"
            name="name"
            placeholder="task..."
            value={updateTask}
            onChange={handleUpdate}
          />
          <button
            className="bg-gradient-to-r from-indigo-500 via-indigo-700 to-indigo-900 text-slate-200 rounded-md px-6 py-3
                  lg:mx-10 lg:m-0 md:m-5 sm:m-10 "
            type="submit"
            name="submit"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
