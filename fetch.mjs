async function main() {
  const res = await fetch('http://localhost:3000/api/env-debug');
  const text = await res.text();
  console.log(text);
}
main();
