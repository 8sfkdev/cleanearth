/* ============================================================
   CLEAN EARTH INDUSTRIES
   2D FACTORY MANAGEMENT FOUNDATION
============================================================ */


/* ============================================================
   CANVAS
============================================================ */

const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");

let DPR =
  window.devicePixelRatio || 1;


function resizeCanvas() {

  canvas.width =
    window.innerWidth * DPR;

  canvas.height =
    window.innerHeight * DPR;

  canvas.style.width =
    window.innerWidth + "px";

  canvas.style.height =
    window.innerHeight + "px";

  ctx.setTransform(
    DPR,
    0,
    0,
    DPR,
    0,
    0
  );

}


window.addEventListener(
  "resize",
  resizeCanvas
);

resizeCanvas();


/* ============================================================
   GAME STATE
============================================================ */

const game = {

  money: 100000,

  energyProduced: 0,

  energyUsed: 0,

  waterProduced: 0,

  waterUsed: 0,

  pollution: 0,

  profit: 0,

  day: 1,

  time: 8,

  speed: 1,

  paused: false,

  zoom: 1,

  cameraX: 0,

  cameraY: 0,

  selectedBuilding: null,

  tool: "select",

  buildings: [],

  roads: [],

  powerLines: [],

  pipes: []

};


/* ============================================================
   GRID
============================================================ */

const TILE =
  32;

const GRID =
  100;


function worldToScreen(
  x,
  y
) {

  return {

    x:
      (x * TILE * game.zoom)
      + game.cameraX,

    y:
      (y * TILE * game.zoom)
      + game.cameraY

  };

}


function screenToWorld(
  x,
  y
) {

  return {

    x:
      Math.floor(
        (x - game.cameraX)
        /
        (TILE * game.zoom)
      ),

    y:
      Math.floor(
        (y - game.cameraY)
        /
        (TILE * game.zoom)
      )

  };

}


/* ============================================================
   BUILDINGS
============================================================ */

