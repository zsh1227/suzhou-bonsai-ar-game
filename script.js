const ASSETS = {
  containers: [
    "assets/container/container_01.png",
    "assets/container/container_02.png",
    "assets/container/container_03.png",
  ],
  branches: [
    "assets/branch/branch_01.png",
    "assets/branch/branch_02.png",
    "assets/branch/branch_03.png",
  ],
  leaves: [
    "assets/leaf/leaf_01.png",
    "assets/leaf/leaf_02.png",
    "assets/leaf/leaf_03.png",
  ],
};

const state = {
  step: 1,
  container: 1,
  branch: 1,
  leaf: 1,
  pose: {
    x: 0,
    y: 0,
    scale: 1,
  },
  stream: null,
};

const pointers = new Map();
let gesture = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  pages: $$(".page"),
  homePage: $("#homePage"),
  gamePage: $("#gamePage"),
  resultPage: $("#resultPage"),
  startExperienceButton: $("#startExperienceButton"),
  backHomeButton: $("#backHomeButton"),
  resetPoseButton: $("#resetPoseButton"),
  cameraPanel: $("#cameraPanel"),
  cameraVideo: $("#cameraVideo"),
  cameraFallback: $("#cameraFallback"),
  cameraMessage: $("#cameraMessage"),
  bonsaiObject: $("#bonsaiObject"),
  plantLayer: $("#plantLayer"),
  containerLayer: $("#containerLayer"),
  stepInstruction: $("#stepInstruction"),
  selectionSummary: $("#selectionSummary"),
  choiceGrid: $("#choiceGrid"),
  prevStepButton: $("#prevStepButton"),
  nextStepButton: $("#nextStepButton"),
  finishBonsaiButton: $("#finishBonsaiButton"),
  stepPills: $$(".step-pill"),
  resultPlantLayer: $("#resultPlantLayer"),
  resultContainerLayer: $("#resultContainerLayer"),
  resultChoices: $("#resultChoices"),
  remixButton: $("#remixButton"),
  resultHomeButton: $("#resultHomeButton"),
};

