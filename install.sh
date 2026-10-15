#!/usr/bin/env bash
# Устанавливает/обновляет скилы из dmitriStpaniuk/art-skills в Cursor.
set -euo pipefail

REPO_TARBALL="https://github.com/dmitriStpaniuk/art-skills/archive/refs/heads/main.tar.gz"
DEST="${CURSOR_SKILLS_DIR:-$HOME/.cursor/skills}"

TMP="$(mktemp -d 2>/dev/null || mktemp -d -t art-skills)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT INT TERM

echo "Скачиваю art-skills..."
curl -fsSL "$REPO_TARBALL" | tar -xzf - -C "$TMP"
SRC="$(find "$TMP" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
[ -n "$SRC" ] || { echo "Ошибка: архив пустой" >&2; exit 1; }

mkdir -p "$DEST"

wanted() {
  [ "$#" -le 1 ] && return 0
  local name="$1"; shift
  local w
  for w in "$@"; do [ "$w" = "$name" ] && return 0; done
  return 1
}

installed=()
skipped=()
found=()
for dir in "$SRC"/*/; do
  dir="${dir%/}"
  [ -f "$dir/SKILL.md" ] || continue
  name="$(basename "$dir")"
  found+=("$name")
  wanted "$name" "$@" || continue
  target="$DEST/$name"
  if [ -L "$target" ]; then
    echo "Пропускаю $name: $target — симлинк (управляется через git)."
    skipped+=("$name")
    continue
  fi
  rm -rf "$target"
  cp -R "$dir" "$target"
  installed+=("$name")
done

for w in "$@"; do
  ok=0
  for f in "${found[@]+"${found[@]}"}"; do [ "$f" = "$w" ] && ok=1; done
  [ "$ok" = 1 ] || echo "Предупреждение: скил «$w» не найден в репозитории." >&2
done

echo
if [ "${#installed[@]}" -gt 0 ]; then
  echo "Установлено в $DEST:"
  for n in "${installed[@]}"; do echo "  • $n"; done
else
  echo "Ничего не установлено."
fi
if [ "${#skipped[@]}" -gt 0 ]; then
  echo "Пропущено (симлинки): ${skipped[*]}"
fi
