function getImageSize(inputFile) {
  return new Promise((resolve, reject) => {
    // Create a new FileReader object
    const reader = new FileReader();

    // When the reader has loaded the file
    reader.onload = function (event) {
      // Create a new Image object
      const img = new Image();

      // When the image has loaded
      img.onload = function () {
        // Get the width and height of the image
        const { width, height } = img;

        // Resolve the promise with the width and height
        resolve({ width, height });
      };

      // Set the source of the image to the file's data URL
      img.src = event.target.result;
    };

    // If there is an error while reading the file
    reader.onerror = function () {
      reject(new Error("Error reading file"));
    };

    // Read the file as a data URL
    reader.readAsDataURL(inputFile);
  });
}

const imageSizeOk = async (inputSelector, maxWidth, maxHeight) => {
  let input = document.querySelector(inputSelector);
  if (input && input.files[0]) {
    let size = await getImageSize(input.files[0]);
    return size.width <= maxWidth && size.height <= maxHeight;
  } else return true;
};
const imageSizeOkSquareSmall = async inputSelector => await imageSizeOk(inputSelector, 600, 600);
const imageSizeOkRectangularSmall = async inputSelector => await imageSizeOk(inputSelector, 600, 400);
const imageSizeOkRectangularVerySmall = async inputSelector => await imageSizeOk(inputSelector, 400, 300);

function getFileSizeInMB(file) {
  var fileSizeInBytes = file.size;
  var megabytes = Math.round(fileSizeInBytes / 1024 / 1024);
  return megabytes;
}

function getFileSize(file) {
  var fileSizeInBytes = file.size;
  var megabytes = (fileSizeInBytes / 1024 / 1024).toFixed(2);
  return megabytes;
}

function detectFileType(filePath) {
  const ext = filePath.toLowerCase().split(".").pop();
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(ext)) {
    return "image";
  } else if (["mp4", "avi", "mov", "wmv", "flv", "mkv"].includes(ext)) {
    return "video";
  } else if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext)) {
    return "audio";
  } else {
    return "unknown";
  }
}

// check file size
const fileSizeOk = () => {
  let fileKey = fileTypesSelect ? fileTypesSelect.value : libraryFileType;
  // get file type from types list
  let foundFileType = fileTypes.find(file => file.key === fileKey);
  let file = document.querySelector(".libraryFileInput").files[0];
  // get file size in MB
  let size = file ? getFileSize(file) : undefined;
  return size < foundFileType.size;
};

// check image width and height
const imgSizeOk = async () => {
  let fileKey = fileTypesSelect ? fileTypesSelect.value : libraryFileType;
  // get file type from types list
  let foundFileType = fileTypes.find(file => file.key === fileKey);
  if (!foundFileType) return false;
  // make sure type is only image
  if (foundFileType.fileType !== "image") return true;

  let file = document.querySelector(".libraryFileInput").files[0];
  let size = file ? await getImageSize(file) : undefined;
  return (
    size.width >= foundFileType.imgSize.width.min &&
    size.width <= foundFileType.imgSize.width.max &&
    size.height >= foundFileType.imgSize.height.min &&
    size.height <= foundFileType.imgSize.height.max
  );
};
