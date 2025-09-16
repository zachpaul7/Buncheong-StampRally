// generate-screenshots.js
import sharp from "sharp";
import fs from "fs";

const outputDir = "public"; // PWA에서 참조할 경로
const inputFile = "screenshot.png"; // 원본 큰 스크린샷 (루트에 두면 편함)

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

(async () => {
  // 모바일 사이즈 (412x915)
  await sharp(inputFile)
    .resize(412, 915, { fit: "cover" })
    .png()
    .toFile(`${outputDir}/screenshot-mobile.png`);
  console.log("✅ Generated: screenshot-mobile.png (412x915)");

  // 데스크탑 사이즈 (1280x720)
  await sharp(inputFile)
    .resize(1280, 720, { fit: "cover" })
    .png()
    .toFile(`${outputDir}/screenshot-desktop.png`);
  console.log("✅ Generated: screenshot-desktop.png (1280x720)");

  console.log("🎉 Screenshots generated successfully!");
})();
