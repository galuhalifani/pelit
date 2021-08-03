const dataParse = require("./parser");
const tesseract = require("./tesseract");

module.exports = async (receiptImageUrl) => {
  try {
    const data = await tesseract(receiptImageUrl);
    // if (!data) return console.log(`Sorry we can't read your receipt`);
    return dataParse(data);
  } catch (error) {
    // console.error(error)
  }
};
