export function r() {
  const a = localStorage.getItem("a"),
    r = localStorage.getItem("r");
  if (r) {
    const p = new URL(r);
    p.search = "";
    localStorage.removeItem("r");
    location.href = `${p.toString()}?a=${a}`;
  }
}
