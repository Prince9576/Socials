import axios from "axios";

module.exports = async (media) => {
  try {
    const formdata = new FormData();
    formdata.append("file", media);
    formdata.append("upload_preset", "socials");
    formdata.append("cloud_name", "dipimoaed");
    const result = await axios.post(process.env.CLOUDINARY_URL, formdata);
    return result.data.url;
  } catch (err) {
    return;
  }
};
