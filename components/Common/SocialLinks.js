import { Fragment } from "react";
import { Form, Button, Message, TextArea, Divider } from "semantic-ui-react";

const SocialLinks = ({
  user: { bio, instagram, facebook, youtube, twitter },
  inputChangeHandler,
  socialLinks,
  setSocialLinks,
}) => {
  return (
    <Fragment>
      <Form.Field
        control={TextArea}
        name="bio"
        error={!bio}
        value={bio}
        placeholder="Bio"
        label="Bio"
        onChange={inputChangeHandler}
      />
      <Divider />
      <Button
        icon="at"
        content="Add Social Profiles"
        color="red"
        type="button"
        size="small"
        onClick={() => {
          console.log("Social links", socialLinks);
          setSocialLinks(!socialLinks);
        }}
      />
      <Divider hidden />
      {socialLinks && (
        <div>
          <Form.Input
            name="instagram"
            value={instagram}
            placeholder="Instagram"
            icon="instagram"
            iconPosition="left"
            onChange={inputChangeHandler}
          />
          <Form.Input
            name="facebook"
            value={facebook}
            placeholder="Facebook"
            icon="facebook"
            iconPosition="left"
            onChange={inputChangeHandler}
          />
          <Form.Input
            name="youtube"
            value={youtube}
            placeholder="Youtube"
            icon="youtube"
            iconPosition="left"
            onChange={inputChangeHandler}
          />
          <Form.Input
            name="twitter"
            value={twitter}
            placeholder="Twitter"
            icon="twitter"
            iconPosition="left"
            onChange={inputChangeHandler}
          />
          <Message
            info
            size="small"
            icon="attention"
            header="Social Media Profiles are optional !"
          />
        </div>
      )}
    </Fragment>
  );
};

export default SocialLinks;
