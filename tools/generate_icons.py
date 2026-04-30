from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_LOGO = ROOT / "logo.png"
PUBLIC_DIR = ROOT / "public"

APP_ICON_PATH = PUBLIC_DIR / "icon.png"
TRAY_ICON_PATH = PUBLIC_DIR / "tray-icon.png"
ICO_PATH = PUBLIC_DIR / "icon.ico"
ICNS_PATH = PUBLIC_DIR / "icon.icns"


def create_padded_icon(source: Image.Image, canvas_size: int, scale: float) -> Image.Image:
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    target_size = int(canvas_size * scale)
    resized = source.resize((target_size, target_size), Image.Resampling.LANCZOS)
    offset = ((canvas_size - target_size) // 2, (canvas_size - target_size) // 2)
    canvas.paste(resized, offset, resized)
    return canvas


def main() -> None:
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    source = Image.open(SOURCE_LOGO).convert("RGBA")

    # Keep only a slim transparent edge so the rounded white card stays readable
    # in Windows taskbar, desktop, and tray contexts without making the core mark
    # feel undersized.
    app_icon = create_padded_icon(source, canvas_size=1024, scale=0.9)
    tray_icon = create_padded_icon(source, canvas_size=256, scale=0.88)

    app_icon.save(APP_ICON_PATH)
    tray_icon.save(TRAY_ICON_PATH)
    app_icon.save(
        ICO_PATH,
        format="ICO",
        sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )

    try:
        app_icon.save(ICNS_PATH, format="ICNS")
    except Exception as exc:  # pragma: no cover - best effort on Windows
        print(f"Warning: could not update ICNS: {exc}")

    print("Generated:")
    print(f" - {APP_ICON_PATH}")
    print(f" - {TRAY_ICON_PATH}")
    print(f" - {ICO_PATH}")
    print(f" - {ICNS_PATH}")


if __name__ == "__main__":
    main()
