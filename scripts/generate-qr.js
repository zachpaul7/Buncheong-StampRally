// generate-qr.js
import QRCode from "qrcode";
import fs from "fs";

const ids = [1, 2, 3, 4, 5, 6, 7];
const rootUrl = "https://buncheong-bucket.kr.object.ncloudstorage.com";

async function generate() {
  // ✅ 루트 QR (그냥 index.html만)
  const rootTarget = `${rootUrl}/index.html`;
  await QRCode.toFile("./qr-root.png", rootTarget, {
    width: 500,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });
  console.log(`QR 저장 완료: ./qr-root.png (${rootTarget})`);

  // ✅ 게임 QR → index.html?to=/game/{id}
  for (const id of ids) {
    const target = `${rootUrl}/index.html?to=/game/${id}`;
    const path = `./qr-game-${id}.png`;

    await QRCode.toFile(path, target, {
      width: 500,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    console.log(`QR 저장 완료: ${path} (${target})`);
  }
}

generate().catch((err) => {
  console.error("QR 생성 중 오류:", err);
});
