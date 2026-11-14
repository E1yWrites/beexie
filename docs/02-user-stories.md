# 02: User Stories & Acceptance Criteria

- **US-01 Instant Proof on Arrival:** A first-time visitor drags the vermilion compare rule across `/specimen.jpg`, switches `16x16` / `32x32` / `48x48` / `96x96` presets, toggles Floyd-Steinberg dithering, and sees live Median-Cut swatches update without leaving the page.
- **US-02 Direct Drop & Paste:** Dropping PNG/JPG/WEBP onto the Landing hero, Studio bench, or pressing `Ctrl/Cmd + V` decodes the image in local memory and opens the Studio directly.
- **US-03 Slim 01-04 Stage Navigation:** Inside the Studio, clicking `01 Intake`, `02 Grid`, `03 Color`, or `04 Finish` on the `64px` edge rail updates the right inspector while keeping the central proof frame unobstructed.
- **US-04 Dual-Theme Comfort:** Toggling between Light Cotton Ivory and Dark Pressroom Charcoal switches UI tokens, checkerboard contrast, and the `BackgroundPaths` ink / Spotlight glow tokens seamlessly while keeping >= 4.5:1 text contrast.
- **US-05 Exact Dispatch Export:** Selecting PNG/JPG/WEBP, scale (`1x-8x`), and transparent or solid fill updates `Output` telemetry live and downloads the exact processed pixel bitmap.