const BUILDINGS = [

  {
    id: "small_factory",
    name: "Small Factory",
    category: "production",
    cost: 25000,
    sizeX: 3,
    sizeY: 3,
    power: 100,
    water: 20,
    pollution: 4,
    production: 120,
    description:
      "Basic industrial production facility."
  },

  {
    id: "heavy_factory",
    name: "Heavy Factory",
    category: "production",
    cost: 80000,
    sizeX: 5,
    sizeY: 4,
    power: 350,
    water: 70,
    pollution: 12,
    production: 500,
    description:
      "Large-scale industrial manufacturing."
  },

  {
    id: "steel_mill",
    name: "Steel Mill",
    category: "production",
    cost: 250000,
    sizeX: 6,
    sizeY: 5,
    power: 900,
    water: 300,
    pollution: 30,
    production: 1200,
    description:
      "Produces steel from raw materials."
  },

  {
    id: "chemical_plant",
    name: "Chemical Plant",
    category: "production",
    cost: 180000,
    sizeX: 5,
    sizeY: 5,
    power: 700,
    water: 250,
    pollution: 35,
    production: 900,
    description:
      "Produces industrial chemicals."
  },

  {
    id: "cement_plant",
    name: "Cement Plant",
    category: "production",
    cost: 120000,
    sizeX: 5,
    sizeY: 4,
    power: 500,
    water: 100,
    pollution: 20,
    production: 700,
    description:
      "Produces construction materials."
  },

  {
    id: "electronics_factory",
    name: "Electronics Factory",
    category: "production",
    cost: 300000,
    sizeX: 5,
    sizeY: 4,
    power: 600,
    water: 100,
    pollution: 8,
    production: 1600,
    description:
      "Advanced electronics manufacturing."
  },

  {
    id: "assembly_plant",
    name: "Assembly Plant",
    category: "production",
    cost: 400000,
    sizeX: 7,
    sizeY: 5,
    power: 800,
    water: 150,
    pollution: 10,
    production: 2400,
    description:
      "High-volume product assembly."
  },

  {
    id: "coal_plant",
    name: "Coal Power Plant",
    category: "energy",
    cost: 100000,
    sizeX: 5,
    sizeY: 5,
    powerOutput: 3000,
    pollution: 45,
    description:
      "High-output fossil fuel power generation."
  },

  {
    id: "gas_plant",
    name: "Gas Power Plant",
    category: "energy",
    cost: 180000,
    sizeX: 5,
    sizeY: 5,
    powerOutput: 4000,
    pollution: 25,
    description:
      "Efficient natural gas power generation."
  },

  {
    id: "solar_farm",
    name: "Solar Farm",
    category: "energy",
    cost: 150000,
    sizeX: 7,
    sizeY: 6,
    powerOutput: 1800,
    pollution: 0,
    description:
      "Clean renewable energy generation."
  },

  {
    id: "wind_farm",
    name: "Wind Turbines",
    category: "energy",
    cost: 200000,
    sizeX: 6,
    sizeY: 6,
    powerOutput: 2200,
    pollution: 0,
    description:
      "Renewable wind power generation."
  },

  {
    id: "battery",
    name: "Battery Storage",
    category: "energy",
    cost: 120000,
    sizeX: 3,
    sizeY: 3,
    powerOutput: 500,
    pollution: 0,
    description:
      "Stores excess electrical energy."
  },

  {
    id: "substation",
    name: "Electrical Substation",
    category: "energy",
    cost: 50000,
    sizeX: 2,
    sizeY: 2,
    powerOutput: 0,
    pollution: 0,
    description:
      "Distributes electricity across the grid."
  },

  {
    id: "water_pump",
    name: "Water Pump",
    category: "water",
    cost: 60000,
    sizeX: 3,
    sizeY: 3,
    waterOutput: 1000,
    pollution: 1,
    description:
      "Extracts water for industrial use."
  },

  {
    id: "water_treatment",
    name: "Water Treatment Plant",
    category: "water",
    cost: 180000,
    sizeX: 5,
    sizeY: 4,
    waterOutput: 800,
    pollutionReduction: 8,
    power: 200,
    description:
      "Treats contaminated industrial water."
  },

  {
    id: "wastewater",
    name: "Wastewater Facility",
    category: "water",
    cost: 220000,
    sizeX: 5,
    sizeY: 4,
    pollutionReduction: 15,
    power: 300,
    description:
      "Processes industrial wastewater."
  },

  {
    id: "warehouse",
    name: "Warehouse",
    category: "transport",
    cost: 50000,
    sizeX: 4,
    sizeY: 3,
    storage: 5000,
    pollution: 1,
    description:
      "Stores industrial materials."
  },

  {
    id: "large_warehouse",
    name: "Large Warehouse",
    category: "transport",
    cost: 150000,
    sizeX: 7,
    sizeY: 5,
    storage: 20000,
    pollution: 2,
    description:
      "Large-scale industrial storage."
  },

  {
    id: "recycling",
    name: "Recycling Center",
    category: "waste",
    cost: 100000,
    sizeX: 4,
    sizeY: 4,
    pollutionReduction: 10,
    power: 150,
    description:
      "Processes recyclable industrial waste."
  },

  {
    id: "landfill",
    name: "Industrial Landfill",
    category: "waste",
    cost: 40000,
    sizeX: 5,
    sizeY: 4,
    pollution: 15,
    storage: 10000,
    description:
      "Stores industrial waste."
  },

  {
    id: "air_filter",
    name: "Air Filtration Facility",
    category: "environment",
    cost: 250000,
    sizeX: 4,
    sizeY: 4,
    power: 250,
    pollutionReduction: 25,
    description:
      "Reduces atmospheric industrial pollution."
  },

  {
    id: "carbon_capture",
    name: "Carbon Capture Plant",
    category: "environment",
    cost: 600000,
    sizeX: 6,
    sizeY: 5,
    power: 500,
    pollutionReduction: 50,
    description:
      "Advanced carbon capture technology."
  },

  {
    id: "tree_plantation",
    name: "Tree Plantation",
    category: "environment",
    cost: 15000,
    sizeX: 5,
    sizeY: 5,
    pollutionReduction: 5,
    description:
      "Restores natural vegetation."
  },

  {
    id: "road",
    name: "Industrial Road",
    category: "transport",
    cost: 1000,
    sizeX: 1,
    sizeY: 1,
    description:
      "Connects industrial buildings."
  }

];


/* ============================================================
   DRAW MAP
============================================================ */