function padIndex(index) {
  return String(index).padStart(2, "0");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function showPage(pageId) {
  elements.pages.forEach((page) => {
    page.classList.toggle("is-active", page.id === pageId);
  });
}

function setCameraMessage(text, type = "normal") {
  elements.cameraMessage.textContent = text;
  elements.cameraMessage.classList.toggle("is-error", type === "error");
  elements.cameraMessage.classList.toggle("is-success", type === "success");
}

function setImage(element, path, visible = true) {
  element.src = path;
  element.classList.toggle("is-visible", visible);
}

function getComboPath(branchIndex = state.branch - 1, leafIndex = state.leaf - 1) {
  const branchCode = String(branchIndex + 1).padStart(2, "0");
  const leafCode = String(leafIndex + 1).padStart(2, "0");
  return `assets/reference/${branchCode}/${branchCode}${leafCode}.png`;
}

function getAllComboPaths() {
  const paths = [];
  for (let branchIndex = 0; branchIndex < ASSETS.branches.length; branchIndex += 1) {
    for (let leafIndex = 0; leafIndex < ASSETS.leaves.length; leafIndex += 1) {
      paths.push(getComboPath(branchIndex, leafIndex));
    }
  }
  return paths;
}

function getStepConfig(step = state.step) {
  if (step === 1) {
    return {
      type: "container",
      instruction: "请选择一个容器",
      label: "容器",
      paths: ASSETS.containers,
      nextText: "下一步：选枝干",
    };
  }

  if (step === 2) {
    return {
      type: "branch",
      instruction: "请选择一个枝干",
      label: "枝干",
      paths: ASSETS.branches,
      nextText: "下一步：选叶片",
    };
  }

  return {
    type: "leaf",
    instruction: "请选择一种叶片",
    label: "叶片",
    paths: ASSETS.leaves,
    nextText: "",
  };
}

function getSelectedIndex(type) {
  return state[type];
}

function applyPose() {
  const { x, y, scale } = state.pose;
  elements.bonsaiObject.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
}

function resetPose() {
  state.pose.x = 0;
  state.pose.y = 0;
  state.pose.scale = 1;
  applyPose();
}

function updateSceneLayers() {
  const containerPath = ASSETS.containers[state.container - 1];
  setImage(elements.containerLayer, containerPath, true);

  if (state.step === 1) {
    elements.plantLayer.classList.remove("is-visible");
    elements.plantLayer.removeAttribute("src");
    return;
  }

  if (state.step === 2) {
    setImage(elements.plantLayer, ASSETS.branches[state.branch - 1], true);
    return;
  }

  setImage(elements.plantLayer, getComboPath(), true);
}

function updateStepUI() {
  const config = getStepConfig();
  elements.stepInstruction.textContent = config.instruction;
  elements.selectionSummary.textContent = `容器：${padIndex(state.container)} · 枝干：${padIndex(state.branch)} · 叶片：${padIndex(state.leaf)}`;

  elements.stepPills.forEach((pill) => {
    const step = Number(pill.dataset.step);
    pill.classList.toggle("is-active", step === state.step);
  });

  elements.prevStepButton.disabled = state.step === 1;
  elements.prevStepButton.classList.toggle("is-disabled", state.step === 1);
  elements.nextStepButton.classList.toggle("is-hidden", state.step === 3);
  elements.finishBonsaiButton.classList.toggle("is-hidden", state.step !== 3);
  elements.nextStepButton.textContent = config.nextText;
}

function renderChoices() {
  const config = getStepConfig();
  const selectedIndex = getSelectedIndex(config.type);
  elements.choiceGrid.innerHTML = "";

  config.paths.forEach((path, index) => {
    const assetIndex = index + 1;
    const button = document.createElement("button");
    const image = document.createElement("img");
    const text = document.createElement("span");

    button.type = "button";
    button.className = "choice-button";
    button.classList.toggle("is-active", selectedIndex === assetIndex);
    image.src = path;
    image.alt = `${config.label} ${padIndex(assetIndex)}`;
    text.textContent = `${config.label} ${padIndex(assetIndex)}`;

    button.append(image, text);
    button.addEventListener("click", () => selectCurrentStepAsset(assetIndex));
    elements.choiceGrid.append(button);
  });
}

function renderStep() {
  updateSceneLayers();
  updateStepUI();
  renderChoices();
}

function goToStep(step) {
  state.step = clamp(step, 1, 3);
  renderStep();
}

function selectCurrentStepAsset(index) {
  const { type } = getStepConfig();
  state[type] = index;
  renderStep();
}

function renderResult() {
  setImage(elements.resultContainerLayer, ASSETS.containers[state.container - 1], true);
  setImage(elements.resultPlantLayer, getComboPath(), true);
  elements.resultChoices.innerHTML = `
    <li>容器：${padIndex(state.container)}</li>
    <li>枝干：${padIndex(state.branch)}</li>
    <li>叶片：${padIndex(state.leaf)}</li>
  `;
}

function getPointerList() {
  return Array.from(pointers.values());
}

function getDistance(pointA, pointB) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function getMidpoint(pointA, pointB) {
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
  };
}

function beginGesture() {
  const activePointers = getPointerList();

  if (activePointers.length === 1) {
    gesture = {
      mode: "drag",
      startPoint: activePointers[0],
      startX: state.pose.x,
      startY: state.pose.y,
    };
    return;
  }

  if (activePointers.length >= 2) {
    const [pointA, pointB] = activePointers;
    gesture = {
      mode: "pinch",
      startDistance: getDistance(pointA, pointB),
      startMidpoint: getMidpoint(pointA, pointB),
      startX: state.pose.x,
      startY: state.pose.y,
      startScale: state.pose.scale,
    };
  }
}

function handlePointerDown(event) {
  event.preventDefault();
  elements.cameraPanel.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  beginGesture();
}

