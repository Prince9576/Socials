import {
  HeaderMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";
import {
  Form,
  Button,
  Message,
  Textarea,
  Segment,
  Divider,
} from "semantic-ui-react";
import { useState } from "react";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    instagram: "",
    facebook: "",
    youtube: "",
    twitter: "",
  });
  const { name, email, password, bio } = user;

  const [socialLinks, setSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
    console.log(event);
  };
  const handleFormSubmit = (event) => event.preventDefault();
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
            name="name"
            value={name}
            label="Name"
            icon="user"
            iconPosition="left"
            placeholder="Name"
            onChange={inputChangeHandler}
          />
          <Form.Input
            required
            fluid
            name="email"
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
          <Form.Input
            required
            fluid
            loading={usernameLoading}
            error={!usernameAvailable}
            name="username"
            value={username}
            label="Username"
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
            placeholder="Username"
            onChange={(e) => {
              const v = e.target.value;
              setUsername(v);
              if (regexUserName.test(v)) {
                setUsernameAvailable(true);
              } else {
                setUsernameAvailable(false);
              }
            }}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </div>
  );
};

export default Signup;
