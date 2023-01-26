function addGif(containerElement, gifFileSource) {
  const gifContainer = document.createElement("div");
  gifContainer.className = "gif-container";
  const gifImage = document.createElement("img");
  gifImage.src = gifFileSource;
  gifContainer.appendChild(gifImage);
  containerElement.appendChild(gifContainer);
}

window.onload = function () {
  let hasTouchScreen = false;

  if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
      hasTouchScreen = !!mQ.matches;
    } else if ("orientation" in window) {
      hasTouchScreen = true; // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      var UA = navigator.userAgent;
      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }

  // Get the container element where the images will be displayed
  const container = document.getElementById("container");

  // Get the list of image file names from the server
  const imageList = city_names;

  // Create an array of image elements from the list of file names
  const images = imageList.map((fileName) => {
    const image = document.createElement("img");
    image.src = `compressed/${fileName}.png`;
    return image;
  });

  const leftContainer = document.getElementById("left-container");
  addGif(leftContainer, "content/fcn.gif");
  addGif(leftContainer, "content/franken.gif");
  addGif(leftContainer, "content/fcn_spin.gif");
  addGif(leftContainer, "content/franken.gif");
  addGif(leftContainer, "content/fcn.gif");

  const rightContainer = document.getElementById("right-container");
  addGif(rightContainer, "content/fcn.gif");
  addGif(rightContainer, "content/franken.gif");
  addGif(rightContainer, "content/fcn_spin.gif");
  addGif(rightContainer, "content/franken.gif");
  addGif(rightContainer, "content/fcn.gif");

  // Calculate the number of rows and columns needed to display all the images
  const numRows = Math.ceil(Math.sqrt(images.length));
  const numCols = Math.ceil(images.length / numRows);

  function toggleBlur() {
    this.classList.toggle("blur");
  }

  document
    .getElementById("focus-view")
    .addEventListener("click", function (event) {
      this.style.display = "none";
      const containerOverlay = document.getElementById("container-overlay");
      containerOverlay.style.display = "none";
    });

  var clickEvent = (function () {
    if ("ontouchstart" in document.documentElement === true)
      return "touchend";
    else return "click";
  })();

  for (let i = 0; i < imageList.length; i++) {
    const location_name = imageList[i];
    const gridItem = document.createElement("div");
    const imageElement = document.createElement("img");
    imageElement.id = location_name;
    gridItem.appendChild(imageElement);
    gridItem.className = "grid-item";

    gridItem.addEventListener(clickEvent, (event) => {
      const focusView = document.getElementById("focus-view");
      const focusImg = document.getElementById("focus-image");
      const movingText = document.getElementsByClassName("location-text");
      const containerOverlay = document.getElementById("container-overlay");
      focusView.style.display = "flex";
      focusImg.src = imageElement.src;
      for (let movingTextObj of movingText) {
        movingTextObj.innerHTML = (location_name + "  ").repeat(100);
      }
      containerOverlay.style.display = "block";
    });

    gridItem.addEventListener("mouseenter", (event) => {
      anime({
        targets: gridItem,
        scale: 1.1,
      });
      gridItem.style.zIndex = 5;
    });

    gridItem.addEventListener("mouseleave", (event) => {
      anime({
        targets: gridItem,
        scale: 1,
      });
      gridItem.style.zIndex = 0;
    });

    container.appendChild(gridItem);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting === true) {
        const img = entry.target.querySelector("img");
        entry.target.classList.add("inview");
        img.src = `compressed/${img.id}.png`;
        img.style.height = "100%";
      } else {
        entry.target.classList.remove("inview");
      }
    });
  });

  const items = document.querySelectorAll(".grid-item");
  items.forEach((item, index) => {
    observer.observe(item, index);
  });
};
