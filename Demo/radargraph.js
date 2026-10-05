// =====================================================
// RAW RADAR DATA
// =====================================================

const swimmerRadarData = {
    "1": 256.0,
    "2": 172.33333333333334,
    "3": 170.5,
    "4": 249.66666666666669,
    "5": "",
    "d": 224.65314834578442
};


// Replace missing strokes with 0
const strokes = ["1", "2", "3", "4", "5"];

for (const stroke of strokes) {
    if (swimmerRadarData[stroke] === undefined) {
        swimmerRadarData[stroke] = 0;
    }
}


// =====================================================
// RADAR DATA
// =====================================================

const radarData = [
    { name: "Free", value: swimmerRadarData["1"] },
    { name: "Back", value: swimmerRadarData["2"] },
    { name: "Breast", value: swimmerRadarData["3"] },
    { name: "Fly", value: swimmerRadarData["4"] },
    { name: "IM", value: swimmerRadarData["5"] }
];


// =====================================================
// RADAR GRAPH
// =====================================================

const radarCanvas = document.getElementById("radarGraph");
const rctx = radarCanvas.getContext("2d");

const radarLevels = 5;

// Your original chart used suggestedMax: 1000
const radarMax = 1000;

const radarGridColor = "rgba(255,255,255,0.18)";
const radarTextColor = "#ffffff";


// =====================================================
// ORIGINAL COLOR CALCULATOR
// =====================================================

function colorCalculator(distance, alpha) {

    distance = distance * 2.55;

    return (
        "rgba(" +
        String(255 - parseInt(distance / 10)) +
        ",0," +
        String(parseInt(distance / 10)) +
        "," +
        String(alpha) +
        ")"
    );
}


// Color based on d
const radarColor =
    colorCalculator(swimmerRadarData["d"], 1);


// Slightly transparent version for fill
const radarFillColor =
    colorCalculator(swimmerRadarData["d"], 0.65);


// =====================================================
// DRAW
// =====================================================

function drawRadarGraph() {

    rctx.clearRect(
        0,
        0,
        radarCanvas.width,
        radarCanvas.height
    );


    // -----------------------------------------------
    // RESPONSIVE SIZING
    // -----------------------------------------------

    const width = radarCanvas.width;
    const height = radarCanvas.height;

    const size = Math.min(width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    const radius = size * 0.32;

    const fontSize =
        Math.max(10, size * 0.035);

    const dataLineWidth =
        Math.max(1, size * 0.004);

    const gridLineWidth =
        Math.max(0.5, size * 0.002);

    const labelDistance =
        radius + size * 0.075;


    // -----------------------------------------------
    // GET RADAR POSITION
    // -----------------------------------------------

    function radarPosition(index, distance) {

        const angle =
            (Math.PI * 2 / radarData.length) * index
            - Math.PI / 2;

        return {
            x:
                centerX +
                Math.cos(angle) * distance,

            y:
                centerY +
                Math.sin(angle) * distance
        };
    }


    // =================================================
    // GRID RINGS
    // =================================================

    for (
        let level = 1;
        level <= radarLevels;
        level++
    ) {

        const levelRadius =
            radius * (level / radarLevels);

        rctx.beginPath();


        for (
            let i = 0;
            i < radarData.length;
            i++
        ) {

            const pos =
                radarPosition(
                    i,
                    levelRadius
                );

            if (i === 0) {
                rctx.moveTo(pos.x, pos.y);
            } else {
                rctx.lineTo(pos.x, pos.y);
            }
        }


        rctx.closePath();

        rctx.strokeStyle = radarGridColor;
        rctx.lineWidth = gridLineWidth;

        rctx.stroke();
    }


    // =================================================
    // CENTER → OUTSIDE LINES
    // =================================================

    for (
        let i = 0;
        i < radarData.length;
        i++
    ) {

        const pos =
            radarPosition(i, radius);

        rctx.beginPath();

        rctx.moveTo(
            centerX,
            centerY
        );

        rctx.lineTo(
            pos.x,
            pos.y
        );

        rctx.strokeStyle = radarGridColor;
        rctx.lineWidth = gridLineWidth;

        rctx.stroke();
    }


    // =================================================
    // DATA SHAPE
    // =================================================

    rctx.beginPath();


    radarData.forEach((item, index) => {

        const value =
            Math.max(
                0,
                Math.min(item.value, radarMax)
            );

        const distance =
            radius *
            (value / radarMax);

        const pos =
            radarPosition(
                index,
                distance
            );


        if (index === 0) {
            rctx.moveTo(pos.x, pos.y);
        } else {
            rctx.lineTo(pos.x, pos.y);
        }
    });


    rctx.closePath();


    // Fill
    rctx.fillStyle = radarFillColor;
    rctx.fill();


    // Border
    rctx.strokeStyle = radarColor;
    rctx.lineWidth = dataLineWidth;

    rctx.lineJoin = "round";

    rctx.stroke();


    // =================================================
    // LABELS
    // =================================================

    rctx.font =
        `${fontSize}px Arial`;

    rctx.fillStyle =
        radarTextColor;


    radarData.forEach((item, index) => {

        const pos =
            radarPosition(
                index,
                labelDistance
            );


        // Horizontal alignment
        if (pos.x < centerX - 5) {

            rctx.textAlign = "right";

        } else if (
            pos.x > centerX + 5
        ) {

            rctx.textAlign = "left";

        } else {

            rctx.textAlign = "center";
        }


        // Vertical alignment
        if (pos.y < centerY - 5) {

            rctx.textBaseline = "bottom";

        } else if (
            pos.y > centerY + 5
        ) {

            rctx.textBaseline = "top";

        } else {

            rctx.textBaseline = "middle";
        }


        rctx.fillText(
            item.name,
            pos.x,
            pos.y
        );
    });
}


// Draw graph
drawRadarGraph();