const fs = require('fs');
const ytdl = require("@distube/ytdl-core");

const proxy = 'http://127.0.0.1:7890';
const agent = ytdl.createProxyAgent({ uri: proxy });
const videoUrl = 'https://www.youtube.com/watch?v=aEOyEtArBI8'


const stream = ytdl(videoUrl, {
  requestOptions: { agent },
});

// console.log('Starting Download');
const writableStream = fs.createWriteStream('video.mp4');

stream.on('data', chunk => {
  writableStream.write(chunk); // 将 chunk 写入到文件
});

stream.on('error', err => {
  console.error(err);
});

stream.on('end', () => {
  writableStream.end(); // 关闭可写流
  // console.log('Finished');
});