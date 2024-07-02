const fileTypes = [
  {
    name: "صورة",
    fileType: "image",
    key: "image",
    accpet: "image/jpeg, image/png",
    size: 1,
    imgSize: { width: { min: 0, max: 1000 }, height: { min: 0, max: 1000 } }
  },
  {
    name: "صورة خلفية",
    fileType: "image",
    key: "background_image",
    accpet: "image/jpeg, image/png",
    size: 1,
    imgSize: { width: { min: 0, max: 1000 }, height: { min: 0, max: 800 } }
  },
  {
    name: "صورة متحركة GIF",
    fileType: "image",
    key: "gif",
    accpet: "image/gif",
    size: 1,
    imgSize: { width: { min: 0, max: 1000 }, height: { min: 0, max: 1000 } }
  },
  {
    name: "مؤثر صوتى",
    fileType: "audio",
    key: "sound_effect",
    accpet: "audio/mp3, audio/wav",
    size: 1
  },
  {
    name: "موسيقى",
    fileType: "audio",
    key: "music",
    accpet: "audio/mp3, audio/wav",
    size: 3
  },
  {
    name: "فيديو",
    fileType: "video",
    key: "video",
    accpet: "video/mp4, video/mpg",
    size: 5
  },
  {
    name: "فيديو مقدمة",
    fileType: "video",
    key: "intro_video",
    accpet: "video/mp4, video/mpg",
    size: 3
  },
  {
    name: "فيديو قصير",
    fileType: "video",
    key: "small_video",
    accpet: "video/mp4, video/mpg",
    size: 1
  }
];