function handlePointerMove(event) {
  if (!pointers.has(event.pointerId) || !gesture) return;

  event.preventDefault();
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const activePointers = getPointerList();

  if (activePointers.length === 1 && gesture.mode === "drag") {
    const point = activePointers[0];
    state.pose.x = gesture.startX + point.x - gesture.startPoint.x;
    state.pose.y = gesture.startY + point.y - gesture.startPoint.y;
    applyPose();
    return;
  }

  if (activePointers.length >= 2) {
    if (gesture.mode !== "pinch") {
      beginGesture();
      return;
    }

    const [pointA, pointB] = activePointers;
    const distance = getDistance(pointA, pointB);
    const midpoint = getMidpoint(pointA, pointB);
    const ratio = distance / Math.max(gesture.startDistance, 1);

    state.pose.scale = clamp(gesture.startScale * ratio, 0.45, 2.4);
    state.pose.x = gesture.startX + midpoint.x - gesture.startMidpoint.x;
    state.pose.y = gesture.startY + midpoint.y - gesture.startMidpoint.y;
    applyPose();
  }
}

function handlePointerEnd(event) {
  pointers.delete(event.pointerId);
  if (pointers.size === 0) {
    gesture = null;
    return;
  }
  beginGesture();
}

function handleWheel(event) {
  event.preventDefault();
  const scaleFactor = event.deltaY > 0 ? 0.94 : 1.06;
  state.pose.scale = clamp(state.pose.scale * scaleFactor, 0.45, 2.4);
  applyPose();
}

function preloadImage(path) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ path, ok: true });
    image.onerror = () => {
      console.error("图片加载失败：", path);
      resolve({ path, ok: false });
    };
    image.src = path;
  });
}

async function preloadAssets() {
  const paths = [
    ...ASSETS.containers,
    ...ASSETS.branches,
    ...ASSETS.leaves,
    ...getAllComboPaths(),
  ];
  const results = await Promise.all(paths.map(preloadImage));
  const missingCount = results.filter((result) => !result.ok).length;

  if (missingCount > 0) {
    setCameraMessage(`有 ${missingCount} 张素材未找到，请检查 assets 文件夹中的命名。`, "error");
  }
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setCameraMessage("当前浏览器暂不支持摄像头功能，请使用手机 Chrome 或 Safari 打开。", "error");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });

    state.stream = stream;
    elements.cameraVideo.srcObject = stream;
    elements.cameraFallback.style.display = "none";
    setCameraMessage("摄像头已开启。可单指拖动，双指缩放盆景。", "success");
  } catch (error) {
    console.warn("摄像头权限或启动失败：", error);
    setCameraMessage("请允许摄像头权限，才能体验 AR 盆景拼装。", "error");
  }
}

function stopCamera() {
  if (!state.stream) return;
  state.stream.getTracks().forEach((track) => track.stop());
  state.stream = null;
  elements.cameraVideo.srcObject = null;
  elements.cameraFallback.style.display = "grid";
}

function bindEvents() {
  elements.startExperienceButton.addEventListener("click", () => {
    showPage("gamePage");
    goToStep(1);
    startCamera();
  });

  elements.backHomeButton.addEventListener("click", () => {
    stopCamera();
    showPage("homePage");
  });

  elements.resetPoseButton.addEventListener("click", resetPose);
  elements.prevStepButton.addEventListener("click", () => goToStep(state.step - 1));
  elements.nextStepButton.addEventListener("click", () => goToStep(state.step + 1));
  elements.finishBonsaiButton.addEventListener("click", () => {
    renderResult();
    showPage("resultPage");
  });

  elements.stepPills.forEach((pill) => {
    pill.addEventListener("click", () => goToStep(Number(pill.dataset.step)));
  });

  elements.remixButton.addEventListener("click", () => {
    showPage("gamePage");
    goToStep(1);
  });

  elements.resultHomeButton.addEventListener("click", () => {
    stopCamera();
    showPage("homePage");
  });

  elements.cameraPanel.addEventListener("pointerdown", handlePointerDown);
  elements.cameraPanel.addEventListener("pointermove", handlePointerMove);
  elements.cameraPanel.addEventListener("pointerup", handlePointerEnd);
  elements.cameraPanel.addEventListener("pointercancel", handlePointerEnd);
  elements.cameraPanel.addEventListener("wheel", handleWheel, { passive: false });
}

function init() {
  bindEvents();
  resetPose();
  renderStep();
  preloadAssets();
}

init();
