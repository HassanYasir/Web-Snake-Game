if (tailColumnStyle === bodyColumnStyle && inputDir.position === "right") {
  Lastbox.style.transform = "rotate(360deg)";
}
if (tailColumnStyle === bodyColumnStyle && inputDir.position === "left") {
  Lastbox.style.transform = "rotate(-360deg)";
}
if (
  tailColumnStyle === bodyColumnStyle &&
  parseInt(tailRowStyle) === parseInt(bodyRowStyle) - 1 &&
  inputDir.position === "left"
) {
  Lastbox.style.transform = "rotate(-180deg)";
}
if (
  tailColumnStyle === bodyColumnStyle &&
  parseInt(tailRowStyle) === parseInt(bodyRowStyle) - 1 &&
  inputDir.position === "right"
) {
  Lastbox.style.transform = "rotate(180deg)";
}
if (tailRowStyle === bodyRowStyle && inputDir.position === "up") {
  Lastbox.style.transform = "rotate(-90deg)";
}
if (tailRowStyle === bodyRowStyle && inputDir.position === "down") {
  Lastbox.style.transform = "rotate(90deg)";
}
if (
  tailRowStyle === bodyRowStyle &&
  parseInt(Lastbox.style["grid-column-start"]) ===
    parseInt(boxes[boxes.length - 2].style["grid-column-start"]) - 1 &&
  inputDir.position === "up"
) {
  Lastbox.style.transform = "rotate(90deg)";
}
if (
  tailRowStyle === bodyRowStyle &&
  parseInt(Lastbox.style["grid-column-start"]) ===
    parseInt(boxes[boxes.length - 2].style["grid-column-start"]) + 1 &&
  inputDir.position === "down"
) {
  Lastbox.style.transform = "rotate(-90deg)";
}
if (
  parseInt(tailRowStyle) === parseInt(bodyRowStyle) - 1 &&
  parseInt(boxes[0].style["grid-row-start"]) ===
    parseInt(head.style["grid-row-start"]) + 1
) {
  Lastbox.style.transform = "rotate(180deg)";
}
if (
  parseInt(Lastbox.style["grid-row-start"]) ===
    parseInt(boxes[boxes.length - 2].style["grid-row-start"]) + 1 &&
  parseInt(boxes[0].style["grid-row-start"]) ===
    parseInt(head.style["grid-row-start"]) - 1
) {
  Lastbox.style.transform = "rotate(360deg)";
}
if (
  parseInt(Lastbox.style["grid-column-start"]) ===
    parseInt(boxes[boxes.length - 2].style["grid-column-start"]) - 1 &&
  parseInt(boxes[0].style["grid-column-start"]) ===
    parseInt(head.style["grid-column-start"]) + 1
) {
  Lastbox.style.transform = "rotate(90deg)";
}
if (
  parseInt(Lastbox.style["grid-column-start"]) ===
    parseInt(boxes[boxes.length - 2].style["grid-column-start"]) + 1 &&
  parseInt(boxes[0].style["grid-column-start"]) ===
    parseInt(head.style["grid-column-start"]) - 1
) {
  Lastbox.style.transform = "rotate(-90deg)";
}
