const app = (a) => {
    console.log(a);
};

function plusOne(newsession, reset, response) {
    if (/false/.test(newsession) && reset === "false" && response) {
        let iscorrect = /true/.test(response);
        setTimeout(() => {
            $('<span class="plus-one"/>', {
                style: "display:none",
            })
                .css("color", `${iscorrect ? "limegreen" : "red"}`)
                .html(`+${iscorrect ? 1 : 0}`)
                .appendTo($(".container-grid "))
                .fadeIn("1000", () => {
                    let score = $("#score-head > h5 > strong");
                    var e = $(".plus-one");
                    setTimeout(() => {
                        console.log("timeout");
                        e.remove();
                    }, 2000);
                });
        }, 100);
    }
}

function checkevent() {
    let ev = window.performance.getEntriesByType("navigation")[0].type;
    if (ev === "reload") {
        fetch("/capitalsQuiz/reset").then((res) => {
            window.history.replaceState(null, null, window.location.href);
        });
    }
}

const SVGZoom = () => {
    window.addEventListener("DOMContentLoaded", (event) => {
        const svg = document.querySelector("svg");

        // zooming
        svg.onwheel = function (event) {
            event.preventDefault();

            // set the scaling factor (and make sure it's at least 10%)
            let scale = event.deltaY / 1000;
            scale =
                Math.abs(scale) < 0.1
                    ? (0.1 * event.deltaY) / Math.abs(event.deltaY)
                    : scale;

            // get point in SVG space
            let pt = new DOMPoint(event.clientX, event.clientY);
            pt = pt.matrixTransform(svg.getScreenCTM().inverse());

            // get viewbox transform
            let [x, y, width, height] = svg
                .getAttribute("viewBox")
                .split(" ")
                .map(Number);

            // get pt.x as a proportion of width and pt.y as proportion of height
            let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

            // calc new width and height, new x2, y2 (using proportions and new width and height)
            let [width2, height2] = [width + width * scale, height + height * scale];
            let x2 = pt.x - xPropW * width2;
            let y2 = pt.y - yPropH * height2;

            svg.setAttribute("viewBox", `${x2} ${y2} ${width2} ${height2}`);
        };
    });
};

const renderScroll = (svg, axis, direction) => {
    const shiftScale = 0.99;

    let VB = svg.getAttribute("viewBox").split(" ").map(Number);
    let val =
        shiftScale * VB[axis] +
        (VB[axis] + 0.5 * direction * VB[2 + axis]) * (1 - shiftScale);

    VB.splice(axis, 1, val);
    svg.setAttribute("viewBox", VB.join(" "))
};
const svgScroll = () => {


    window.addEventListener("DOMContentLoaded", (event) => {
        let svg = document.querySelector("svg");
        let drag = false;
        let pointerLoc = { x: 0, y: 0 };
        let offset;

        svg.addEventListener("mousedown", (event) => {
            drag = true;
            offset = { x: event.offsetX, y: event.offsetY };
        });

        svg.addEventListener("mousemove", (event) => {
            if (drag) {
                let leftOrRight =
                    event.clientX > pointerLoc.x
                        ? "left"
                        : event.clientX < pointerLoc.x
                            ? "right"
                            : "none";

                let upOrDown =
                    event.clientY > pointerLoc.y
                        ? "up"
                        : event.clientY < pointerLoc.y
                            ? "down"
                            : "none";

                switch (true) {
                    case leftOrRight === "left":

                        console.log("left");
                        renderScroll(svg, 0, -1)
                        break;


                    case leftOrRight === "right":


                        console.log("right");
                        renderScroll(svg, 0, 1)
                        break;


                    case upOrDown === "up":

                        console.log("up");
                        renderScroll(svg, 1, -1)
                        break;

                    case upOrDown === "down":

                        console.log("down");
                        renderScroll(svg, 1, 1)
                        break;
                }


                pointerLoc.x = event.clientX;
                pointerLoc.y = event.clientY;
            }
        });

        svg.addEventListener("mouseup", (event) => {
            drag = false;
        });
    });
};

export { app, plusOne, checkevent, SVGZoom, svgScroll };
