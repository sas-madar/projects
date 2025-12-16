const content = document.getElementById("overflow");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");
const arrows = document.querySelectorAll(".arrow");


function updateArrows() {
    const hasOverflow = content.scrollWidth > content.clientWidth;

    leftArrow.hidden = !hasOverflow || content.scrollLeft === 0;
    rightArrow.hidden =
        !hasOverflow ||
        content.scrollLeft + content.clientWidth >= content.scrollWidth;
    
    arrows.forEach(arr => {
        console.log(arr)
        arr.style.height = `${content.clientHeight}px`
    });
    
}

content.addEventListener("scroll", updateArrows);
window.addEventListener("resize", updateArrows);
document.addEventListener("DOMContentLoaded", setTimeout(updateArrows, 1))