---
name: ink-watercolor-redraw
description: >-
  Перерисовывает фото в иллюстрацию с сходством (лицо, поза, одежда): ink watercolor,
  urban sketch, карандаш, масло, акварель, пастель, Mucha, Ghibli, поп-арт, линогравюра,
  витраж, пиксель, low-poly, коллаж, Pixar, пластилин, сумиэ и др. Подключать при
  «перерисуй», «в стиле …», GenerateImage по референсу-фото; при фото без стиля —
  сначала показать каталог стилей.
---

# Photo redraw (skill)

Фото → перерисовка в выбранном стиле (не фильтр, не афиша). Цель: узнаваемый человек/сцена.

Отличие от `artistic-poster`: здесь нет события/типографики — только образ с фото.

## Когда применять

- «перерисуй», «как рисунок», «в стиле …», ink watercolor / urban sketch / карандаш / …
- есть фото (или фото + пример стиля) и нужна иллюстрация с **сходством**
- итерации: «ближе к фото», «свободнее», «как перерисовка», смена стиля из каталога

## Workflow

```
Redraw:
- [ ] 1. Референсы собраны (фото-субъект ± стиль-пример)
- [ ] 2. Стиль выбран ИЛИ меню стилей показано
- [ ] 3. Якоря сходства зафиксированы
- [ ] 4. GenerateImage с reference_image_paths
- [ ] 5. Показать результат (Read / путь)
- [ ] 6. Итерация по knobs / смена стиля, если просят
```

### 1. Вход

Нужно минимум **фото субъекта**. Опционально — пример стиля или имя стиля из каталога.

Спрашивай только если нет фото и без него нельзя.

### 2. Выбор стиля (обязательный gate)

**Если скилл вызван и фото уже есть, а стиль не назван** — не генерируй сразу. Кратко зафиксируй якоря (1 строка), затем:

1. **Предпочтительно — `AskQuestion`** (нативные кликабельные опции / чекбоксы в чате):
   - `allowMultiple: true` — чекбоксы, можно несколько стилей за раз
   - `options`: все строки каталога (`id` = style-id, `label` = RU-имя)
   - `prompt`: «Какие стили сделать с фото? (можно несколько)»
   - Дождись ответа; по каждому выбранному `id` — отдельная генерация
2. **Если `AskQuestion` недоступен** в сессии — текстовый fallback (список RU-имён + «напиши стиль или несколько через запятую»). Не выдумывай клики в markdown.

**Если стиль уже назван** (в запросе, `/скилл … масло`, «как Ghibli») — сразу к якорям и генерации.

**Default**, если явно просят «как в скилле / urban sketch / ink watercolor» без другого стиля: `ink-watercolor`.

**Done:** известен один или несколько `style-id` из каталога (или пользовательский стиль-пример).

### 3. Якоря сходства

Перед генерацией зафиксируй (для себя и в промпте):

1. **Лицо / выражение**
2. **Волосы**
3. **Одежда**
4. **Поза + жест**
5. **Среда + свет**
6. **Кроп**

**Done:** по якорям можно узнать исходное фото.

Подставь якоря в общий stem (не копируй чужой кадр дословно — только то, что на **этом** фото).

### 4. Генерация

Собери промпт:

1. **Stem** (общий префикс + якоря)
2. **Style clause** из каталога (или описание стиль-примера)
3. Хвост: `not a filter, not photoreal; careful likeness redraw of the reference photo. No watermark, no logos, no embedded text.`

`GenerateImage`:

- `reference_image_paths`: **сначала фото субъекта**, затем стиль-пример (если есть)
- `aspect_ratio`: как у фото или `3:4`
- `filename`: короткое имя (`woman-pine-oil.jpg`)

Генерируй сразу, когда стиль выбран и просят сделать / показать. Не ограничивайся текстом промпта, если инструмент доступен.

### 5. Показ

Показать (Read / путь). «Покажи» уже готовое — не генерировать заново без нужды.

### 6. Knobs

| Запрос | Что усилить |
|--------|-------------|
| ближе к фото | facial likeness, proportions, same crop, gesture, clothing |
| как перерисовка | careful hand redraw; follow real shapes, not invented face |
| свободнее | looser / unfinished edges / lighter medium |
| как в примере | style reference first; keep subject anchors |
| другой стиль | взять clause из каталога; те же якоря |
| сетка стилей | 2×2 только если явно просят |

## Stem (общий префикс)

Все стили начинаются одинаково (EN → GenerateImage):

```text
Transform this photo into {STYLE_CLAUSE}. Keep {SUBJECT_ANCHORS}: face, expression, hair, clothes, pose and setting from the reference; same crop.
```

Пример якорей для кадра «девушка у сосны» (подставлять только если это *это* фото):

```text
keep the woman's face, warm smile, long light-blonde hair, black textured jacket and pink sweater; she leans against a pine trunk in a sunny forest
```

## Каталог стилей

При меню пользователю — список RU-имён (можно одной колонкой). В промпт — полный `STYLE_CLAUSE`.

