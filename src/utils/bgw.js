import axios from "axios";

class BibleGatewayAPI {

  async search(query = "John 3:16", version = "ESV") {
    let encodedSearch = encodeURIComponent(query);
    let encodedVersion = encodeURIComponent(version);

    const url = `https://www.biblegateway.com/passage?search=${encodedSearch}&version=${encodedVersion}`;

    const result = await axios.get(url);
    var html = result.data;

    var verse = ""
    var content = "Unable to find verse"
    
    const regex = /<meta property=\"og:description\" content=(.*)\/>/
    //const regex = /<meta property/
    var match = html.match(regex)
    console.log(match)
    if ( match != null && match.length > 0 ) {
      content = decodeHtmlEntity(match[1])
      //content = match[1]
    }

    return Promise.resolve({verse: query, content: content});
  }
}


var decodeHtmlEntity = function(str) {
  str = str.replace(/&amp;/, "&")
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

export { BibleGatewayAPI };
export default BibleGatewayAPI;
