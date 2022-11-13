// -----------------------------------
const dropzone = document.querySelector(".dropzone");
dropzone.addEventListener("dragenter", (event) => {
  event.preventDefault();
  dropzone.classList.add("active");
});

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  // dropzone.classList.remove("active");
});
// -----------------------------------
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const scalefactor = 1;

let image1 = new Image();

const inputSlider = document.getElementById("resolution");
const inputlabel = document.getElementById("resolutionLabel");
inputSlider.addEventListener("change", handleSlider);
class Cell {
  constructor(x, y, symbol, color) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
  }
  //which canvas to draw on
  draw(ctx) {
    ctx.fillStyle = "white";
    //this.x and this.y index from nested for loop
    ctx.fillText(this.symbol, this.x + 0.5, this.y + 0.5);
    ctx.fillStyle = this.color;
    //this.x and this.y index from nested for loop
    ctx.fillText(this.symbol, this.x, this.y);
  }
}

const characters = [];
characters[0] = "*";
var inputVal;

function getInputValue() {
  characters.length = 0;
  // console.log("Fill Art clicked");
  inputVal = document.getElementById("characters_field").value;
  for (let i = 0; i < inputVal.length; i++) {
    characters.push(inputVal[i]);
  }
  for (let i = 0; i < inputVal.length; i++) {
    console.log(characters[i]);
  }
  console.log(characters);
  if (inputVal) {
    handleSlider();
  }
}

function reversepolarity() {
  characters.reverse();
  handleSlider();
}

const transparencyLabel = document.getElementById("transparencyLabel");
const transparencySlider = document.querySelector("#transparency");
// console.log(transparencySlider);
transparencySlider.addEventListener("change", handleTransparency);
let transparent = 128;

function handleTransparency() {
  transparent = transparencySlider.value * 20;
  transparencyLabel.innerHTML = "Transparency: " + transparent / 20;
  console.log(transparent);
  handleSlider();
  transparent = 128;
}

function convertToSymbol(g) {
  const max = 255;
  let l = characters.length;
  let j = 0;
  let i = 1;
  while (j < l) {
    if (g > max - i * (max / l)) return characters[i - 1];
    i++;
  }
  // if (g > max - 2 * (max / l)) return characters[1];
  // if (g > max - 3 * (max / l)) return characters[2];
  // if (g > max - 4 * (max / l)) return characters[3];

  // return characters[0];
  // if (g > 250) return characters[factor];
  // else if (g > 240) return characters[factor];
  // else if (g > 220) return characters[factor];
  // else if (g > 200) return characters[factor];
  // else if (g > 180) return characters[factor];
  // else if (g > 160) return "%";
  // else if (g > 140) return "_";
  // else if (g > 120) return ":";
  // else if (g > 100) return "$";
  // else if (g > 80) return "₹";
  // else if (g > 60) return "/";
  // else if (g > 40) return "X";
  // else if (g > 20) return "W";
  // else return "";
}

class AsciiEffect {
  #imageCellArray = [];
  #pixels = [];
  #ctx;
  #width;
  #height;
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
    this.#pixels = this.#ctx.getImageData(0, 0, image1.width, image1.height);
    //console.log(this.#pixels.data);
  }

  #scanImage(cellSize) {
    this.#imageCellArray = [];
    //outer for rows and inner for columns

    for (let y = 0; y < this.#pixels.height; y += cellSize) {
      for (let x = 0; x < this.#pixels.width; x += cellSize) {
        //cellSize comes from resolution
        //each single pixel holds 4 positions in array r,g,b,alpha each from 0 to 255
        const posX = x * 4;
        const posY = y * 4;
        //all roys we have gone through
        //posX how far along the row are we in the row we are cycling
        const pos = posY * this.#pixels.width + posX;

        //checking if pixels are not transparent
        //alpha at least 128
        if (this.#pixels.data[pos + 3] > transparent) {
          const red = this.#pixels.data[pos];
          const green = this.#pixels.data[pos + 1];
          const blue = this.#pixels.data[pos + 2];
          const total = red + green + blue;
          const avgColorValue = total / 3;
          //saving color in rgb form
          const color = "rgb(" + red + "," + green + "," + blue + ")";
          const symbol = convertToSymbol(avgColorValue);
          //black background excluding dark and dim colours
          if (total > 200)
            this.#imageCellArray.push(new Cell(x, y, symbol, color));
        }
      }
    }
    //console.log(this.#imageCellArray);
  }
  #drawAscii() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    //calling draw on each cell

    for (let i = 0; i < this.#imageCellArray.length; i++) {
      this.#imageCellArray[i].draw(this.#ctx);
    }
  }
  //public
  draw(cellSize) {
    this.#scanImage(cellSize);
    this.#drawAscii();
  }
  erasePrevious() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
  }
}
let effect;

function handleSlider() {
  if (inputSlider.value == 1) {
    inputlabel.innerHTML = "Original Image";
    effect.erasePrevious();
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  } else {
    inputlabel.innerHTML = "RESOLUTION: " + inputSlider.value + "px";
    ctx.font = parseInt(inputSlider.value) + "px verdana";
    effect.draw(parseInt(inputSlider.value));
  }
}

image1.onload = function initialize() {
  canvas.width = image1.width;
  canvas.height = image1.height;
  effect = new AsciiEffect(ctx, image1.width, image1.height);
  handleSlider();
  //console.log(effect);
};

//when an image is dropped
//image1 sec is set and it triggers image1.onload
const dropzone_container = document.querySelector(".dropzone_container");
const intro_text = document.querySelector(".intro_text");
dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("active");

  dropzone_container.classList.add("hide");
  intro_text.classList.add("hide");

  container = document.querySelector(".container");
  container.classList.remove("hide");

  const file = event.dataTransfer.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.addEventListener("loadend", () => {
    const img = document.createElement("img");
    img.src = reader.result;
    image1.src = img.src;
  });
});

function download_image() {
  image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  var link = document.createElement("a");
  link.download = "ASCII_Art_Generator.png";
  link.href = image;
  link.click();
}

function reload() {
  // location.reload();
  dropzone_container.classList.remove("hide");
  intro_text.classList.remove("hide");
  container = document.querySelector(".container");
  container.classList.add("hide");
  document.getElementById("characters_field").value = "";
  characters[0] = "*";
  transparent = 128;
  const transparencySlider = document.querySelector("#transparency");
  transparencySlider.value = 1;
  // const main_container = document.querySelector(".main_container");
  // main_container.classList.add("hide");
}