function drawMap() {

  ctx.clearRect(
    0,
    0,
    innerWidth,
    innerHeight
  );


  /* BASE */

  ctx.fillStyle =
    "#2b392f";

  ctx.fillRect(
    0,
    0,
    innerWidth,
    innerHeight
  );


  /* GRID */

  const gridSize =
    TILE * game.zoom;


  const startX =
    ((game.cameraX % gridSize)
    + gridSize)
    % gridSize;


  const startY =
    ((game.cameraY % gridSize)
    + gridSize)
    % gridSize;


  ctx.strokeStyle =
    "rgba(255,255,255,0.035)";

  ctx.lineWidth =
    1;


  for (
    let x = startX;
    x < innerWidth;
    x += gridSize
  ) {

    ctx.beginPath();

    ctx.moveTo(x, 0);

    ctx.lineTo(
      x,
      innerHeight
    );

    ctx.stroke();

  }


  for (
    let y = startY;
    y < innerHeight;
    y += gridSize
  ) {

    ctx.beginPath();

    ctx.moveTo(0, y);

    ctx.lineTo(
      innerWidth,
      y
    );

    ctx.stroke();

  }


  /* ROADS */

  game.roads.forEach(
    road => {

      const pos =
        worldToScreen(
          road.x,
          road.y
        );

      ctx.fillStyle =
        "#252927";

      ctx.fillRect(
        pos.x,
        pos.y,
        gridSize,
        gridSize
      );

      ctx.strokeStyle =
        "rgba(255,255,255,0.15)";

      ctx.strokeRect(
        pos.x,
        pos.y,
        gridSize,
        gridSize
      );

    }
  );


  /* POWER LINES */

  game.powerLines.forEach(
    line => {

      const a =
        worldToScreen(
          line.x,
          line.y
        );

      ctx.strokeStyle =
        "#d4b94c";

      ctx.lineWidth =
        3;

      ctx.beginPath();

      ctx.moveTo(
        a.x + gridSize / 2,
        a.y + gridSize / 2
      );

      ctx.lineTo(
        a.x + gridSize,
        a.y + gridSize / 2
      );

      ctx.stroke();

    }
  );


  /* PIPES */

  game.pipes.forEach(
    pipe => {

      const p =
        worldToScreen(
          pipe.x,
          pipe.y
        );

      ctx.strokeStyle =
        "#4fa9d8";

      ctx.lineWidth =
        4;

      ctx.beginPath();

      ctx.moveTo(
        p.x,
        p.y + gridSize / 2
      );

      ctx.lineTo(
        p.x + gridSize,
        p.y + gridSize / 2
      );

      ctx.stroke();

    }
  );


  /* BUILDINGS */

  game.buildings.forEach(
    building => {

      drawBuilding(
        building
      );

    }
  );


  /* PREVIEW */

  if (
    game.selectedBuilding &&
    game.preview
  ) {

    drawPreview();

  }

}


/* ============================================================
   DRAW BUILDING
============================================================ */

function drawBuilding(
  building
) {

  const def =
    BUILDINGS.find(
      b =>
        b.id ===
        building.type
    );

  if (!def)
    return;


  const pos =
    worldToScreen(
      building.x,
      building.y
    );


  const width =
    def.sizeX *
    TILE *
    game.zoom;


  const height =
    def.sizeY *
    TILE *
    game.zoom;


  /* FOUNDATION */

  ctx.fillStyle =
    "#202824";

  ctx.fillRect(
    pos.x,
    pos.y,
    width,
    height
  );


  /* MAIN BUILDING */

  let color =
    "#65756c";


  if (
    def.category ===
    "energy"
  )
    color =
      "#8b7950";


  if (
    def.category ===
    "production"
  )
    color =
      "#6b7880";


  if (
    def.category ===
    "water"
  )
    color =
      "#477d91";


  if (
    def.category ===
    "waste"
  )
    color =
      "#706a55";


  if (
    def.category ===
    "environment"
  )
    color =
      "#46785b";


  ctx.fillStyle =
    color;

  ctx.fillRect(
    pos.x + 4 * game.zoom,
    pos.y + 4 * game.zoom,
    width - 8 * game.zoom,
    height - 8 * game.zoom
  );


  /* ROOF */

  ctx.fillStyle =
    "rgba(0,0,0,0.25)";

  ctx.fillRect(
    pos.x + 5 * game.zoom,
    pos.y + 5 * game.zoom,
    width - 10 * game.zoom,
    8 * game.zoom
  );


  /* WINDOWS */

  const windows =
    Math.max(
      1,
      Math.floor(
        def.sizeX / 2
      )
    );


  for (
    let i = 0;
    i < windows;
    i++
  ) {

    ctx.fillStyle =
      "#b8d6c6";

    ctx.fillRect(

      pos.x +
      (10 + i * 25) *
      game.zoom,

      pos.y +
      25 *
      game.zoom,

      10 *
      game.zoom,

      8 *
      game.zoom

    );

  }


  /* CHIMNEY */

  if (
    def.category ===
    "production"
  ) {

    ctx.fillStyle =
      "#444b48";

    ctx.fillRect(

      pos.x +
      width * 0.75,

      pos.y -
      12 * game.zoom,

      10 *
      game.zoom,

      18 *
      game.zoom

    );


    if (
      def.pollution >
      10
    ) {

      ctx.fillStyle =
        "rgba(90,90,90,0.18)";

      ctx.beginPath();

      ctx.arc(
        pos.x +
        width * 0.8,

        pos.y -
        20 * game.zoom,

        10 *
        game.zoom,

        0,

        Math.PI * 2
      );

      ctx.fill();

    }

  }


  /* NAME */

  if (
    game.zoom >
    0.7
  ) {

    ctx.fillStyle =
      "rgba(255,255,255,0.8)";

    ctx.font =
      `${Math.max(
        8,
        10 * game.zoom
      )}px Arial`;

    ctx.textAlign =
      "center";

    ctx.fillText(

      def.name,

      pos.x +
      width / 2,

      pos.y +
      height +
      13 *
      game.zoom

    );

  }

}


