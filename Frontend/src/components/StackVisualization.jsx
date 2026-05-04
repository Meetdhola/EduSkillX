import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const StackVisualization = () => {
  const mountRef = useRef(null);
  const [stack, setStack] = useState([]);
  const [operationInfo, setOperationInfo] = useState("");
  const [pushValue, setPushValue] = useState(0);
  const maxStackHeight = 10;
  const fontRef = useRef();
  const sceneRef = useRef();
  const stackObjectsRef = useRef([]);
  const elementToAnimateRef = useRef(null);
  const animationRef = useRef({
    animating: false,
    animationTime: 0,
    animationDuration: 1.0,
    animationTargetY: 0,
    operation: ""
  });

  // Stack logic
  const push = (value) => {
    if (stack.length < maxStackHeight) {
      const newStack = [...stack, value];
      setStack(newStack);
      animationRef.current.operation = "push";
      updateVisual(newStack, true);
      setOperationInfo("Pushed: " + value);
    } else {
      setOperationInfo("Stack overflow! Cannot push more elements.");
    }
  };

  const pop = () => {
    if (stack.length > 0) {
      const newStack = [...stack];
      const popped = newStack.pop();
      animationRef.current.operation = "pop";
      setOperationInfo("Popped: " + popped);
      animatePop(newStack);
    } else {
      setOperationInfo("Cannot pop from empty stack!");
    }
  };

  const peek = () => {
    if (stack.length > 0) {
      animationRef.current.operation = "peek";
      updateVisual(stack);
      setOperationInfo("Top element: " + stack[stack.length - 1]);
    } else {
      setOperationInfo("Stack is empty");
    }
  };

  const clearStack = () => {
    setStack([]);
    setOperationInfo("Stack cleared");
    animationRef.current.operation = "clear";
    updateVisual([]);
  };

  // Scene setup
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e2733);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const platformGeometry = new THREE.BoxGeometry(6, 0.5, 3);
    const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -1;
    scene.add(platform);

    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    const loader = new FontLoader();
    loader.load(
      "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        fontRef.current = font;
        updateVisual(stack);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);

      const {
        animating,
        animationTime,
        animationDuration,
        animationTargetY,
        operation
      } = animationRef.current;

      if (animating && elementToAnimateRef.current) {
        animationRef.current.animationTime += 0.016;
        const progress = animationRef.current.animationTime / animationDuration;
        const eased = 1 - Math.pow(1 - progress, 3);

        const obj = elementToAnimateRef.current;
        const newY = obj.elementMesh.position.y + (animationTargetY - obj.elementMesh.position.y) * eased;
        obj.elementMesh.position.y = newY;
        if (obj.textMesh) obj.textMesh.position.y = newY;

        if (animationRef.current.animationTime >= animationDuration) {
          animationRef.current.animating = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const getElementMaterial = (index) => {
    const hue = (index / maxStackHeight) * 0.6;
    return new THREE.MeshLambertMaterial({ color: new THREE.Color().setHSL(hue, 0.8, 0.5) });
  };

  const updateVisual = (stackState, animate = false) => {
    const scene = sceneRef.current;
    stackObjectsRef.current.forEach(({ elementMesh, textMesh }) => {
      scene.remove(elementMesh);
      if (textMesh) scene.remove(textMesh);
    });
    stackObjectsRef.current = [];

    stackState.forEach((value, index) => {
      const geometry = new THREE.BoxGeometry(3, 1, 2);
      const material = getElementMaterial(index);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = index * 1.2;
      scene.add(mesh);

      let textMesh = null;
      if (fontRef.current) {
        const textGeometry = new TextGeometry(value.toString(), {
          font: fontRef.current,
          size: 0.5,
          height: 0.1
        });
        textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
        textMesh.position.set(-0.3, mesh.position.y, 0.6);
        scene.add(textMesh);
      }

      stackObjectsRef.current.push({ elementMesh: mesh, textMesh, value });
    });

    if (animate) {
      const obj = stackObjectsRef.current[stackObjectsRef.current.length - 1];
      obj.elementMesh.position.y = 15;
      if (obj.textMesh) obj.textMesh.position.y = 15;
      elementToAnimateRef.current = obj;
      animationRef.current.animationTargetY = (stackState.length - 1) * 1.2;
      animationRef.current.animationTime = 0;
      animationRef.current.animating = true;
    }
  };

  const animatePop = (newStack) => {
    const obj = stackObjectsRef.current[stackObjectsRef.current.length - 1];
    elementToAnimateRef.current = obj;
    animationRef.current.animationTargetY = 15;
    animationRef.current.animationTime = 0;
    animationRef.current.animating = true;

    setTimeout(() => {
      setStack(newStack);
      updateVisual(newStack);
    }, animationRef.current.animationDuration * 1000);
  };

  return (
    <div>
      <div
        style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", padding: 10, borderRadius: 5, color: "white" }}
      >
        <h3>Stack Controls</h3>
        <div>
          <button onClick={() => push(pushValue)}>Push</button>
          <input
            type="number"
            value={pushValue}
            onChange={(e) => setPushValue(parseInt(e.target.value))}
            style={{ width: 50, marginLeft: 5, paddingLeft: 5, color: "black" }}
          />
        </div>
        <div>
          <button onClick={pop}>Pop</button>
        </div>
        <div>
          <button onClick={peek}>Peek</button>
        </div>
        <div>
          <button onClick={clearStack}>Clear Stack</button>
        </div>
      </div>

      <div
        style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.7)", padding: 10, borderRadius: 5, color: "white" }}
      >
        <h3>Stack Information</h3>
        <div>{stack.length > 0 ? stack.join(", ") : "Empty Stack"}</div>
        <div>{operationInfo}</div>
      </div>

      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}></div>
    </div>
  );
};

export default StackVisualization;
