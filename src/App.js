import { useEffect, useRef, useState } from "react";
import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Body,
  Collision,
  Events,
  World,
} from "matter-js";

const App = () => {
  const [engine] = useState(Engine.create());
  const [runner] = useState(Runner.create());
  const [boxA, setBox] = useState(
    Bodies.rectangle(50, 25, 20, 20, {
      label: "square",
      density: 0.1,
      restitution: 1,
    })
  );
  const [circle, setCircle] = useState(
    Bodies.circle(250, 250, 5, { label: "dot", density: 0.001 })
  );

  const direction = useRef("right");
  const posX = useRef(0.075);
  const posY = useRef(0);

  Events.on(engine, "collisionStart", ({ pairs }) => {
    if (
      (pairs[0].bodyA.label === "dot" && pairs[0].bodyB.label === "square") ||
      (pairs[0].bodyA.label === "square" && pairs[0].bodyB.label === "dot")
    ) {
      World.remove(engine.world, circle);
      setTimeout(() => {
        Body.setPosition(circle, {
          x: Math.random() * 700,
          y: Math.random() * 700,
        });
        World.add(engine.world, circle);
      }, 250);
    } else if (
      (pairs[0].bodyA.label === "leftwall" &&
        pairs[0].bodyB.label === "square") ||
      (pairs[0].bodyA.label === "square" && pairs[0].bodyB.label === "leftwall")
    ) {
      posX.current = 0.25;
      posY.current = 0;
    } else if (
      (pairs[0].bodyA.label === "rightwall" &&
        pairs[0].bodyB.label === "square") ||
      (pairs[0].bodyA.label === "square" &&
        pairs[0].bodyB.label === "rightwall")
    ) {
      posX.current = -0.25;
      posY.current = 0;
    } else if (
      (pairs[0].bodyA.label === "ground" &&
        pairs[0].bodyB.label === "square") ||
      (pairs[0].bodyA.label === "square" && pairs[0].bodyB.label === "ground")
    ) {
      posX.current = 0;
      posY.current = -0.25;
    } else if (
      (pairs[0].bodyA.label === "topwall" &&
        pairs[0].bodyB.label === "square") ||
      (pairs[0].bodyA.label === "square" && pairs[0].bodyB.label === "topwall")
    ) {
      posX.current = 0;
      posY.current = 0.25;
    }
  });

  useEffect(() => {
    // const engine = Engine.create();
    // create a renderer
    var canvas = document.getElementById('canvas');
    console.log(canvas)
    const render = Render.create({
      element: canvas,
      engine: engine,
      options: {
        width: 1000,
        height: 1000
      }
    });

    // create two boxes and a ground
    const ground = Bodies.rectangle(500, 1000, 1000, 50, {
      label: "ground",
      isStatic: true,
    });
    const leftWall = Bodies.rectangle(0, 500, 50, 1000, {
      label: "leftwall",
      isStatic: true,
    });
    const topWall = Bodies.rectangle(500, 0, 1000, 50, {
      label: "topwall",
      isStatic: true,
    });
    const rightWall = Bodies.rectangle(1000, 500, 50, 1000, {
      label: "rightwall",
      isStatic: true,
    });

    engine.gravity.y = 0;

    Body.setPosition(boxA, { x: 200, y: 200 });
    // add all of the bodies to the world
    Composite.add(engine.world, [
      boxA,
      ground,
      topWall,
      leftWall,
      rightWall,
      circle,
    ]);

    // run the renderer
    Render.run(render);

    // run the engine
    Runner.run(runner, engine);
    document.title = "Super simple";

    setInterval(() => {
      Body.applyForce(
        boxA,
        {
          x: boxA.position.x,
          y: boxA.position.y,
        },
        { x: posX.current, y: posY.current }
      );
    }, 300);

    document.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowRight":
          direction.current = "right";
          posX.current = 0.5;
          posY.current = 0;
          break;
        case "ArrowLeft":
          direction.current = "left";
          posX.current = -0.5;
          posY.current = 0;
          break;
        case "ArrowUp":
          direction.current = "up";
          posX.current = 0;
          posY.current = -0.5;
          break;
        case "ArrowDown":
          direction.current = "down";
          posX.current = 0;
          posY.current = 0.5;
          break;
      }

      return () => {
        Runner.stop(runner);
      };
    });
  }, []);

  return (
    <>
      <div id="canvas"></div>
    </>
  );
};

export default App;