/* ============================================================
   PREVIEW
============================================================ */

function drawPreview() {

  const def =
    game.selectedBuilding;


  const pos =
    worldToScreen(
      game.preview.x,
      game.preview.y
    );


  const width =
    def.sizeX *
    TILE *
    game.zoom;


  const height =
    def.sizeY *
    TILE *
    game.zoom;


  ctx.fillStyle =
    game.preview.valid

      ? "rgba(53,184,121,0.35)"

      : "rgba(220,70,70,0.35)";


  ctx.fillRect(

    pos.x,
    pos.y,

    width,
    height

  );


  ctx.strokeStyle =
    game.preview.valid

      ? "#55dc92"

      : "#e56c6c";


  ctx.lineWidth =
    2;


  ctx.strokeRect(

    pos.x,
    pos.y,

    width,
    height

  );

}


/* ============================================================
   PLACEMENT VALIDATION
============================================================ */

function canPlace(
  def,
  x,
  y
) {

  if (
    x < 0 ||
    y < 0
  )
    return false;


  for (
    const building
    of game.buildings
  ) {

    const other =
      BUILDINGS.find(
        b =>
          b.id ===
          building.type
      );


    if (

      x <
      building.x +
      other.sizeX &&

      x +
      def.sizeX >
      building.x &&

      y <
      building.y +
      other.sizeY &&

      y +
      def.sizeY >
      building.y

    ) {

      return false;

    }

  }


  return true;

}


/* ============================================================
   BUILD
============================================================ */

function buildBuilding(
  def,
  x,
  y
) {

  if (
    !canPlace(
      def,
      x,
      y
    )
  ) {

    notify(
      "Cannot build here."
    );

    return;

  }


  if (
    game.money <
    def.cost
  ) {

    notify(
      "Insufficient funds."
    );

    return;

  }


  game.money -=
    def.cost;


  game.buildings.push({

    id:
      Date.now(),

    type:
      def.id,

    x,

    y,

    efficiency:
      100

  });


  notify(
    `${def.name} constructed.`
  );


  updateUI();

}


/* ============================================================
   TOOL SYSTEM
============================================================ */

document
  .querySelectorAll(
    ".tool"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".tool"
            )
            .forEach(
              b =>
                b.classList
                  .remove(
                    "active"
                  )
            );


          button.classList
            .add(
              "active"
            );


          game.tool =
            button.dataset.tool;

        }
      );

    }
  );


/* ============================================================
   CANVAS INPUT
============================================================ */

let dragging =
  false;

let lastX =
  0;

let lastY =
  0;


canvas.addEventListener(
  "pointerdown",
  e => {

    dragging =
      true;

    lastX =
      e.clientX;

    lastY =
      e.clientY;

    canvas.setPointerCapture(
      e.pointerId
    );

  }
);


