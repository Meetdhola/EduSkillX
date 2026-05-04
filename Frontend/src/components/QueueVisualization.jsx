import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function QueueVRVisualization() {
  const mountRef = useRef(null);
  const [queueData, setQueueData] = useState({
    customers: [],
    waitTimes: [],
    servedCustomers: 0,
    isAutomated: false,
  });
  const customerId = useRef(0);
  const automationInterval = useRef(null);

  const customers = useRef([]);
  const sceneRef = useRef();
  const addCustomer = () => {
    const id = customerId.current++;
    const arrivalTime = Date.now();

    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 1.5, 8),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
      })
    );
    body.position.y = 1;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffdbac })
    );
    head.position.y = 2;
    head.castShadow = true;
    group.add(head);

    group.position.set(-9 + customers.current.length * 1.5, 0, 5);
    sceneRef.current.add(group);

    customers.current.push({ id, group, arrivalTime });
    updateStats();
  };

  const serveCustomer = () => {
    if (!customers.current.length) return;
    const { group, arrivalTime } = customers.current.shift();
    const target = [{ x: -5, z: -3 }, { x: 0, z: -3 }, { x: 5, z: -3 }][
      Math.floor(Math.random() * 3)
    ];

    const move = () => {
      const dx = target.x - group.position.x;
      const dz = target.z - group.position.z;
      if (Math.abs(dx) > 0.1 || Math.abs(dz) > 0.1) {
        group.position.x += dx * 0.05;
        group.position.z += dz * 0.05;
        requestAnimationFrame(move);
      } else {
        setTimeout(() => {
          let scale = 1;
          const fade = () => {
            group.position.y -= 0.1;
            scale *= 0.9;
            group.scale.set(scale, scale, scale);
            if (scale > 0.1) requestAnimationFrame(fade);
            else sceneRef.current.remove(group);
          };
          fade();
          const wait = (Date.now() - arrivalTime) / 60000;
          setQueueData((prev) => ({
            ...prev,
            waitTimes: [...prev.waitTimes, wait],
            servedCustomers: prev.servedCustomers + 1,
          }));
        }, 2000);
      }
    };
    move();
    updateStats();
  };

  const updateStats = () => {
    setQueueData((prev) => ({
      ...prev,
      customers: [...customers.current],
    }));
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x999999 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const queueArea = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 5),
      new THREE.MeshStandardMaterial({ color: 0xdddddd })
    );
    queueArea.rotation.x = -Math.PI / 2;
    queueArea.position.y = 0.01;
    queueArea.position.z = 5;
    queueArea.receiveShadow = true;
    scene.add(queueArea);

    const createCounter = (x) => {
      const group = new THREE.Group();
      const counter = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      counter.position.y = 0.5;
      counter.castShadow = true;
      group.add(counter);

      const display = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.5, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x000080 })
      );
      display.position.set(0, 1.2, -0.7);
      display.castShadow = true;
      group.add(display);

      group.position.set(x, 0, -5);
      return group;
    };

    scene.add(createCounter(-5), createCounter(0), createCounter(5));

    const animate = () => {
      requestAnimationFrame(animate);
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
      if (automationInterval.current) clearInterval(automationInterval.current);
    };
  }, []);

  const toggleAutomation = () => {
    setQueueData((prev) => {
      const isAutomated = !prev.isAutomated;
      if (isAutomated) {
        automationInterval.current = setInterval(() => {
          for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            setTimeout(() => addCustomer(), i * 500);
          }
          for (let i = 0; i < Math.min(3, customers.current.length); i++) {
            setTimeout(() => serveCustomer(), 1000 + i * 1000);
          }
        }, 5000);
      } else {
        clearInterval(automationInterval.current);
      }
      return { ...prev, isAutomated };
    });
  };

  const averageWaitTime =
    queueData.waitTimes.length > 0
      ? (
          queueData.waitTimes.reduce((a, b) => a + b, 0) /
          queueData.waitTimes.length
        ).toFixed(2)
      : 0;

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 10,
          width: "100%",
          textAlign: "center",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 10,
          zIndex: 100,
        }}
      >
        Queue Automation VR Visualization
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 10,
          borderRadius: 5,
          zIndex: 100,
        }}
      >
        Queue Status: {queueData.customers.length} people in queue<br />
        Average Wait Time: {averageWaitTime} minutes<br />
        Customers Served: {queueData.servedCustomers}
      </div>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 10,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 10,
          borderRadius: 5,
          color: "white",
          zIndex: 100,
        }}
      >
        <button onClick={addCustomer}>Add Customer</button>
        <button onClick={toggleAutomation}>Toggle Automation</button>
        <button
          onClick={() =>
            alert("WebXR would activate here in a full implementation.")
          }
        >
          Enter VR
        </button>
      </div>
      <div ref={mountRef} />
    </div>
  );
}
