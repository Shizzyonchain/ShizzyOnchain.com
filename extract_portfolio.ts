async function run() {
  try {
    const response = await fetch("https://api.ocr.space/parse/imageurl?apikey=helloworld&url=https://i.postimg.cc/C1Krv0cM/Untitled-design-(3).png");
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

run();
