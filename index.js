const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseUrl =
  "https://calypso.tortuga.wtf/content/stream/serials/presumed.innocent.s01e06.rezka.mvo_100105/hls/1080/";
const outputFilePath = path.join(__dirname, "output.ts");

async function downloadSegment(segmentNumber) {
  const segmentUrl = `${baseUrl}segment${segmentNumber}.ts`;
  try {
    const response = await axios.get(segmentUrl, {
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    } else {
      throw error;
    }
  }
}

async function downloadVideo() {
  const writeStream = fs.createWriteStream(outputFilePath);

  let segmentNumber = 1;
  while (true) {
    const segmentData = await downloadSegment(segmentNumber);
    if (segmentData === null) {
      break;
    }
    writeStream.write(segmentData);
    console.log(`Downloaded segment ${segmentNumber}`);
    segmentNumber++;
  }

  writeStream.end(() => {
    console.log("Video download completed");
  });
}

downloadVideo().catch((err) => {
  console.error("Error downloading video:", err);
});
