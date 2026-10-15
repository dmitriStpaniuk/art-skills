# art-skills

[![npm](https://img.shields.io/npm/v/art-skills)](https://www.npmjs.com/package/art-skills) [![license](https://img.shields.io/npm/l/art-skills)](LICENSE)

Личная коллекция скилов для агента Cursor от Дмитрия: генерация афиш, перерисовка фото в художественных стилях и другое.

## Установка через npm

Нужен Node.js 18+.

```bash
npx art-skills install                    # все скилы
npx art-skills install artistic-poster    # только выбранные
npx art-skills list                       # список скилов
npx art-skills@latest install             # обновление до последней версии
```

Или глобально:

```bash
npm i -g art-skills
art-skills install
art-skills update     # обновить до последней версии
```

## Установка без Node.js

```bash
curl -fsSL https://raw.githubusercontent.com/dmitriStpaniuk/art-skills/main/install.sh | bash
```

Скилы попадут в `~/.cursor/skills/` (другую папку можно задать через `CURSOR_SKILLS_DIR`). Нужны только `curl` и `tar`.

**Обновление** — запустите ту же команду ещё раз: старые копии скилов заменятся новыми.

**Только выбранные скилы:**

```bash
curl -fsSL https://raw.githubusercontent.com/dmitriStpaniuk/art-skills/main/install.sh | bash -s -- artistic-poster
```

**Альтернатива через git** (симлинки, обновление через `git pull`):

```bash
git clone https://github.com/dmitriStpaniuk/art-skills.git ~/art-skills
mkdir -p ~/.cursor/skills
ln -s ~/art-skills/artistic-poster ~/.cursor/skills/artistic-poster
ln -s ~/art-skills/ink-watercolor-redraw ~/.cursor/skills/ink-watercolor-redraw
# обновление:
git -C ~/art-skills pull
```

Скрипт установки не трогает скилы, подключённые симлинками.

## Скилы

| Скил | Описание | Статус |
|------|----------|--------|
| [artistic-poster](artistic-poster/SKILL.md) | Собирает бриф, арт-направление и промпт для художественных афиш и постеров событий. | черновик, почти готов |
| [ink-watercolor-redraw](ink-watercolor-redraw/SKILL.md) | Перерисовывает фото в иллюстрацию с сохранением сходства в выбранном художественном стиле. | черновик, почти готов |

Оба скила пока черновики (почти готовы). Дальше в планах: работа с документацией и генерация логотипов.
