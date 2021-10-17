const newMsgSound = async () => {
  try {
    const sound = new Audio("/light.mp3");
    sound && (await sound.play());
  } catch (error) {
    console.error(error);
    alert("New Message");
  }
};

export default newMsgSound;
