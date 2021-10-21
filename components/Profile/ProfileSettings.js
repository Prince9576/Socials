import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Form,
  List,
  Message,
} from "semantic-ui-react";
import { toggleMessagePopup, updatePassword } from "../../utils/profileActions";

const ProfileSettings = ({ newMessagePopup, mobile }) => {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showMessagePopupSettings, setShowMessagePopupSettings] =
    useState(false);
  const [popupSetting, setPopupSetting] = useState(newMessagePopup);

  useEffect(() => {
    success && setTimeout(() => setSuccess(false), 3000);
  }, [success]);

  return (
    <>
      {success && (
        <Message success header="Updated Successfully" icon="check circle" />
      )}
      <Divider hidden />
      <List size="big" animated={!mobile}>
        <List.Item>
          <List.Icon name="user secret" size="large" verticalAlign="middle" />
          <List.Content verticalAlign="middle">
            <List.Header
              style={{ fontFamily: "Raleway" }}
              as="a"
              content="Update Password"
              onClick={() => setShowUpdatePassword((prev) => !prev)}
            />
          </List.Content>
          {showUpdatePassword && (
            <UpdatePassword
              setShowUpdatePassword={setShowUpdatePassword}
              setSuccess={setSuccess}
              mobile={mobile}
            />
          )}
        </List.Item>
        <Divider />
        <List.Item>
          <List.Icon
            name="paper plane outline"
            size="large"
            verticalAlign="middle"
          />
          <List.Content verticalAlign="middle">
            <List.Header
              as="a"
              content="Show New Message Popup?"
              onClick={() => setShowMessagePopupSettings((prev) => !prev)}
            />
          </List.Content>

          {showMessagePopupSettings && (
            <div
              style={{
                margin: "2rem 0",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.1rem",
              }}
            >
              <span style={{ flex: "0 0 70%" }}>
                Control when a popup should appear when there is a new Message?
              </span>
              <Checkbox
                color="primary"
                toggle
                checked={popupSetting}
                onChange={() => {
                  toggleMessagePopup({
                    setPopupSetting,
                    setSuccess,
                    popupSetting,
                  });
                }}
              />
            </div>
          )}
        </List.Item>
      </List>
    </>
  );
};

const UpdatePassword = ({ setSuccess, setShowUpdatePassword, mobile }) => {
  const [userPasswords, setUserPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [showTypedPasswords, setShowTypedPasswords] = useState({
    field1: false,
    field2: false,
  });

  const { currentPassword, newPassword } = userPasswords;
  const { field1, field2 } = showTypedPasswords;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserPasswords((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  return (
    <>
      <Form
        style={{ marginTop: "2rem" }}
        error={errorMsg !== null}
        loading={loading}
        onSubmit={async (e) => {
          e.preventDefault();
          await updatePassword({
            setSuccess,
            userPasswords,
            setErrorMsg,
            setShowUpdatePassword,
          });

          setUserPasswords({ currentPassword: "", newPassword: "" });
        }}
      >
        <Form.Input
          fluid
          icon={{
            name: "eye",
            circular: true,
            link: true,
            onClick: () => {
              setShowTypedPasswords((prev) => ({ ...prev, field1: !field1 }));
            },
          }}
          type={field1 ? "text" : "password"}
          iconPosition="left"
          label="Current Password"
          placeholder="Enter Current Password"
          name="currentPassword"
          onChange={handleChange}
          value={currentPassword}
        ></Form.Input>

        <Form.Input
          fluid
          icon={{
            name: "eye",
            circular: true,
            link: true,
            onClick: () => {
              setShowTypedPasswords((prev) => ({ ...prev, field2: !field2 }));
            },
          }}
          type={field1 ? "text" : "password"}
          iconPosition="left"
          label="New Password"
          placeholder="Enter New Password"
          name="newPassword"
          onChange={handleChange}
          value={newPassword}
        ></Form.Input>

        <Divider hidden />
        <ButtonGroup widths={2} style={{ maxWidth: mobile ? "100%" : "40%" }}>
          <Button
            disabled={loading || currentPassword === "" || newPassword === ""}
            compact
            icon="configure"
            type="submit"
            color="blue"
            content="Confirm"
          />
          <Button
            disabled={loading}
            compact
            icon="cancel"
            content="Cancel"
            onClick={() => setShowUpdatePassword(false)}
          />
        </ButtonGroup>
        <Message icon="meh" content={errorMsg} header="Oops!" error />
      </Form>
      <Divider hidden />
    </>
  );
};

export default ProfileSettings;
