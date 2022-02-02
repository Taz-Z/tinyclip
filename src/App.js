import { useEffect, useRef, useState } from "react";
import { Engine, Render, Runner, Bodies, Composite } from "matter-js";

const App = () => {

  const [engine, ] = useState(Engine.create())
  const [runner, ] = useState(Runner.create())
  useEffect(() => {

    // const engine = Engine.create();
    // create a renderer
    const render = Render.create({
      element: document.body,
      engine: engine,
    });

    // create two boxes and a ground
    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(engine.world, [boxA, boxB, ground]);

    // run the renderer
    Render.run(render);

    // run the engine
    Runner.run(runner, engine);
    document.title = "Tinyclip";

    return () => {
      Runner.stop(runner)
    }
  }, []);

  return (
    <>
      <div>TinyClip</div>
    </>
  );
};

export default App;
