// src/utils/preloadImages.js

const imageList = [
  // icons
  "/icons/btn_back.webp",
  "/icons/btn_hex_green.webp",
  "/icons/btn_rectangle_pressed_blue.webp",
  "/icons/btn_ticket.webp",
  "/icons/Camera - Blue.webp",
  "/icons/diff_true.webp",
  "/icons/diff_false.webp",
  "/icons/ico_app_icon.webp",
  "/icons/ico_bottle_white.webp",
  "/icons/ico_bottle.webp",
  "/icons/ico_firedoom.webp",
  "/icons/ico_map_black.webp",
  "/icons/ico_map.webp",
  "/icons/ico_sand.webp",
  "/icons/icon_big_checkmark.webp",
  "/icons/icon_big_lock.webp",
  "/icons/log.webp",

  // panels
  "/panels/btn_rectangle_silver.webp",
  "/panels/head_ribbon_shade_blue.webp",
  "/panels/panel_altem.webp",
  "/panels/Panel_BackGround_Blue.webp",
  "/panels/panel_frame_night.webp",
  "/panels/progress_bar_framedark.webp",
];

export function preloadImages() {
  return Promise.all(
    imageList.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;

          img.onload = async () => {
            try {
              await img.decode(); // ✅ 디코딩까지 끝내서 표시 지연 방지
            } catch {
              // decode 실패해도 로딩은 성공 처리
            }
            resolve();
          };

          img.onerror = () => resolve();
        })
    )
  );
}
