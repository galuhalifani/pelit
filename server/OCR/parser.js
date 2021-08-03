// const tesseract = require('./tesseract')

// const dummy = `NGADIR0JO - WONOGIRI 02735327200
// JL. NGADIROJO KENTENG RT. 01, RW. 03, NGAD
// IR0JO KIDUL, WONOGIRI, 57681
// 19.07.20-21:17  2.1.65 1415345/IKE MA/O1
// KUSUKA KRP AYM LD 60 1 5000 5,000
// KUSUKA KRP KJ.BKR 60 3 5000 15,000
// KUSUKA RMPT LAUT 60 2 5000 10,000
// DK USAGI PUF CRML 60 6 6000 36,000
// PLASTIK BSR 1 1 1
// NISKON : (1%
// HARGA JUAL : 66,000
// YC KUSUKA 60G/CV ARIRA :  (9,000)
// TOTAL 57,000
// TUNAI : 57,000
// ANDA HEMAT : 9,000
// PPN : DPP= 60,000 PPN=_{;,000
// LAYANAN KONSUMEN SMS 0811 1500 280
// CALL 1500 280 - KONTAK@INDOMARET.CO.ID`

// const dummy2 = `NGADIR0JO - WONOGIRI 02735327200
// JL. NGADIROJO KENTENG RT. 01, RW. 03, NGAD
// IR0JO KIDUL, WONOGIRI, 57681
// 16 jan 2020 2.1.65 1415345/IKE MA/O1
// KUSUKA KRP AYM LD 60 1 5000 5,000
// KUSUKA KRP KJ.BKR 60 3 5000 15,000
// KUSUKA RMPT LAUT 60 2 5000 10,000
// DK USAGI PUF CRML 60 6 6000 36,000
// PLASTIK BSR 1 1 1
// NISKON : (1%
// HARGA JUAL : 66,000
// YC KUSUKA 60G/CV ARIRA :  (9,000)
// TOTAL 57,000
// TUNAI : 57,000
// ANDA HEMAT : 9,000
// PPN : DPP= 60,000 PPN=_{;,000
// LAYANAN KONSUMEN SMS 0811 1500 280
// CALL 1500 280 - KONTAK@INDOMARET.CO.ID`

// manual source
const detectedSource = [
  /indomaret/i,
  /alfamart/i,
  /transmart/i,
  /ikea/i,
  /lottemart/i,
  /mcdonald/i,
  /kfc/i,
  /wendy/i,
  /burger king/i,
  /breadtalk/i,
  /bread talk/i,
  /starbucks/i,
  /gramedia/i,
];

// *indomaret
// const url = 'https://pbs.twimg.com/media/EdS8xTIUEAAG-zn.jpg'
// *alfamart
// const url = 'https://i.imgur.com/ncYqNfe.png'
// *alfamart 2 #fail
// const url = 'https://cdn-2.tstatic.net/makassar/foto/bank/images/ua-alfa.jpg'
// *btdelivery (breadtalk)
// const url = 'https://passingthroughresearcher.files.wordpress.com/2019/06/img_20190511_084303.jpg?w=546&h=510&crop=1'
// *cafe
// const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/1200px-ReceiptSwiss.jpg'
// *transmart #lowQuality
// const url = 'https://4.bp.blogspot.com/-b3hc5E4A7Yk/WHjxOheQxLI/AAAAAAAAATw/i7CR0k5BpzMPjNvf5YJpID3HzAPM31ARQCLcB/s1600/20170108_192114.jpg'
// *carrefour #crumpled
// const url = 'https://s.kaskus.id/r540x540/images/2016/01/30/232510_20160130102928.jpg'
// *farmer's market california
// const url = 'https://www.bridgeandtunnelclub.com/bigmap/queens/astoria/21-6131ststreet/californiafarmersmarket/receipt_2012_05_26.jpg'
// *IKEA indonesia #1 fail
// const url = 'https://media-cdn.tripadvisor.com/media/photo-s/08/ac/5f/08/ikea-alam-sutera.jpg'
// *IKEA indonesia #2 crumpled
// const url = 'https://1.bp.blogspot.com/-VwohzHQtNtU/WuVj3ybuXGI/AAAAAAAAVJE/h07LhpQ_KBA5W3QiFoCkWdmUVNkHU42xQCK4BGAYYCw/s1600/IMG_20180429_131801.jpg'
// *IKEA indonesia #3 unread
// const url = 'https://1.bp.blogspot.com/-sR59g_ITvYQ/WVOnq_CtG-I/AAAAAAAA8aM/r9ekh4gtIEgOhykG5QO32TXNuZ8iyJ5wQCLcBGAs/s1600/IMG_7221.jpg'
// *IKEA indonesia #4 fail
// const url = 'https://media-cdn.tripadvisor.com/media/photo-s/08/ac/5f/08/ikea-alam-sutera.jpg'