| id | RU | STYLE_CLAUSE |
|----|----|--------------|
| `ink-watercolor` | Ink & watercolor (default) | a loose ink-and-watercolor illustration, urban-sketch: expressive pen linework, soft warm watercolor washes, visible paper texture, sketchy crosshatched shadows, light airy palette, slightly unfinished edges, hand-drawn sketchbook quality |
| `graphite` | Карандаш | a detailed graphite pencil drawing: fine hatching and cross-hatching, soft smudged shading, visible pencil strokes on textured off-white paper, monochrome grey tones, realistic portrait sketch, hand-drawn |
| `oil` | Масло | an impressionist oil painting: thick visible brushstrokes, dappled sunlight, vibrant warm palette, Monet and Renoir style, canvas texture |
| `watercolor` | Акварель | a delicate watercolor painting: soft bleeding washes, wet-on-wet blooms, white paper left as highlights, light pastel palette |
| `pastel` | Пастель | a soft pastel and sanguine drawing on toned beige paper: chalky strokes, warm reddish-brown tones, gentle blending |
| `mucha` | Модерн | an Art Nouveau poster in Alphonse Mucha style: flowing decorative lines, ornate floral frame, halo circle behind her head, muted gold and green palette |
| `ghibli` | Ghibli | a Studio Ghibli anime still: hand-painted lush forest background, soft warm light, gentle cel shading, whimsical cozy mood |
| `pop-art` | Поп-арт | a pop-art comic panel: bold black outlines, Ben-Day dots, flat vivid colors, Roy Lichtenstein style |
| `linocut` | Линогравюра | a black and white linocut print: bold carved lines, high contrast, woodcut texture, hand-printed look |
| `stained-glass` | Витраж | a stained glass window: vivid colored glass pieces, thick dark lead lines, light glowing through |
| `pixel` | Пиксель-арт | 16-bit pixel art: limited palette, crisp pixels, retro video game style |
| `low-poly` | Low-poly | a low-poly geometric portrait: faceted triangles, flat shaded planes, clean modern look |
| `paper-collage` | Бумажный коллаж | a layered paper-cut collage: cut paper shapes, soft shadows between layers, handmade craft texture |
| `pixar` | Pixar 3D | a Pixar-style 3D character: big expressive eyes, soft subsurface skin, stylized hair, cinematic lighting |
| `claymation` | Пластилин | a claymation figure: plasticine texture, fingerprint marks, stop-motion style, miniature forest set |
| `sumi-e` | Сумиэ | a Japanese sumi-e ink painting: minimal expressive brush strokes, black ink washes, lots of empty space, rice paper texture |

Пользовательский стиль (свой текст / референс) — допустим; stem и якоря те же.

### AskQuestion (кликабельные чекбоксы)

Когда инструмент есть — вызывай его вместо текстового списка. Пример опций:

```json
{
  "title": "Стиль перерисовки",
  "questions": [{
    "id": "styles",
    "prompt": "Какие стили сделать с фото? (можно несколько)",
    "allowMultiple": true,
    "options": [
      { "id": "ink-watercolor", "label": "Ink & watercolor" },
      { "id": "graphite", "label": "Карандаш" },
      { "id": "oil", "label": "Масло" },
      { "id": "watercolor", "label": "Акварель" },
      { "id": "pastel", "label": "Пастель" },
      { "id": "mucha", "label": "Модерн (Mucha)" },
      { "id": "ghibli", "label": "Ghibli" },
      { "id": "pop-art", "label": "Поп-арт" },
      { "id": "linocut", "label": "Линогравюра" },
      { "id": "stained-glass", "label": "Витраж" },
      { "id": "pixel", "label": "Пиксель-арт" },
      { "id": "low-poly", "label": "Low-poly" },
      { "id": "paper-collage", "label": "Бумажный коллаж" },
      { "id": "pixar", "label": "Pixar 3D" },
      { "id": "claymation", "label": "Пластилин" },
      { "id": "sumi-e", "label": "Сумиэ" }
    ]
  }]
}
```

### Текстовый fallback (нет AskQuestion)

```text
Фото есть. Напиши стиль(и): Ink & watercolor, Карандаш, Масло, Акварель, Пастель, Модерн, Ghibli, Поп-арт, Линогравюра, Витраж, Пиксель, Low-poly, Бумажный коллаж, Pixar 3D, Пластилин, Сумиэ
```

## Чеклист качества

- [ ] Узнаётся тот же человек / та же поза
- [ ] Один кадр; стиль соответствует выбранному clause
- [ ] Виден выбранный медиум (не «AI soft photo»), если стиль рисованный
- [ ] Нет пластиковой кожи / лишнего purple glow (кроме стилей, где glow уместен)
- [ ] Нет впечатанного текста / водяных знаков
- [ ] Детали одежды и жеста не потеряны

## Анти-паттерны

- Generic stock-лицо вместо сходства
- Генерация до выбора стиля, когда фото есть, а стиль не назван
- Фотореализм / beauty-filter вместо выбранного медиума
- Выдуманная одежда/фон при запросе перерисовки
- Долгий опрос вместо меню стилей или генерации

## Ответ пользователю

**Меню стилей:** якоря одной строкой + `AskQuestion` (чекбоксы) или текстовый fallback.

**После генерации:**

1. Что сделано (1 строка: стиль; при нескольких — по одному результату)
2. Показ / путь
3. Один knob только если уместно («ближе / другой стиль?»)

Не создавать SUMMARY/отчёты в репо.
