// =====================================================
// FULL SWIMMER DATA
// =====================================================

const data = [
    {
        year_label: "2022",
        score: 53.34,
        fastest_times: [
            { event: "50 Y Free", time: "45.37" },
            { event: "50 Y Back", time: "52.41" },
            { event: "100 Y Free", time: "1:53.67" }
        ]
    },
    {
        year_label: "2023",
        score: 89.5,
        fastest_times: [
            { event: "50 Y Free", time: "36.96" },
            { event: "100 Y Free", time: "1:30.30" },
            { event: "100 Y Back", time: "1:51.26" },
            { event: "50 Y Back", time: "53.48" },
            { event: "100 Y Breast", time: "2:17.90" }
        ]
    },
    {
        year_label: "2025",
        score: 152.65,
        fastest_times: [
            { event: "50 Y Free", time: "32.18" },
            { event: "100 Y Free", time: "1:13.73" },
            { event: "50 Y Fly", time: "40.00" },
            { event: "50 Y Breast", time: "48.22" },
            { event: "100 Y Fly", time: "1:31.48" }
        ]
    },
    {
        year_label: "2026",
        score: 251.9,
        fastest_times: [
            { event: "50 L Free", time: "32.69" },
            { event: "50 L Fly", time: "35.18" },
            { event: "100 Y Fly", time: "1:10.11" },
            { event: "100 Y Free", time: "1:05.38" },
            { event: "50 Y Free", time: "29.26" }
        ]
    }
];


// =====================================================
// CANVAS
// =====================================================

const canvas = document.getElementById("lineGraph");
const ctx = canvas.getContext("2d");

const padding = {
    left: 65,
    right: 35,
    top: 35,
    bottom: 55
};

const GRID_SIZE = 50;

const CURVE_COLOR = "#4d91ff";
const GRID_COLOR = "rgba(255,255,255,0.15)";
const TEXT_COLOR = "#ffffff";

const POINT_RADIUS = 6;


// =====================================================
// PREPARE DATA
// =====================================================

data.sort(
    (a, b) =>
        Number(a.year_label) - Number(b.year_label)
);

const minX = Math.min(
    ...data.map(d => Number(d.year_label))
);

const maxX = Math.max(
    ...data.map(d => Number(d.year_label))
);

const highestValue = Math.max(
    ...data.map(d => d.score)
);

const maxY =
    Math.ceil(highestValue / GRID_SIZE) * GRID_SIZE;


// =====================================================
// SCALE
// =====================================================

function scaleX(year) {

    if (maxX === minX)
        return canvas.width / 2;

    return padding.left +
        ((year - minX) / (maxX - minX)) *
        (canvas.width - padding.left - padding.right);
}


function scaleY(value) {

    return canvas.height - padding.bottom -
        (value / maxY) *
        (canvas.height - padding.top - padding.bottom);
}


// =====================================================
// SCREEN POINTS
// IMPORTANT: Keep reference to full data object
// =====================================================

const screenPoints = data.map(item => ({
    x: scaleX(Number(item.year_label)),
    y: scaleY(item.score),

    // Full data for hover
    data: item
}));


// =====================================================
// DRAW GRAPH
// =====================================================

function drawGraph() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =================================================
    // HORIZONTAL GRID
    // =================================================

    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (
        let value = 0;
        value <= maxY;
        value += GRID_SIZE
    ) {

        const y = scaleY(value);

        ctx.beginPath();

        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;

        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);

        ctx.stroke();


        ctx.fillStyle = TEXT_COLOR;

        ctx.fillText(
            value,
            padding.left - 12,
            y
        );
    }


    // =================================================
    // YEAR LABELS
    // =================================================

    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = TEXT_COLOR;

    for (let year = minX; year <= maxX; year++) {

        ctx.fillText(
            year,
            scaleX(year),
            canvas.height - padding.bottom + 15
        );
    }


    // =================================================
    // SMOOTH CURVE
    // =================================================

    if (screenPoints.length >= 2) {

        ctx.beginPath();

        ctx.moveTo(
            screenPoints[0].x,
            screenPoints[0].y
        );


        for (
            let i = 0;
            i < screenPoints.length - 1;
            i++
        ) {

            const p0 =
                screenPoints[i - 1] ||
                screenPoints[i];

            const p1 =
                screenPoints[i];

            const p2 =
                screenPoints[i + 1];

            const p3 =
                screenPoints[i + 2] ||
                p2;


            // Catmull-Rom -> Bezier
            const cp1x =
                p1.x + (p2.x - p0.x) / 6;

            const cp1y =
                p1.y + (p2.y - p0.y) / 6;

            const cp2x =
                p2.x - (p3.x - p1.x) / 6;

            const cp2y =
                p2.y - (p3.y - p1.y) / 6;


            ctx.bezierCurveTo(
                cp1x,
                cp1y,

                cp2x,
                cp2y,

                p2.x,
                p2.y
            );
        }


        ctx.strokeStyle = CURVE_COLOR;
        ctx.lineWidth = 3;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.stroke();
    }


    // =================================================
    // POINTS
    // =================================================

    screenPoints.forEach(point => {

        ctx.beginPath();

        ctx.arc(
            point.x,
            point.y,
            POINT_RADIUS,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = CURVE_COLOR;
        ctx.fill();

        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 2;

        ctx.stroke();
    });
}