// ! parser function
const main = (data) => {
  // tesseract(url)
  // .then(data => {
  // !versi split
  if (!data) return { message: `Sorry we can't read your receipt` };

  // ?Title
  let title;
  detectedSource.forEach((ele) => {
    if (data.search(ele) >= 0) {
      let foundWord = ele.source;
      foundWord = foundWord.charAt(0).toUpperCase() + foundWord.slice(1);
      // console.log(typeof ele)
      return (title = `Purchasing items at ${foundWord}`);
    }
  });

  // ?Date
  let fullDate;

  // *dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy or dd mm yyyy
  const reg =
    /(?:(?:31(\/|-|\.|\s)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.|\s)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})|(?:29(\/|-|\.|\s)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))|(?:0?[1-9]|1\d|2[0-8])(\/|-|\.|\s)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/g;

  // *dd-mmm-YYYY, dd/mmm/YYYY, dd.mmm.YYYY or dd mmm YYYY
  const reg2 =
    /(?:(?:31(\/|-|\.|\s)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.|\s)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})|(?:29(\/|-|\.|\s)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))|(?:0?[1-9]|1\d|2[0-8])(\/|-|\.|\s)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/gi;

  // *dd-mm-yy, dd-mm-yy, dd-mm-yy, dd-mm-yy, or dd mm yy
  const reg3 = /[0-3][0-9][\.][0-3][0-9][\.][0-9][0-9]/g;
  // const reg3 = /[0-3][0-9][\/|-|\.|\s][0-3][0-9][\/|-|\.|\s][0-9][0-9]/g

  if (data.match(reg)) {
    let foundMatch = data.match(reg)[0];
    foundMatch = foundMatch.split(/\/|\.|\s/g);
    fullDate = new Date(foundMatch[2], foundMatch[1] - 1, foundMatch[0]);
  } else if (data.match(reg2)) {
    const toNumeric = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    let foundMatch = data.match(reg2)[0];
    foundMatch = foundMatch.split(/\/|\.|\s/g);
    // console.log(foundMatch)
    fullDate = new Date(
      foundMatch[2],
      toNumeric.indexOf(foundMatch[1].toLowerCase()),
      foundMatch[0]
    );
  } else if (data.match(reg3)) {
    let foundMatch = data.match(reg3)[0];
    foundMatch = foundMatch.split(/\/|\.|\s/g);
    fullDate = new Date(
      Number("20" + foundMatch[2]),
      foundMatch[1] - 1,
      foundMatch[0]
    );
  }

  // ?Total
  const totalPriceArr = data.split("\n");
  let totalPriceStr = totalPriceArr.filter(
    (ele) => ele.search(/total/i) >= 0
  )[0];
  totalPriceStr = totalPriceStr.split(" ")[totalPriceStr.split(" ").length - 1];
  const totalPriceNumber = Number(Math.abs(totalPriceStr.replace(",", "")));
  // console.log(totalPriceObj)

  console.log({
    title,
    total: totalPriceNumber,
    fullDate,
  });
  return {
    title,
    total: totalPriceNumber,
    fullDate,
  };

  // })
  // .catch(err => console.error(err))
};

// console.log(main('https://4.bp.blogspot.com/-b3hc5E4A7Yk/WHjxOheQxLI/AAAAAAAAATw/i7CR0k5BpzMPjNvf5YJpID3HzAPM31ARQCLcB/s1600/20170108_192114.jpg'))

module.exports = main;
