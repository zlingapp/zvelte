export type Theme = {
  id: number;
  name: string;
  author: string;
  enabled: boolean;
  style: string;
}

export const defaultTheme = {
  id: -1, 
  name: "Zling default theme",
  author: "Zling team",
  enabled: true,
  style: `/* Feel free to edit this file to your liking. */

@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;700&display=swap');

:root {
  --text-color: rgba(255, 255, 255, 0.87);
  --bg-0: #232323;
  --bg-1: #1C1C1C;
  --bg-2: #0E0E0E;

  --green: #00b576;
  --red: #c94b44;
  --yellow: #ffc800;
  --gray: #888b8f;
  --gray-2: #b5bac1;
  --green-btn: #00925f;

  --accent-color: #2764ff;
  --disabled: #888b8f3f;
  --disabled-text: rgba(255, 255, 255, 0.3);

  /* for the pop up text tooltips */
  --tooltip-bg: #000;
  --tooltip-fg: #fff;

  /* right click menus */
  --context-menu-bg: #111214;

  /* categories in settings eg. My Account */
  --category-hover-bg: rgba(255, 255, 255, 0.05);

  /* message box */
  --message-caret-fg: #dbdee1;
  --message-caret-bg: #2b2b2b;

  /* bottom left user drawer */
  --user-drawer-bg: #141414;
  
  /* channels */
  --channel-fg: #888b8f;
  --channel-hover-fg: #fff;
  --channel-hover-bg: #212121;
  --channel-current-fg: #fff;
  --channel-current-bg: #2B2B2B;

  /* background of a message when it's hovered */
  --message-hover-bg: #262626;

  /* fade out background of modals */
  --modal-bg: rgba(0, 0, 0, 0.5);

  /* zzz there's no one here */
  --lonely-message-fg: rgba(255, 255, 255, 0.08);

  font-family: 'Source Sans 3', sans-serif;
  line-height: 1.5;
  font-weight: 400;
}`};

export function fileStringToTheme(s: string): Theme | null {
  const regex = /^\/\*theme ({(?:\s*"(?:name|author|version)":\s?".*",?)+\n?})\*\//g

  const match = regex.exec(s);

  if (match == null) {
    return null;
  }

  const parsed = JSON.parse(match[1]);

  var css = s.slice(regex.lastIndex).trim();

  const theme = { ...parsed, style: css, id:Math.floor(Math.random() * 1000) };

  return theme;
}

export function themeToFileString(t: Theme): string {
  return `/*theme {\n    "name": "${t.name}",\n    "author": "${t.author}"\n}*/\n` + t.style;
}
