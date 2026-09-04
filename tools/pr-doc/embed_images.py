#!/usr/bin/env python3
"""guide.src.html の <img src="shots/*.png"> を data URI に差し替えて 1 ファイル完結の HTML を書き出す。

使い方:
    embed_images.py <src.html> [-o out.html]

出力を省略すると、入力と同じディレクトリの guide.html に書き出す。
画像パスは src.html からの相対で解決する。見つからない画像があれば、
その旨を報告して終了コード 1 を返す（欠けたまま配布物を作らない）。
"""
import argparse
import base64
import mimetypes
import re
import sys
from pathlib import Path

IMG_SRC = re.compile(r'(<img\b[^>]*?\bsrc=")([^"]+)(")', re.IGNORECASE)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("src", type=Path)
    parser.add_argument("-o", "--out", type=Path)
    args = parser.parse_args()

    src: Path = args.src
    out: Path = args.out or src.parent / "guide.html"
    html = src.read_text(encoding="utf-8")

    missing: list[str] = []
    embedded = 0

    def replace(m: re.Match) -> str:
        nonlocal embedded
        path = m.group(2)
        if path.startswith("data:") or "://" in path:
            return m.group(0)
        image = (src.parent / path).resolve()
        if not image.is_file():
            missing.append(path)
            return m.group(0)
        mime = mimetypes.guess_type(image.name)[0] or "image/png"
        payload = base64.b64encode(image.read_bytes()).decode("ascii")
        embedded += 1
        return f"{m.group(1)}data:{mime};base64,{payload}{m.group(3)}"

    result = IMG_SRC.sub(replace, html)

    if missing:
        print("画像が見つからない: " + ", ".join(missing), file=sys.stderr)
        return 1

    out.write_text(result, encoding="utf-8")
    size_mb = out.stat().st_size / 1024 / 1024
    print(f"{out} に {embedded} 枚を埋め込み ({size_mb:.1f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
