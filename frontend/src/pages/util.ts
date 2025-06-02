export function r() {
  const a = localStorage.getItem("a"),
    u = localStorage.getItem("u");
  if (u) {
    const p = new URL(u);
    p.search = "";
    location.href = `${p.toString()}?a=${a}`;
  }
}
