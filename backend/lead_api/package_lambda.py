from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "backend" / "lead_api"
BUILD_DIR = ROOT / "build"
PACKAGE_PATH = BUILD_DIR / "lead_api.zip"
FILES = ["handler.py", "validation.py"]


def main() -> None:
    BUILD_DIR.mkdir(exist_ok=True)
    with ZipFile(PACKAGE_PATH, "w", ZIP_DEFLATED) as archive:
        for filename in FILES:
            archive.write(SOURCE_DIR / filename, arcname=filename)
    print(f"Created {PACKAGE_PATH}")


if __name__ == "__main__":
    main()