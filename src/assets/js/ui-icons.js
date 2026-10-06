// Quiet, code-native outline symbols share the site's existing stroke language.
const paths = {
  trophy:'<path d="M8 3h8v5a4 4 0 0 1-8 0Z M8 5H4v2a4 4 0 0 0 4 4 M16 5h4v2a4 4 0 0 1-4 4 M12 12v6 M8 21h8 M10 18h4v3"/>',
  target:'<circle cx="12" cy="12" r="7"/><path d="M12 2v6 M12 16v6 M2 12h6 M16 12h6"/><circle cx="12" cy="12" r="1"/>',
  controller:'<path d="M8 7h8c3 0 4 3 5 8s-2 6-4 3l-2-2H9l-2 2c-2 3-5 2-4-3s2-8 5-8Z M7 10v5 M4.5 12.5h5 M15 11h.01 M18 14h.01"/>',
  cube:'<path d="m12 3 9 5v9l-9 5-9-5V8Z m-9 5 9 5 9-5 M12 13v9 M7.5 5.5l9 5"/>',
  overwatch:'<circle cx="12" cy="12" r="9"/><path d="m5 17 7-7 7 7 M12 10V5"/>',
  race:'<path d="M5 22V3 M5 3h14l-2 4 2 4H5 M10 3v4h4v4 M14 3v4h5"/>',
  steam:'<circle cx="12" cy="12" r="10"/><circle cx="16" cy="8" r="3.5"/><circle cx="16" cy="8" r="1.6"/><circle cx="7.5" cy="16.5" r="2.7"/><path d="m2.5 13 5 3.5 M9.4 14.5l4-3.9 M10 17.7l7-6.3"/>',
  twitch:'<path d="M5 3h16v12l-5 5h-5l-3 3v-3H3V7Z M10 7v6 M16 7v6"/>',
  layers:'<path d="m12 3 10 6-10 6L2 9Z M2 13l10 6 10-6 M2 17l10 6 10-6"/>',
  broadcast:'<circle cx="12" cy="12" r="2"/><path d="M7 7a7 7 0 0 0 0 10 M17 7a7 7 0 0 1 0 10 M4 4a11 11 0 0 0 0 16 M20 4a11 11 0 0 1 0 16"/>',
  cpu:'<rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v4 M15 2v4 M9 18v4 M15 18v4 M2 9h4 M2 15h4 M18 9h4 M18 15h4"/>',
  case:'<rect x="3" y="7" width="18" height="14" rx="1"/><path d="M8 7V3h8v4 M3 12h18 M10 12v3h4v-3"/>',
};
export function uiIcon(name) {
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] ?? paths.layers}</svg>`;
}
