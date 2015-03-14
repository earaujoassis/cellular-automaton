(function (w, d) {
    "use strict";

    var SquareGol = function () {
        this.gridMatrix;
        this.gridContainer;
        this.population;
        return this;
    };

    SquareGol.prototype.readySet = [];
    SquareGol.prototype.generationInterval = 200;
    SquareGol.prototype.gridElementId = "#squaregol-grid";
    SquareGol.prototype.cellsX = 0;
    SquareGol.prototype.cellsY = 0;
    SquareGol.prototype.alreadyDrawn = false;
    SquareGol.prototype.generation = 1;
    SquareGol.prototype.globalWidth = 10;

    SquareGol.prototype.set = function (customOptions) {
        var options = {}
          , self = this
          , gridContainerElement;

        if (typeof customOptions !== "object") {
            customOptions = {};
        }

        options.generationInterval = customOptions.generationInterval || self.generationInterval;
        options.gridElementId = customOptions.gridElementId || self.gridElementId;
        options.cellsX = customOptions.cellsX || self.cellsX;
        options.cellsY = customOptions.cellsY || self.cellsY;
        options.alive = customOptions.alive || [];

        if (!self.domReady) {
            self.readySet.push(function () { self.set(options); });
            return self;
        }

        if (!Snap) {
            console.log("SquareGol: Snap.svg was not loaded, it seems, indeed.");
            return self;
        }

        gridContainerElement = d.getElementById(options.gridElementId.replace("#", ""));
        gridContainerElement.style.width = ((options.cellsX * self.globalWidth) + "px");
        gridContainerElement.style.height = ((options.cellsY * self.globalWidth) + "px");
        self.gridContainer = Snap(options.gridElementId);
        self.gridMatrix = new Array(options.cellsY);
        /*jshint -W081 */
        for (var i = 0, length = self.gridMatrix.length; i < length; i += 1) {
            self.gridMatrix[i] = new Array(options.cellsX);
            for (var j = 0, length = self.gridMatrix[i].length; j < length; j += 1) {
                self.gridMatrix[i][j] = 0;
            }
        }
        /*jshint +W081 */

        if (options.alive) {
            /*jshint -W081 */
            for (var i = 0, length = options.alive.length; i < length; i += 1) {
                var position = options.alive[i]
                  , x, y;

                x = position[0] - 1;
                y = position[1] - 1;
                self.gridMatrix[y][x] = 1;
            }
            /*jshint +W081 */
        }

        return self;
    };

    SquareGol.prototype.draw = function () {
        var self = this
          , oldElements
          , element;

        if (!self.domReady) {
            self.readySet.push(function () { self.draw(); });
            return self;
        }

        if (!self.alreadyDrawn) {
            self.gridContainer.clear();

            /*jshint -W081 */
            for (var i = 0, lengthY = self.gridMatrix.length; i < lengthY; i += 1) {
                for (var j = 0, lengthX = self.gridMatrix[i].length; j < lengthX; j += 1) {
                    element = self.gridContainer.rect(j * self.globalWidth, i * self.globalWidth, self.globalWidth, self.globalWidth);
                    //element = drawHexagon(self.gridContainer, j * 15, i * 15, 15, 15);
                    if (self.gridMatrix[i][j] == 1) {
                        element.node.setAttribute("class", "alive");
                    } else {
                        element.node.setAttribute("class", "dead");
                    }
                }
            }
            /*jshint +W081 */

            self.alreadyDrawn = true;
        } else {
            oldElements = d.getElementById("squaregol-grid").getElementsByTagName("rect");

            /*jshint -W081 */
            for (var i = 0, lengthY = self.gridMatrix.length; i < lengthY; i += 1) {
                for (var j = 0, lengthX = self.gridMatrix[i].length; j < lengthX; j += 1) {
                    element = oldElements[i * lengthY + j];
                    if (self.gridMatrix[i][j] == 1) {
                        element.setAttribute("class", "alive");
                    } else {
                        element.setAttribute("class", "dead");
                    }
                }
            }
            /*jshint +W081 */
        }

        return self;
    };

    SquareGol.prototype.apply = function () {
        var self = this
          , liveNeighbors
          , elements = d.getElementById("squaregol-grid").getElementsByTagName("rect")
          , element;

        if (!self.domReady) {
            self.readySet.push(function () { self.apply(); });
            return self;
        }

        /*jshint -W081 */
        for (var i = 0, lengthY = self.gridMatrix.length; i < lengthY; i += 1) {
            for (var j = 0, lengthX = self.gridMatrix[i].length; j < lengthX; j += 1) {

                liveNeighbors = 0;
                for (var y = i - 1; y < i + 2; y += 1) {
                    for (var x = j - 1; x < j + 2; x += 1) {
                        if ((x == j && y == i) || (x < 0 || y < 0) || (x >= lengthX || y >= lengthY)) {
                            continue;
                        }
                        if (self.gridMatrix[y][x] === -1 ||
                            self.gridMatrix[y][x] === 1 ||
                            self.gridMatrix[y][x] === 2) {
                            liveNeighbors += 1;
                        }
                    }
                }
                if (self.gridMatrix[i][j] === 1) {
                    /* 1. Any live cell with fewer than two live neighbors dies,
                       simulating under-population. */
                    if (liveNeighbors < 2) {
                        self.gridMatrix[i][j] = -1; /* Marked to die */
                        //element = elements[i * self.gridMatrix.length + j];
                        //element.setAttribute("class", "sentenced");
                    }
                    /* 2. Any live cell with two or three live neighbors lives
                       on to the next generation. */
                    else if (liveNeighbors >= 2 && liveNeighbors <= 3) {
                        self.gridMatrix[i][j] = 2; /* Marked to live or came to live */
                        //element = elements[i * self.gridMatrix.length + j];
                        //element.setAttribute("class", "newborn");
                    }
                    /* 3. Any live cell with more than three live neighbors dies,
                       simulating overcrowding. */
                    else {
                        self.gridMatrix[i][j] = -1; /* Marked to die */
                        //element = elements[i * self.gridMatrix.length + j];
                        //element.setAttribute("class", "sentenced");
                    }
                } else if (self.gridMatrix[i][j] === 0 && liveNeighbors === 3) {
                    /* 4. Any dead cell with exactly three live neighbors becomes
                       a live cell, simulating reproduction. */
                    self.gridMatrix[i][j] = 3; /* Marked to live or came to live */
                    //element = elements[i * self.gridMatrix.length + j];
                    //element.setAttribute("class", "newborn");
                }
            }
        }
        /*jshint +W081 */

        self.population = 0;

        /*jshint -W081 */
        for (var i = 0, length = self.gridMatrix.length; i < length; i += 1) {
            for (var j = 0, length = self.gridMatrix[i].length; j < length; j += 1) {
                if (self.gridMatrix[i][j] === -1) {
                    self.gridMatrix[i][j] = 0;
                } else if (self.gridMatrix[i][j] === 2 || self.gridMatrix[i][j] === 3) {
                    self.population += 1;
                    self.gridMatrix[i][j] = 1;
                }
            }
        }
        /*jshint +W081 */

        self.generation += 1;

        return self;
    };

    SquareGol.prototype.readyGo = function () {
        var self = this;

        self.draw();

        var i = setInterval(function () {
            self.apply();
            setTimeout(function () {
                self.draw();
            }, self.generationInterval / 2);
            if (self.population == 0) {
                clearInterval(i);
            }
        }, self.generationInterval);

        return self;
    };

    SquareGol.prototype.domIsReady = function () {
        this.domReady = true;
        if (this.readySet) {
            for (var i = 0, length = this.readySet.length; i < length; i += 1) {
                this.readySet[i](); /* GO! */
            }
        }
    };

    w.squaregol = new SquareGol();

    if (d.addEventListener) {
        d.addEventListener("DOMContentLoaded", function evnt () {
            d.removeEventListener("DOMContentLoaded", evnt, false);
            w.squaregol.domIsReady();
        }, false);
    } else if (d.attachEvent) {
        d.attachEvent("onreadystatechange", function evnt () {
            if (d.readyState === "complete") {
                d.detachEvent("onreadystatechange", evnt);
                w.squaregol.domIsReady();
            }
        });
    }
})(window, document);
