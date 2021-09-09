import { useState, useEffect } from "react";
import {
  HeaderMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import { loginUser } from "../utils/authUser";
import cookie from "js-cookie";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { email, password } = user;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    const isValid = Object.values({ email, password }).every((value, index) => {
      if (index === 0 && !value.includes("@")) {
        return false;
      } else {
        return value;
      }
    });
    isValid ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  useEffect(() => {
    document.title = "Welcome Back";
    const userEmail = cookie.get("userEmail");
    if (userEmail) setUser((prevState) => ({ ...prevState, email: userEmail }));
  }, []);

  const inputChangeHandler = (event) => {
    console.log("Added event form", event.target);
    const { name, value } = event.target;
    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    await loginUser(user, setErrorMsg, setFormLoading);
  };

  return (
    <div className="wrapper">
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleFormSubmit}
      >
        <Message
          error
          header="Oops"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
        <Segment>
          <Form.Input
            required
            fluid
            name="email"
            error={!email || !email.includes("@")}
            value={email}
            label="Email"
            icon="envelope"
            iconPosition="left"
            placeholder="Email"
            type="email"
            onChange={inputChangeHandler}
          />
          <Form.Input
            required
            fluid
            name="password"
            value={password}
            label="Password"
            error={!password}
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            onChange={inputChangeHandler}
          />
          <Divider hidden />
          <Button
            fluid
            color="green"
            type="submit"
            content="Login"
            size="large"
            disabled={submitDisabled}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </div>
  );
};

export default Login;