// Initial draw
drawGraph();


// =====================================================
// TOOLTIP
// =====================================================

const tooltip = document.createElement("div");

tooltip.style.position = "fixed";
tooltip.style.display = "none";

tooltip.style.background = "rgba(28, 28, 28, 0.97)";
tooltip.style.border = "1px solid rgba(46,46,46,1)";
tooltip.style.borderRadius = "8px";

tooltip.style.padding = "12px 14px";

tooltip.style.color = "white";
tooltip.style.fontFamily = "Arial, sans-serif";
tooltip.style.fontSize = "13px";

tooltip.style.pointerEvents = "none";

tooltip.style.boxShadow =
    "0 8px 25px rgba(0,0,0,0.35)";

tooltip.style.zIndex = "9999";

tooltip.style.minWidth = "180px";

document.body.appendChild(tooltip);


// =====================================================
// MOUSE HOVER
// =====================================================

canvas.addEventListener("mousemove", function (event) {

    const rect = canvas.getBoundingClientRect();

    // Correct mouse position even if canvas
    // is resized using CSS
    const mouseX =
        (event.clientX - rect.left) *
        (canvas.width / rect.width);

    const mouseY =
        (event.clientY - rect.top) *
        (canvas.height / rect.height);


    let hoveredPoint = null;


    // =================================================
    // FIND POINT UNDER MOUSE
    // =================================================

    for (const point of screenPoints) {

        const dx = mouseX - point.x;
        const dy = mouseY - point.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);


        // Larger hover radius makes it easier
        // to activate the tooltip
        if (distance <= 15) {

            hoveredPoint = point;
            break;
        }
    }


    // =================================================
    // NOT HOVERING A POINT
    // =================================================

    if (!hoveredPoint) {

        tooltip.style.display = "none";

        canvas.style.cursor = "default";

        drawGraph();

        return;
    }


    canvas.style.cursor = "pointer";


    // =================================================
    // HIGHLIGHT HOVERED POINT
    // =================================================

    drawGraph();

    ctx.beginPath();

    ctx.arc(
        hoveredPoint.x,
        hoveredPoint.y,
        POINT_RADIUS + 3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = CURVE_COLOR;
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.stroke();


    // =================================================
    // CREATE TOOLTIP
    // =================================================

    const item = hoveredPoint.data;


    let fastestTimesHTML = "";


    if (
        item.fastest_times &&
        item.fastest_times.length > 0
    ) {

        fastestTimesHTML = `

            <div style="
                margin-top:10px;
                padding-top:8px;
                border-top:1px solid rgba(255,255,255,0.15);
            ">

                <div style="
                    font-size:11px;
                    color:#94a3b8;
                    margin-bottom:6px;
                    text-transform:uppercase;
                    letter-spacing:.5px;
                ">
                    Fastest Times
                </div>

        `;


        item.fastest_times.forEach(swim => {

            fastestTimesHTML += `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:20px;
                    margin:4px 0;
                ">

                    <span style="color:#3fc6fc;">
                        ${swim.event}
                    </span>

                    <strong>
                        ${swim.time}
                    </strong>

                </div>

            `;
        });


        fastestTimesHTML += `</div>`;
    }


    tooltip.innerHTML = `

        <div style="
            font-size:16px;
            font-weight:bold;
            margin-bottom:5px;
        ">
            ${item.year_label}
        </div>

        <div>
            Score:
            <strong style="color:#3fc6fc;">
                ${item.score}
            </strong>
        </div>

        ${fastestTimesHTML}

    `;


    // =================================================
    // TOOLTIP POSITION
    // =================================================

    tooltip.style.display = "block";

    let left =
        event.clientX + 18;

    let top =
        event.clientY + 18;


    // Keep tooltip from going off right side
    if (
        left + tooltip.offsetWidth >
        window.innerWidth - 10
    ) {

        left =
            event.clientX -
            tooltip.offsetWidth -
            18;
    }


    // Keep tooltip from going off bottom
    if (
        top + tooltip.offsetHeight >
        window.innerHeight - 10
    ) {

        top =
            event.clientY -
            tooltip.offsetHeight -
            18;
    }


    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
});


// =====================================================
// HIDE TOOLTIP WHEN MOUSE LEAVES
// =====================================================

canvas.addEventListener("mouseleave", function () {

    tooltip.style.display = "none";

    canvas.style.cursor = "default";

    drawGraph();
});