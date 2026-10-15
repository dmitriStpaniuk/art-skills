#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PKG = require(path.join(ROOT, 'package.json'));
const DEST = process.env.CURSOR_SKILLS_DIR || path.join(os.homedir(), '.cursor', 'skills');

function skills() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules'
      && fs.existsSync(path.join(ROOT, d.name, 'SKILL.md')))
    .map((d) => d.name).sort();
}

function describe(name) {
  const txt = fs.readFileSync(path.join(ROOT, name, 'SKILL.md'), 'utf8');
  const fm = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return '';
  const m = ('\n' + fm[1] + '\n').match(/\ndescription:\s*(?:[>|]-?\s*\n)?([\s\S]*?)(?=\n\S|\n$)/);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

function install(names) {
  const all = skills();
  for (const n of names) if (!all.includes(n)) console.error(`Предупреждение: скил «${n}» не найден в пакете.`);
  const todo = names.length ? all.filter((n) => names.includes(n)) : all;
  fs.mkdirSync(DEST, { recursive: true });
  const done = [], skipped = [];
  for (const name of todo) {
    const target = path.join(DEST, name);
    let st = null;
    try { st = fs.lstatSync(target); } catch (_) {}
    if (st && st.isSymbolicLink()) {
      console.log(`Пропускаю ${name}: ${target} — симлинк (управляется через git).`);
      skipped.push(name);
      continue;
    }
    fs.rmSync(target, { recursive: true, force: true });
    fs.cpSync(path.join(ROOT, name), target, { recursive: true });
    done.push(name);
  }
  console.log('');
  if (done.length) {
    console.log(`Установлено в ${DEST} (art-skills ${PKG.version}):`);
    for (const n of done) console.log(`  • ${n}`);
  } else console.log('Ничего не установлено.');
  if (skipped.length) console.log(`Пропущено (симлинки): ${skipped.join(', ')}`);
}

function update(names) {
  console.log(`Обновляю до последней версии ${PKG.name}...`);
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const r = spawnSync(npx, ['-y', `${PKG.name}@latest`, 'install', ...names], { stdio: 'inherit' });
  if (r.error) { console.error(`Не удалось запустить npx: ${r.error.message}`); process.exit(1); }
  process.exit(r.status == null ? 1 : r.status);
}

function list() {
  console.log(`Доступные скилы (art-skills ${PKG.version}):`);
  for (const n of skills()) console.log(`  • ${n} — ${describe(n)}`);
}

function help() {
  console.log(`art-skills ${PKG.version} — скилы для агента Cursor

Использование:
  art-skills install [имена...]  установить скилы (все или указанные)
  art-skills update [имена...]   обновить до последней версии пакета
  art-skills list                показать доступные скилы
  art-skills --help              эта справка

Папка установки: $CURSOR_SKILLS_DIR или ~/.cursor/skills
Скилы-симлинки не трогаются.`);
}

const [cmd, ...args] = process.argv.slice(2);
switch (cmd) {
  case 'install': install(args); break;
  case 'update': update(args); break;
  case 'list': list(); break;
  case undefined: case '-h': case '--help': case 'help': help(); break;
  case '-v': case '--version': console.log(PKG.version); break;
  default: console.error(`Неизвестная команда: ${cmd}\n`); help(); process.exit(1);
}
