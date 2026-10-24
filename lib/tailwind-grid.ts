import plugin from 'tailwindcss/plugin';

const counts = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [String(i + 1), String(i + 1)])
);
const units = Object.fromEntries(
  [0.25, 0.5, 1.5, ...Array.from({ length: 24 }, (_, i) => i + 1)].map((n) => [
    String(n).replace('.', '_'),
    String(n),
  ])
);

const span = (n: string) => `calc(var(--col) * ${n} + var(--grid-gutter) * (${n} - 1))`;
const offset = (n: string) => `calc(var(--pitch) * ${n})`;
const unit = (n: string) => `calc(var(--u) * ${n})`;

export const gridSpacing = Object.fromEntries(
  Object.entries(units).map(([key, n]) => [`u${key}`, unit(n)])
);

export default plugin(({ addComponents, matchUtilities }) => {
  addComponents({
    '.grid-site': {
      display: 'grid',
      gridTemplateColumns: 'repeat(var(--grid-cols), minmax(0, 1fr))',
      columnGap: 'var(--grid-gutter)',
      width: '100%',
      maxWidth: 'var(--grid-max)',
      marginInline: 'auto',
      paddingInline: 'var(--grid-margin)',
    },
    '.container-site': {
      width: '100%',
      maxWidth: 'var(--grid-max)',
      marginInline: 'auto',
      paddingInline: 'var(--grid-margin)',
    },
  });

  matchUtilities({ 'w-cols': (n) => ({ width: span(n) }) }, { values: counts });
  matchUtilities({ 'max-w-cols': (n) => ({ maxWidth: span(n) }) }, { values: counts });
  matchUtilities({ 'ml-cols': (n) => ({ marginLeft: offset(n) }) }, { values: counts });
  matchUtilities({ 'pl-cols': (n) => ({ paddingLeft: offset(n) }) }, { values: counts });
  matchUtilities({ 'indent-cols': (n) => ({ textIndent: offset(n) }) }, { values: counts });
  matchUtilities(
    { 'left-cols': (n) => ({ left: `calc(var(--grid-margin) + ${offset(n)})` }) },
    { values: { '0': '0', ...counts } }
  );
});
