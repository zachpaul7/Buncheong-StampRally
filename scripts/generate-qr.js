// generate-qr.js
import QRCode from "qrcode";
import fs from "fs";

const ids = [1, 2, 3, 4, 5, 6, 7]; // 게임 아이디 목록

ids.forEach(async (id) => {
  const url = `game/${id}`;
  const path = `./qr-game-${id}.png`;
  await QRCode.toFile(path, url, {
    width: 500,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
  console.log(`QR 저장 완료: ${path}`);
});
