const includes = document.querySelectorAll('[data-include]');
for (const include of includes) {
  const src = include.dataset.include;
  if (!src) continue;
  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Impossible de charger ${src} (${response.status})`);
    include.innerHTML = await response.text();
  } catch (error) {
    include.innerHTML = `<div style="padding:20px;color:#b00;background:#fee;border-radius:12px">Erreur de chargement : ${error.message}</div>`;
    console.error('html-loader:', src, error);
  }
}
