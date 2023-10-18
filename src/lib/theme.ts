export type Theme = {
    name: string;
    style: string;
};

export const defaultTheme = `@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;700&display=swap');

:root {
  --text-color: rgba(255, 255, 255, 0.87);
  --bg-0: #232323;
  --bg-1: #1C1C1C;
  --bg-2: #0E0E0E;

  font-family: 'Source Sans 3', sans-serif;
  line-height: 1.5;
  font-weight: 400;
}`;
