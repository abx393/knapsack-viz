const width = 1100;
const height = 400;
const treeDepth = 4;
const ellipsesHeight = 100;

const animationInterval = 1000;
let nodes = [];
let nodeIdx = 0;
let nodeTexts = ['n=10,W=10', 'n=9,W=10', 'n=8,W=10', 'n=7,W=10',
                'n=7,W=8', 'n=8,W=7', 'n=7, W=7', 'n=7,W=5', 'n=9,W=7', 'n=8,W=7', 'n=7,W=7', 'n=7,W=5', 'n=8,W=4', 'n=7,W=4', 'n=7,W=2'];
let cnt = 0;

function drawRecursionTree() {
    let canvas = document.getElementById("recursion-canvas");
    canvas.height = height;
    canvas.width = width;

    let ctx = canvas.getContext("2d");

    drawTree(ctx, {
        'startx': 0,
        'starty': 0,
        'endx': width,
        'endy': (height - ellipsesHeight) / treeDepth,
        'levels': treeDepth
    });

    drawVerticalEllipses(ctx);
    drawLeftDiagEllipses(ctx);
    drawRightDiagEllipses(ctx);
    setInterval(highlightNode, animationInterval, ctx, {});
}

function drawVerticalEllipses(ctx) {
    let radius = 7;

    for (let i = 0; i < 3; i++) {
        drawCircle(ctx, {
            'centerX': width / 2,
            'centerY': height - ellipsesHeight + (i+1) * (ellipsesHeight - 10) / 3,
            'radius': radius
        });
    }
}

function drawLeftDiagEllipses(ctx) {
    let radius = 7;

    for (let i = 0; i < 3; i++) {
        drawCircle(ctx, {
            'centerX': width / 9 - i * 30,
            'centerY': height - ellipsesHeight + (i+1) * (ellipsesHeight - 10) / 3,
            'radius': radius
        });
    }
}

function drawRightDiagEllipses(ctx) {
    let radius = 7;

    for (let i = 0; i < 3; i++) {
        drawCircle(ctx, {
            'centerX': 8 * width / 9 + i * 30,
            'centerY': height - ellipsesHeight + (i+1) * (ellipsesHeight - 10) / 3,
            'radius': radius
        });
    }
}

function drawCircle(ctx, circleProps) {
    ctx.beginPath();
    ctx.arc(
        circleProps.centerX,
        circleProps.centerY,
        circleProps.radius,
        0,
        2 * Math.PI,
        false
    );
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.line
}

function drawTree(ctx, treeProps) {
    if (treeProps.levels === 0) {
        return;
    }

    let nodeProps = {
        'startx': treeProps.startx,
        'starty': treeProps.starty,
        'endx': treeProps.endx,
        'endy': (treeProps.starty + treeProps.endy) / 2
    };
    drawNode(ctx, nodeProps);

    let branchProps = {
        'startx': treeProps.startx,
        'starty': (treeProps.starty + treeProps.endy) / 2,
        'endx': treeProps.endx,
        'endy': treeProps.endy
    };
    drawLeftBranch(ctx, branchProps);
    drawRightBranch(ctx, branchProps);

    // draw left subtree
    drawTree(ctx, {
        'startx': treeProps.startx,
        'starty': treeProps.endy,
        'endx': (treeProps.startx + treeProps.endx) / 2,
        'endy': treeProps.endy + (treeProps.endy - treeProps.starty),
        'levels': treeProps.levels - 1,
    });

    // draw right subtree
    drawTree(ctx, {
        'startx': (treeProps.startx + treeProps.endx) / 2,
        'starty': treeProps.endy,
        'endx': treeProps.endx,
        'endy': treeProps.endy + (treeProps.endy - treeProps.starty),
        'levels': treeProps.levels - 1,
    });
}

function drawNode(ctx, props) {
    let rectProps = {
        'topLeftX': props.startx + (props.endx - props.startx) / 4,
        'topLeftY': props.starty,
        'width': (props.endx - props.startx) / 2,
        'height': (props.endy - props.starty),
        'lineWidth': 1
    };
    nodes.push(rectProps);
    drawRectCanvas(ctx, rectProps);

    ctx.fillStyle = 'black';
    ctx.font = "13px Arial";
    ctx.fillText(nodeTexts[nodeIdx], (props.startx + props.endx) / 2 - 32, (props.starty + props.endy) / 2);

    nodeIdx = (nodeIdx + 1) % nodeTexts.length;
}

function highlightNode(ctx, props) {
    console.log('nodeIdx ' + nodeIdx);

    if (nodeIdx === 0) {
        resetCanvas(ctx);
    }

    let rectProps = nodes[nodeIdx];
    rectProps['color'] = 'cadetblue';
    rectProps['lineWidth'] = 5;
    drawRectCanvas(ctx, rectProps);

    nodeIdx = (nodeIdx + 1) % nodeTexts.length;
}

function resetCanvas(ctx) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    drawTree(ctx, {
        'startx': 0,
        'starty': 0,
        'endx': width,
        'endy': (height - ellipsesHeight) / treeDepth,
        'levels': treeDepth
    });

    drawVerticalEllipses(ctx);
    drawLeftDiagEllipses(ctx);
    drawRightDiagEllipses(ctx);
}

function drawLeftBranch(ctx, props) {
    drawLineCanvas(ctx, (props.startx + props.endx) / 2, props.starty, props.startx + (props.endx - props.startx) / 4, props.endy);
}

function drawRightBranch(ctx, props) {
    drawLineCanvas(ctx, (props.startx + props.endx) / 2, props.starty, props.startx + 3 * (props.endx - props.startx) / 4, props.endy);
}

function drawLineCanvas(ctx, startx, starty, endx, endy, width) {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
    ctx.stroke();
}

function drawRectCanvas(ctx, props) {
    ctx.beginPath();
    ctx.rect(props.topLeftX, props.topLeftY, props.width, props.height);
    ctx.strokeStyle = props.color;
    ctx.lineWidth = props.lineWidth;
    ctx.stroke();
}

function fillRectCanvas(ctx, props) {
    ctx.beginPath();
    ctx.fillStyle = props.color;
    ctx.fillRect(props.topLeftX, props.topLeftY, props.width, props.height);
}
