// generate-icons.js
import sharp from "sharp";
import fs from "fs";

const sizes = [192, 256, 384, 512];
const inputFile = "public/icons/ico_app_icon.png";
const outputDir = "public"; // 출력 폴더

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

(async () => {
  for (const size of sizes) {
    const outputFile = `${outputDir}/pwa-${size}x${size}.png`;
    await sharp(inputFile)
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outputFile);
    console.log(`✅ Generated: ${outputFile}`);
  }

  console.log("🎉 All icons generated successfully!");
})();
