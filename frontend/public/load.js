const s = new URLSearchParams(location.search),
  r = s.get("ref"),
  a = s.get("a"),
  l = location.href,
  b = new URL(l),
  d = document;
function E(e) {
  return d.getElementById(e);
}
localStorage.setItem("u", l);
if (r) localStorage.setItem("r", r);
[("a", "d")].forEach((i) => (E(i).style.display = a ? "inline-block" : "none"));
E("c").style.display = a ? "none" : "inline-block";
b.search = "";
E("d").href = b.toString();
const f = E("c");
f.addEventListener("submit", function (s) {
  s.preventDefault();
  const u = new URL(f.action, location.origin),
    e = E("e");
  u.searchParams.set("t", s.submitter?.name);
  if (e && e.value) u.searchParams.set("email", e.value);
  location.href = u.toString();
});
function C(v, w, x) {
  const o = d.createElement("option");
  o.value = v;
  o.textContent = w;
  E(x).appendChild(o);
}
const t = "Candidate in ";
[
  [3, "Loan Default"],
  [4, "Fraud Detection"],
  [5, "Debt Repayment Probability"],
  [6, "Mental Wellness"],
  [7, "Employee Churn"],
  [8, "Candidate Success in General"],
  [9, t + "Construction"],
  [10, t + "Management"],
  [11, t + "Programming"],
  [12, t + "Sales and Marketing"],
  [13, t + "Sales"],
  [14, t + "Marketing"],
  [15, t + "AI Content"],
  [16, t + "Legal Finance"],
  [17, t + "Design"],
  [18, t + "Accounting"],
  [19, t + "Recruitment"],
  [20, t + "Operations"],
  [21, t + "Customer Service"],
  [22, t + "Technical Support"],
  [24, t + "Merchant Acquisition"],
  [23, t + "Telesales"],
].forEach(([v, w]) => C(v, w, "v"));
[
  ["male", "Male"],
  ["female", "Female"],
].forEach(([v, w]) => C(v, w, "g"));
for (let g = 18; g <= 100; g++) C(g, g, "y");
if (a) {
  const U = ".insightgenesis.ai/",
    z = `https://panel${U}?ref=${a}`,
    k = E("k");
  k.textContent = z;
  k.addEventListener("click", async (e) => {
    e.preventDefault();
    await navigator.clipboard.writeText(z);
    k.textContent = "Copied!";
  });
  const q = localStorage.getItem("r");
  if (q) fetch(`https://api${U}ref?t=${a}&f=${q}`);
}
