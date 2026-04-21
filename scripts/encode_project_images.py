"""Resize each project source image to exactly 800x384 (center-crop to aspect)
then emit AVIF + WebP siblings into src/assets/projects/.

Run:  python3 scripts/encode_project_images.py
"""
import os
import subprocess
import tempfile
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC_DIR = os.path.join(ROOT, "src", "assets")
OUT_DIR = os.path.join(ROOT, "src", "assets", "projects")
os.makedirs(OUT_DIR, exist_ok=True)

TARGET_W, TARGET_H = 800, 384
TARGET_RATIO = TARGET_W / TARGET_H

# (source relative to src/assets, out basename)
JOBS = [
    ("ChatImage.png", "translalia"),
    ("coursesearchAI.jpg", "coursesearch"),
    (os.path.join("projects", "pcb_defect_source.png"), "pcb_defect"),
    ("connectcablesimage.jpg", "mycosmosjobs"),
]


def resize_and_crop(src_path: str) -> Image.Image:
    img = Image.open(src_path).convert("RGB")
    sw, sh = img.size
    src_ratio = sw / sh
    if src_ratio > TARGET_RATIO:
        # source wider than target → crop width
        new_h = sh
        new_w = int(round(sh * TARGET_RATIO))
        x0 = (sw - new_w) // 2
        img = img.crop((x0, 0, x0 + new_w, new_h))
    else:
        # source taller than target → crop height
        new_w = sw
        new_h = int(round(sw / TARGET_RATIO))
        y0 = (sh - new_h) // 2
        img = img.crop((0, y0, new_w, y0 + new_h))
    return img.resize((TARGET_W, TARGET_H), Image.LANCZOS)


def encode_webp(png_path: str, webp_path: str, quality: int) -> int:
    subprocess.run(
        ["cwebp", "-q", str(quality), "-m", "6", "-mt", png_path, "-o", webp_path],
        check=True, capture_output=True,
    )
    return os.path.getsize(webp_path)


def encode_avif(png_path: str, avif_path: str, quality: int) -> int:
    # sips on macOS 13+ supports AVIF. `-s formatOptions` is the quality knob (0-100).
    subprocess.run(
        ["sips", "-s", "format", "avif", "-s", "formatOptions", str(quality),
         png_path, "--out", avif_path],
        check=True, capture_output=True,
    )
    return os.path.getsize(avif_path)


def fit_under(encoder, png_path: str, out_path: str, budget: int,
              start_q: int, min_q: int) -> tuple[int, int]:
    """Try encoder at progressively lower qualities until size <= budget."""
    q = start_q
    size = encoder(png_path, out_path, q)
    while size > budget and q > min_q:
        q -= 5
        size = encoder(png_path, out_path, q)
    return size, q


def human(n: int) -> str:
    return f"{n/1024:.1f} KB"


def main():
    per_image_budget = 95 * 1024  # leave headroom below 100 KB
    total_avif = 0
    total_webp = 0
    with tempfile.TemporaryDirectory() as tmp:
        for src_rel, base in JOBS:
            src = os.path.join(SRC_DIR, src_rel)
            img = resize_and_crop(src)
            tmp_png = os.path.join(tmp, f"{base}.png")
            img.save(tmp_png, "PNG")

            avif_out = os.path.join(OUT_DIR, f"{base}.avif")
            webp_out = os.path.join(OUT_DIR, f"{base}.webp")

            avif_size, aq = fit_under(encode_avif, tmp_png, avif_out,
                                      per_image_budget, start_q=55, min_q=20)
            webp_size, wq = fit_under(encode_webp, tmp_png, webp_out,
                                      per_image_budget, start_q=78, min_q=40)
            total_avif += avif_size
            total_webp += webp_size
            print(f"{base:14s}  AVIF {human(avif_size):>8s} q={aq:<3d}   "
                  f"WebP {human(webp_size):>8s} q={wq}")

    print("-" * 60)
    print(f"{'TOTAL':14s}  AVIF {human(total_avif):>8s}"
          f"             WebP {human(total_webp):>8s}")


if __name__ == "__main__":
    main()
