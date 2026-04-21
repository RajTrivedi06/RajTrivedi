"""Generate a stylized PCB-defect-detection illustration at 800x384.

Produces a green circuit board with copper traces, pads, vias, an IC,
and two highlighted defect annotations (red bounding boxes + labels).
Output: src/assets/projects/pcb_defect_source.png
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random
import os

random.seed(7)

W, H = 1600, 768  # oversample 2x then downscale for smoother AA
OUT = os.path.join(
    os.path.dirname(__file__), "..", "src", "assets", "projects", "pcb_defect_source.png"
)
OUT = os.path.abspath(OUT)

BOARD_BG = (20, 84, 52)        # PCB green
BOARD_BG_DARK = (12, 58, 36)
TRACE = (198, 150, 60)          # copper
TRACE_LIGHT = (230, 185, 90)
SILK = (230, 230, 220)
PAD = (210, 170, 70)
PAD_HI = (250, 210, 120)
DEFECT = (235, 60, 60)
DEFECT_GLOW = (255, 120, 100)

img = Image.new("RGB", (W, H), BOARD_BG)
d = ImageDraw.Draw(img, "RGBA")

# Subtle noise / gradient overlay
for y in range(H):
    t = y / H
    shade = (
        int(BOARD_BG[0] * (1 - t * 0.25)),
        int(BOARD_BG[1] * (1 - t * 0.15)),
        int(BOARD_BG[2] * (1 - t * 0.25)),
    )
    d.line([(0, y), (W, y)], fill=shade)

# Fine scanline texture
for _ in range(2400):
    x = random.randint(0, W - 1)
    y = random.randint(0, H - 1)
    d.point((x, y), fill=(0, 0, 0, 20))

# Outer silk border
d.rectangle([8, 8, W - 9, H - 9], outline=SILK, width=3)

# Grid of pads (through-hole style) along top/bottom edges
for i in range(12, W - 12, 68):
    for y in (40, H - 44):
        d.ellipse([i - 10, y - 10, i + 10, y + 10], fill=PAD, outline=TRACE_LIGHT, width=2)
        d.ellipse([i - 4, y - 4, i + 4, y + 4], fill=BOARD_BG_DARK)

# Horizontal bus traces
for y, col in [(120, TRACE), (170, TRACE_LIGHT), (220, TRACE), (H - 170, TRACE_LIGHT), (H - 120, TRACE)]:
    d.line([(60, y), (W - 60, y)], fill=col, width=6)
    # rivets
    for xr in range(80, W - 60, 120):
        d.ellipse([xr - 7, y - 7, xr + 7, y + 7], fill=PAD_HI, outline=TRACE, width=2)

# Vertical branch traces
for x in range(140, W - 80, 110):
    d.line([(x, 60), (x, 120)], fill=TRACE, width=5)
    d.line([(x, 220), (x, H - 170)], fill=TRACE_LIGHT, width=5)
    d.line([(x, H - 120), (x, H - 60)], fill=TRACE, width=5)

# Diagonal accent traces
for i in range(0, 8):
    x0 = 200 + i * 140
    d.line([(x0, 260), (x0 + 90, 340)], fill=TRACE_LIGHT, width=4)
    d.line([(x0, H - 260), (x0 + 90, H - 340)], fill=TRACE_LIGHT, width=4)

# Large IC chip in the center
ic_x, ic_y, ic_w, ic_h = W // 2 - 200, H // 2 - 90, 400, 180
d.rounded_rectangle([ic_x, ic_y, ic_x + ic_w, ic_y + ic_h], radius=10,
                    fill=(22, 22, 24), outline=(60, 60, 62), width=2)
# IC pins
for i in range(18):
    px = ic_x + 20 + i * ((ic_w - 40) // 17)
    d.rectangle([px - 6, ic_y - 14, px + 6, ic_y + 2], fill=SILK)
    d.rectangle([px - 6, ic_y + ic_h - 2, px + 6, ic_y + ic_h + 14], fill=SILK)
# IC label
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 36)
    font_small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 22)
    font_tiny = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 18)
except Exception:
    font = ImageFont.load_default()
    font_small = font
    font_tiny = font
d.text((ic_x + ic_w // 2 - 80, ic_y + 50), "MCU-539", fill=SILK, font=font)
d.text((ic_x + ic_w // 2 - 60, ic_y + 100), "NEURAL-NET", fill=(160, 160, 160), font=font_small)

# Small capacitors / resistors around the IC
for (cx, cy) in [(180, 110), (260, 110), (W - 180, 110), (W - 260, 110),
                 (180, H - 110), (260, H - 110), (W - 180, H - 110), (W - 260, H - 110)]:
    d.rounded_rectangle([cx - 30, cy - 14, cx + 30, cy + 14], radius=4,
                        fill=(30, 30, 32), outline=(80, 80, 82), width=2)
    d.rectangle([cx - 38, cy - 6, cx - 30, cy + 6], fill=PAD_HI)
    d.rectangle([cx + 30, cy - 6, cx + 38, cy + 6], fill=PAD_HI)

# --- DEFECTS (highlighted by the ML model) ---
# Defect 1: short/bridge between two traces (top-left region)
dx1, dy1 = 360, 180
d.ellipse([dx1 - 14, dy1 - 14, dx1 + 14, dy1 + 14], fill=(200, 150, 60))
d.line([(dx1 - 20, dy1), (dx1 + 20, dy1)], fill=TRACE_LIGHT, width=4)
# Bounding box + label
bx, by, bw, bh = dx1 - 48, dy1 - 48, 96, 96
d.rectangle([bx, by, bx + bw, by + bh], outline=DEFECT, width=4)
d.rectangle([bx, by - 34, bx + 180, by], fill=DEFECT)
d.text((bx + 8, by - 30), "SHORT 0.94", fill=(255, 255, 255), font=font_small)

# Defect 2: missing pad / open (bottom-right region)
dx2, dy2 = W - 420, H - 210
d.ellipse([dx2 - 18, dy2 - 18, dx2 + 18, dy2 + 18], fill=BOARD_BG_DARK, outline=(90, 60, 30), width=2)
bx2, by2, bw2, bh2 = dx2 - 56, dy2 - 56, 112, 112
d.rectangle([bx2, by2, bx2 + bw2, by2 + bh2], outline=DEFECT, width=4)
d.rectangle([bx2, by2 - 34, bx2 + 210, by2], fill=DEFECT)
d.text((bx2 + 8, by2 - 30), "MISSING 0.88", fill=(255, 255, 255), font=font_small)

# Soft red glow around defects
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
for (cx, cy, r) in [(dx1, dy1, 80), (dx2, dy2, 95)]:
    for i, a in enumerate([40, 28, 18, 10]):
        gd.ellipse([cx - r - i * 10, cy - r - i * 10, cx + r + i * 10, cy + r + i * 10],
                   outline=(255, 60, 60, a), width=6)
glow = glow.filter(ImageFilter.GaussianBlur(6))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")

# Title in corner
d = ImageDraw.Draw(img)
d.text((28, H - 56), "PCB DEFECT DETECTION", fill=SILK, font=font_small)
d.text((28, H - 30), "CNN · PyTorch · ECE/CS/ME 539", fill=(200, 220, 200), font=font_tiny)

# Downsample to 800x384 with high-quality resample
final = img.resize((800, 384), Image.LANCZOS)
final.save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT}")
