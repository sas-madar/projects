const holders = document.getElementsByClassName("card-holder");


function updateArrows(content) {
    const leftArrow = content.querySelector(".arrow.left");
    const rightArrow = content.querySelector(".arrow.right");
    const arrows = content.querySelectorAll(".arrow");

    const hasOverflow = content.scrollWidth > content.clientWidth;

    leftArrow.hidden = !hasOverflow || content.scrollLeft === 0;
    rightArrow.hidden =
        !hasOverflow ||
        content.scrollLeft + content.clientWidth >= content.scrollWidth;
    
    arrows.forEach(arr => {
        arr.style.height = `calc(${content.clientHeight}px - 1em)`;
        arr.style.top = `${content.getBoundingClientRect().top}px`;
    });
}

function updateAllArrows() {
    for (let i = 0; i < holders.length; i++) {
        const content = holders[i];

        const leftArrow = content.querySelector(".arrow.left");
        const rightArrow = content.querySelector(".arrow.right");
        const arrows = content.querySelectorAll(".arrow");
        
        const hasOverflow = content.scrollWidth > content.clientWidth;
        
        leftArrow.hidden = !hasOverflow || content.scrollLeft === 0;
        rightArrow.hidden =
        !hasOverflow ||
        content.scrollLeft + content.clientWidth >= content.scrollWidth;
        
        arrows.forEach(arrow => {
            arrow.style.height = `calc(${content.clientHeight}px - 1em)`;
            arrow.style.top = `${content.getBoundingClientRect().top}px`;
        });
    }
}

function scrollElement(el, direction){
    const scrollAm = 0.7
    if(direction == "right"){
        el.scrollLeft += el.clientWidth * scrollAm
    }
    else if(direction == "left"){
        el.scrollLeft -= el.clientWidth * scrollAm
    }
}

document.querySelector("main").addEventListener("scroll", updateAllArrows);
window.addEventListener("resize", updateAllArrows);

for (let i = 0; i < holders.length; i++) {
    const content = holders[i];
    content.addEventListener("scroll", () => {updateArrows(content)});

}

document.addEventListener("DOMContentLoaded", () => {setTimeout(updateAllArrows, 1);});

document.querySelectorAll(".arrow").forEach(arrow => {
    arrow.addEventListener("click", (click) => {
        const parent = click.target.parentElement
        const right = click.target.classList.contains("right")
        scrollElement(parent, right ? "right" : "left")
    });
});