const BOT_NAME = "WABOT";
const prefix = "#";
const errors = {
  bot_admin_error: "*Bot need Admin privilege*",
  sender_admin_error: "*You are not an Admin*",
  sticker_creation_error: "*Unknown error while creating sticker*",
  sticker_invalid_input: "*Please provide an Image/Gif/video*",
};

const IMAGE_PATH = "./media/image/";
const VIDEO_PATH = "./media/video/";
const STICKER_PATH = "./media/sticker/";

export {BOT_NAME, IMAGE_PATH, VIDEO_PATH, STICKER_PATH, prefix, errors};
