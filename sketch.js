p5.disableFriendlyErrors = true;
function setup() {
    let six = [0,1,2,3,4,5]
    createCanvas(windowWidth, windowHeight);
    // six.map(s => [0.11 + (0.12 * s), 0.2 * s]),
    // experiment
    /*
        six.map(s => [0.3, 0.2 * s]).concat(
            six.map(s => [0.2 * s, 0.5]))
        */
    /*
        six.map(s => [0.4 + (0.12 * s), 0.2 * s]),
        six.map(s => [0.3 + (0.12 * s), 0.2 * s]),
        six.map(s => [0.25 + (0.12 * s), 0.2 * s]),
        ----
        six.map(s => [(0.2 * s), 0.2 * s]),
     */
    window.ornamentRands = [
        six.map(s => [0.4 + (0.12 * s), 0.2 * s]),
        six.map(s => [0.3 + (0.12 * s), 0.2 * s]),
        six.map(s => [0.25 + (0.12 * s), 0.2 * s]),
    ];

    window.flakes = [...Array(50).keys()].map(i => [random(windowWidth), random(windowHeight)]);
}

// Based on https://stackoverflow.com/a/61804756/823592
function pointInTri(r1, r2, topx, topy, width, height) {
    let [tx, ty, h, w] = [topx, topy, height, width];
    let [Ax, Ay] = [tx, ty];
    let [Bx, By] = [tx + w / 2, ty + h];
    let [Cx, Cy] = [tx - w / 2, ty + h];
    let sqrtR1 = sqrt(r1);
    let x = (1 - sqrtR1) * Ax + (sqrtR1 * (1 - r2)) * Bx + (sqrtR1 * r2) * Cx;
    let y = (1 - sqrtR1) * Ay + (sqrtR1 * (1 - r2)) * By + (sqrtR1 * r2) * Cy;
    return [x, y];
}

function tri(topx, topy, width, height) {
    push()
    let [tx, ty, h, w] = [topx, topy, height, width];
    triangle(
        tx - w / 2, ty + h,
        tx, ty,
        tx + w / 2, ty + h
    )
    pop()
    return [ty + h , ty] ;
}

function drawBeadString(pts, color, w) {
    push()
    noFill();
    stroke('grey');
    strokeWeight(1);
    beginShape();
    for (let p of pts) { vertex(p[0], p[1]); }
    endShape();
    pop();

    push()
    stroke(color);
    strokeWeight(w * 0.02);
    for (let p of pts) { point(p[0], p[1]); }
    pop();
}

function randPtsInTri(orns, params) {
    let pts = [];
    for (let r of orns) {
        let pt = pointInTri(r[0], r[1], ...params);
        pts.push(pt);
    }
    return pts;
}

function draw() {
    background(6, 6, 6);
    let w = Math.min(width, height);
    let ww = width;
    let wh = height;
    stroke('black');
    fill(200, 200, 200, 50); //234
    // Ellipse center x/y
    let ec = [ww/2, wh/2];
    ellipse(...ec, w - 40, w - 40);

    noStroke();

    // Layers
    fill(40, 80, 50, 250);
    let params = [ ww / 2, (wh / 2), w * 0.4, w * 0.2];
    let [bottom, top] = tri(...params)
    // Trunk takes the bottom of the triangle 
    fill(100, 50, 50);
    let trunkw = w * 0.07;
    let trunkh = w * 0.09;
    rect((ww / 2) - (trunkw / 2), bottom, trunkw, trunkh);
    let trunkBottom = bottom + trunkh;
    drawBeadString(randPtsInTri(ornamentRands[0], params), 'red', w);
    fill(40, 90, 50, 250);
    params = [ww/ 2, bottom - (w * 0.25) , w * 0.35, w*0.17];
    [bottom, top] = tri(...params);
    drawBeadString(randPtsInTri(ornamentRands[1], params), 'red', w);
    fill(40, 100, 50, 250);
    params = [ww/ 2, bottom - (w * 0.23), w * 0.3, w*0.15];
    [bottom, top] = tri(...params);
    drawBeadString(randPtsInTri(ornamentRands[2], params), 'red', w);
    fill(40, 80, 50, 50);
    // star on top
    beginShape()
    angleMode(DEGREES);
    fill('yellow');
    strokeWeight(1);
    let starx = ww / 2;
    let stary = top;
    let star_lr = w * 0.05;
    let star_sr = star_lr / 2;
    // let thetaOff = random(-10, 10);
    for(let i = 0; i <= 5; i++) {
        let farAngle = i * (360 / 5) // + thetaOff * deltaTime;
        vertex(starx - star_lr * sin(farAngle), stary - star_lr * cos(farAngle));
        let closeAngle = farAngle + (360 / 10);
        vertex(starx - star_sr * sin(closeAngle), stary - star_sr * cos(closeAngle));
    }
    endShape();

    let dt = deltaTime / 1000;
    stroke(255, 255, 255, 200);
    strokeWeight(w * 0.01);
    for(let flake of flakes) {
        flake[1] += 50 * dt;
        if (flake[1] > wh) {
            flake[1] = 0;
            flake[0] = random(width);
        }

        flake[0] += 10 * dt;
        if (flake[0] > ww) {
            flake[0] = 0;
            flake[1] = random(height);
        }

        if ((dist(ec[0], ec[1], flake[0], flake[1]) < ((w / 2) - 40)) && (flake[1] < (trunkBottom))) {
            point(flake[0], flake[1]);
        }
    }
    noStroke();
    fill(40, 80, 50, 250);
    // let ec = [ww/2, wh/2];
    //ellipse(...ec, w - 40, w - 40);
    rect(ww * (0.1), trunkBottom,
        ww * 0.8, w * 0.2);
    //pop();
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