canvas.addEventListener(
  "pointermove",
  e => {

    if (
      dragging &&
      game.tool ===
      "select"
    ) {

      game.cameraX +=
        e.clientX -
        lastX;

      game.cameraY +=
        e.clientY -
        lastY;

      lastX =
        e.clientX;

      lastY =
        e.clientY;

      return;

    }


    if (
      game.tool ===
      "build" &&
      game.selectedBuilding
    ) {

      const world =
        screenToWorld(
          e.clientX,
          e.clientY
        );


      game.preview = {

        x:
          world.x,

        y:
          world.y,

        valid:
          canPlace(
            game.selectedBuilding,
            world.x,
            world.y
          )

      };

    }

  }
);


canvas.addEventListener(
  "pointerup",
  e => {

    dragging =
      false;


    if (
      game.tool ===
      "build" &&
      game.selectedBuilding &&
      game.preview
    ) {

      if (
        game.preview.valid
      ) {

        buildBuilding(

          game.selectedBuilding,

          game.preview.x,

          game.preview.y

        );

      }

    }


    if (
      game.tool ===
      "road"
    ) {

      const p =
        screenToWorld(
          e.clientX,
          e.clientY
        );


      game.roads.push({

        x:
          p.x,

        y:
          p.y

      });

    }

  }
);


/* ============================================================
   BUILDING MENU
============================================================ */

const buildingList =
  document.getElementById(
    "buildingList"
  );


function renderBuildings(
  category = "all"
) {

  buildingList.innerHTML =
    "";


  BUILDINGS
    .filter(
      building =>
        category ===
        "all" ||
        building.category ===
        category
    )
    .forEach(
      building => {

        const card =
          document.createElement(
            "button"
          );


        card.className =
          "building-card";


        card.innerHTML = `

          <div class="building-preview"></div>

          <div class="building-info">

            <h3>
              ${building.name}
            </h3>

            <p>
              ${building.description}
            </p>

            <div class="building-cost">
              £${building.cost.toLocaleString()}
            </div>

          </div>

        `;


        card.addEventListener(
          "click",
          () => {

            game.selectedBuilding =
              building;

            game.tool =
              "build";


            document
              .querySelectorAll(
                ".tool"
              )
              .forEach(
                b =>
                  b.classList
                    .remove(
                      "active"
                    )
              );


            document
              .querySelector(
                '[data-tool="build"]'
              )
              .classList
              .add(
                "active"
              );


            notify(
              `Selected ${building.name}.`
            );

          }
        );


        buildingList.appendChild(
          card
        );

      }
    );

}


renderBuildings();


/* ============================================================
   CATEGORY FILTER
============================================================ */

document
  .querySelectorAll(
    ".category"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".category"
            )
            .forEach(
              b =>
                b.classList
                  .remove(
                    "active"
                  )
            );


          button.classList
            .add(
              "active"
            );


          renderBuildings(
            button.dataset.category
          );

        }
      );

    }
  );


/* ============================================================
   ECONOMY
============================================================ */

function simulateEconomy() {

  let production =
    0;

  let maintenance =
    0;


  game.energyProduced =
    0;

  game.energyUsed =
    0;

  game.waterProduced =
    0;

  game.waterUsed =
    0;


  let pollution =
    0;


  game.buildings.forEach(
    building => {

      const def =
        BUILDINGS.find(
          b =>
            b.id ===
            building.type
        );


      if (!def)
        return;


      if (
        def.powerOutput
      ) {

        game.energyProduced +=
          def.powerOutput;

      }


      if (
        def.power
      ) {

        game.energyUsed +=
          def.power;

      }


      if (
        def.waterOutput
      ) {

        game.waterProduced +=
          def.waterOutput;

      }


      if (
        def.water
      ) {

        game.waterUsed +=
          def.water;

      }


      if (
        def.pollution
      ) {

        pollution +=
          def.pollution;

      }


      if (
        def.pollutionReduction
      ) {

        pollution -=
          def.pollutionReduction;

      }


      maintenance +=
        def.cost *
        0.001;


      if (
        def.production
      ) {

        production +=
          def.production;

      }

    }
  );


  game.pollution =
    Math.max(
      0,
      Math.min(
        100,
        pollution
      )
    );


  const income =
    production *
    0.5;


  game.profit =
    income -
    maintenance;


  game.money +=
    game.profit *
    0.01 *
    game.speed;

}


