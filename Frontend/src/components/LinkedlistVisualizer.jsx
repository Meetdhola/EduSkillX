import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const LinkedListVisualizer = () => {
  const mountRef = useRef(null);
  const [linkedList, setLinkedList] = useState([]);
  const [nodeValue, setNodeValue] = useState(0);
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [insertValue, setInsertValue] = useState(0);
  const [insertIndex, setInsertIndex] = useState(0);

  const nodeObjects = useRef([]);
  const fontRef = useRef(null);
  const sceneRef = useRef(null);

  // Helper Linked List class
  class Node {
    constructor(value) {
      this.value = value;
      this.next = null;
    }
  }

  class LinkedList {
    constructor() {
      this.head = null;
      this.size = 0;
    }

    append(value) {
      const newNode = new Node(value);
      this.size++;
      if (!this.head) {
        this.head = newNode;
        return;
      }
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }

    insertAt(value, index) {
      if (index < 0 || index > this.size) return false;
      const newNode = new Node(value);
      if (index === 0) {
        newNode.next = this.head;
        this.head = newNode;
      } else {
        let current = this.head;
        let previous;
        let count = 0;
        while (count < index) {
          previous = current;
          current = current.next;
          count++;
        }
        newNode.next = current;
        previous.next = newNode;
      }
      this.size++;
      return true;
    }

    removeAt(index) {
      if (index < 0 || index >= this.size) return false;
      let current = this.head;
      if (index === 0) {
        this.head = current.next;
      } else {
        let previous;
        let count = 0;
        while (count < index) {
          previous = current;
          current = current.next;
          count++;
        }
        previous.next = current.next;
      }
      this.size--;
      return current.value;
    }

    toArray() {
      let current = this.head;
      const array = [];
      while (current) {
        array.push(current.value);
        current = current.next;
      }
      return array;
    }
  }

  const updateScene = (scene, linkedListArray) => {
    nodeObjects.current.forEach(obj => {
      scene.remove(obj);
    });
    nodeObjects.current = [];

    const spacing = 3;
    linkedListArray.forEach((value, index) => {
      const geometry = new THREE.BoxGeometry(2, 1, 1);
      const material = new THREE.MeshLambertMaterial({ color: 0x4287f5 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = index * spacing - (linkedListArray.length - 1) * spacing / 2;
      scene.add(mesh);
      nodeObjects.current.push(mesh);

      if (fontRef.current) {
        const textGeometry = new TextGeometry(value.toString(), {
          font: fontRef.current,
          size: 0.5,
          height: 0.1
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.copy(mesh.position);
        textMesh.position.y += 0.6;
        textMesh.position.x -= 0.3;
        scene.add(textMesh);
        nodeObjects.current.push(textMesh);
      }
    });
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282c34);
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

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.GridHelper(20, 20));

    const fontLoader = new FontLoader();
    fontLoader.load(
      'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/fonts/helvetiker_regular.typeface.json',
      loadedFont => {
        fontRef.current = loadedFont;
        updateScene(scene, linkedList);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleAddNode = () => {
    const ll = new LinkedList();
    linkedList.forEach(val => ll.append(val));
    ll.append(nodeValue);
    const updated = ll.toArray();
    setLinkedList(updated);
    updateScene(sceneRef.current, updated);
  };

  const handleDeleteNode = () => {
    const ll = new LinkedList();
    linkedList.forEach(val => ll.append(val));
    ll.removeAt(deleteIndex);
    const updated = ll.toArray();
    setLinkedList(updated);
    updateScene(sceneRef.current, updated);
  };

  const handleInsertNode = () => {
    const ll = new LinkedList();
    linkedList.forEach(val => ll.append(val));
    ll.insertAt(insertValue, insertIndex);
    const updated = ll.toArray();
    setLinkedList(updated);
    updateScene(sceneRef.current, updated);
  };

  const handleReset = () => {
    setLinkedList([]);
    updateScene(sceneRef.current, []);
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 5, color: 'white' }}>
        <h3>Linked List Controls</h3>
        <div>
          <button onClick={handleAddNode}>Add Node</button>
          <input type="number" value={nodeValue} onChange={e => setNodeValue(Number(e.target.value))} />
        </div>
        <div>
          <button onClick={handleDeleteNode}>Delete Node</button>
          <input type="number" value={deleteIndex} onChange={e => setDeleteIndex(Number(e.target.value))} />
        </div>
        <div>
          <button onClick={handleInsertNode}>Insert Node</button>
          <input type="number" value={insertValue} onChange={e => setInsertValue(Number(e.target.value))} />
          <input type="number" value={insertIndex} onChange={e => setInsertIndex(Number(e.target.value))} />
        </div>
        <div>
          <button onClick={handleReset}>Reset List</button>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 5, color: 'white' }}>
        <h3>Current Linked List</h3>
        <div>{linkedList.length > 0 ? linkedList.join(' -> ') : 'Empty'}</div>
      </div>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}></div>
    </div>
  );
};

export default LinkedListVisualizer;