/* ============================================================
   UI
============================================================ */

function updateUI() {

  document
    .getElementById(
      "money"
    )
    .textContent =
      `£${Math.floor(
        game.money
      ).toLocaleString()}`;


  document
    .getElementById(
      "energy"
    )
    .textContent =

      `${Math.floor(
        game.energyUsed
      )} / ${Math.floor(
        game.energyProduced
      )} MW`;


  document
    .getElementById(
      "water"
    )
    .textContent =

      `${Math.floor(
        game.waterUsed
      )} / ${Math.floor(
        game.waterProduced
      )} ML`;


  document
    .getElementById(
      "pollution"
    )
    .textContent =

      `${Math.floor(
        game.pollution
      )}%`;


  document
    .getElementById(
      "profit"
    )
    .textContent =

      `£${Math.floor(
        game.profit
      ).toLocaleString()} / day`;

}


/* ============================================================
   NOTIFICATIONS
============================================================ */

function notify(
  message
) {

  const notification =
    document.createElement(
      "div"
    );


  notification.className =
    "notification";


  notification.textContent =
    message;


  document
    .getElementById(
      "notifications"
    )
    .appendChild(
      notification
    );


  setTimeout(
    () => {

      notification.remove();

    },

    2500

  );

}


/* ============================================================
   ZOOM
============================================================ */

document
  .getElementById(
    "zoomIn"
  )
  .addEventListener(
    "click",
    () => {

      game.zoom =
        Math.min(
          2,
          game.zoom +
          0.1
        );


      updateZoom();

    }
  );


document
  .getElementById(
    "zoomOut"
  )
  .addEventListener(
    "click",
    () => {

      game.zoom =
        Math.max(
          0.4,
          game.zoom -
          0.1
        );


      updateZoom();

    }
  );


function updateZoom() {

  document
    .getElementById(
      "zoomText"
    )
    .textContent =

      `${Math.round(
        game.zoom *
        100
      )}%`;

}


/* ============================================================
   SAVE / LOAD
============================================================ */

document
  .getElementById(
    "saveGame"
  )
  .addEventListener(
    "click",
    () => {

      localStorage.setItem(

        "cleanEarthSave",

        JSON.stringify(
          game
        )

      );


      notify(
        "Game saved successfully."
      );

    }
  );


document
  .getElementById(
    "loadGame"
  )
  .addEventListener(
    "click",
    () => {

      const save =
        localStorage.getItem(
          "cleanEarthSave"
        );


      if (!save) {

        notify(
          "No saved game found."
        );

        return;

      }


      const data =
        JSON.parse(
          save
        );


      Object.assign(
        game,
        data
      );


      notify(
        "Game loaded successfully."
      );


      updateUI();

    }
  );


/* ============================================================
   BUILD MENU TOGGLE
============================================================ */

document
  .getElementById(
    "toggleBuildMenu"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "buildMenu"
        )
        .classList
        .toggle(
          "collapsed"
        );

    }
  );


/* ============================================================
   GAME LOOP
============================================================ */

let lastTime =
  performance.now();


function gameLoop(
  time
) {

  const delta =
    time -
    lastTime;


  lastTime =
    time;


  if (
    !game.paused
  ) {

    simulateEconomy();

  }


  drawMap();

  updateUI();


  requestAnimationFrame(
    gameLoop
  );

}


requestAnimationFrame(
  gameLoop
);


/* ============================================================
   PAUSE
============================================================ */

document
  .getElementById(
    "pauseBtn"
  )
  .addEventListener(
    "click",
    () => {

      game.paused =
        !game.paused;


      document
        .getElementById(
          "pauseBtn"
        )
        .textContent =

        game.paused
          ? "▶"
          : "Ⅱ";

    }
  );


/* ============================================================
   SPEED
============================================================ */

document
  .querySelectorAll(
    ".speed"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".speed"
            )
            .forEach(
              b =>
                b.classList
                  .remove(
                    "active"
                  )
            );


          button.classList
            .add(
              "active"
            );


          game.speed =
            Number(
              button.dataset.speed
            );

        }
      );

    }
  );


/* ============================================================
   INITIAL STATE
============================================================ */

game.cameraX =
  innerWidth / 2;

game.cameraY =
  innerHeight / 2;


updateUI();

notify(
  "Welcome to Clean Earth Industries."
);