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
  references: {
    "1-1": "assets/reference/combo_branch01_leaf01.png",
    "1-2": "assets/reference/combo_branch01_leaf02.png",
    "1-3": "assets/reference/combo_branch01_leaf03.png",
    "2-1": "assets/reference/combo_branch02_leaf01.png",
    "2-2": "assets/reference/combo_branch02_leaf02.png",
    "2-3": "assets/reference/combo_branch02_leaf03.png",
    "3-1": "assets/reference/combo_branch03_leaf01.png",
    "3-2": "assets/reference/combo_branch03_leaf02.png",
    "3-3": "assets/reference/combo_branch03_leaf03.png",
  },
};

const state = {
  container: 1,
  branch: 1,
  leaf: 1,
  activeTuneLayer: "container",
  referenceStatus: new Map(),
  tuning: {
    container: { x: 0, y: 0, scale: 100 },
    combo: { x: 0, y: 0, scale: 100 },
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const els = {
  pages: $$(".page"),
  homePage: $("#homePage"),
  gamePage: $("#gamePage"),
  resultPage: $("#resultPage"),
  startExperienceButton: $("#startExperienceButton"),
  backHomeButton: $("#backHomeButton"),
  finishButton: $("#finishButton"),
  remixButton: $("#remixButton"),
  resultHomeButton: $("#resultHomeButton"),
  video: $("#cameraVideo"),
  cameraFallback: $("#cameraFallback"),
  cameraMessage: $("#cameraMessage"),
  containerLayer: $("#containerLayer"),
  comboLayer: $("#comboLayer"),
  branchFallbackLayer: $("#branchFallbackLayer"),
  leafFallbackLayer: $("#leafFallbackLayer"),
  resultContainer: $("#resultContainer"),
  resultCombo: $("#resultCombo"),
  resultBranchFallback: $("#resultBranchFallback"),
  resultLeafFallback: $("#resultLeafFallback"),
  containerOptions: $("#containerOptions"),
  branchOptions: $("#branchOptions"),
  leafOptions: $("#leafOptions"),
  tuneX: $("#tuneX"),
  tuneY: $("#tuneY"),
  tuneScale: $("#tuneScale"),
  tuneOutput: $("#tuneOutput"),
};

function showPage(pageId) {
  els.pages.forEach((page) => {
    page.classList.toggle("is-active", page.id === pageId);
  });
}

function setCameraMessage(text, type = "normal") {
  els.cameraMessage.textContent = text;
  els.cameraMessage.classList.toggle("is-error", type === "error");
  els.cameraMessage.classList.toggle("is-success", type === "success");
}

function padIndex(index) {
  return String(index).padStart(2, "0");
}

function setImage(element, path, visible = true) {
  element.src = path;
  element.classList.toggle("is-visible", visible);
}

function getReferencePath() {
  return ASSETS.references[`${state.branch}-${state.leaf}`];
}

function getActiveAdjustment(layerName) {
  return state.tuning[layerName];
}

function buildTransform(layerName) {
  const { x, y, scale } = getActiveAdjustment(layerName);
  return `translateX(calc(-50% + ${x}px)) translateY(${y}px) scale(${scale / 100})`;
}

function applyTuning() {
  const containerTransform = buildTransform("container");
  const comboTransform = buildTransform("combo");

  els.containerLayer.style.transform = containerTransform;
  els.resultContainer.style.transform = containerTransform;

  [els.comboLayer, els.branchFallbackLayer, els.leafFallbackLayer, els.resultCombo, els.resultBranchFallback, els.resultLeafFallback].forEach((element) => {
    element.style.transform = comboTransform;
  });

  updateTuneControls();
  updateTuneOutput();
}

function updateTuneControls() {
  const current = getActiveAdjustment(state.activeTuneLayer);
  els.tuneX.value = current.x;
  els.tuneY.value = current.y;
  els.tuneScale.value = current.scale;
}

function updateTuneOutput() {
  els.tuneOutput.textContent = JSON.stringify(state.tuning, null, 2);
}

function hideFallbackLayers() {
  els.branchFallbackLayer.classList.remove("is-visible");
  els.leafFallbackLayer.classList.remove("is-visible");
  els.resultBranchFallback.classList.remove("is-visible");
  els.resultLeafFallback.classList.remove("is-visible");
}

function showFallbackLayers() {
  els.comboLayer.classList.remove("is-visible");
  els.resultCombo.classList.remove("is-visible");
  els.branchFallbackLayer.classList.add("is-visible");
  els.leafFallbackLayer.classList.add("is-visible");
  els.resultBranchFallback.classList.add("is-visible");
  els.resultLeafFallback.classList.add("is-visible");
}

// 如何切换容器：根据用户选择的序号读取 assets/container/container_01.png 到 container_03.png。
function updateContainer(index) {
  state.container = index;
  const path = ASSETS.containers[index - 1];
  setImage(els.containerLayer, path);
  setImage(els.resultContainer, path);
}

// 如何切换枝干：更新枝干缩略图选择，并触发 reference 组合图刷新。
function updateBranch(index) {
  state.branch = index;
  const path = ASSETS.branches[index - 1];
  setImage(els.branchFallbackLayer, path);
  setImage(els.resultBranchFallback, path);
  updateCombo();
}

// 如何切换叶片：更新叶片缩略图选择，并触发 reference 组合图刷新。
function updateLeaf(index) {
  state.leaf = index;
  const path = ASSETS.leaves[index - 1];
  setImage(els.leafFallbackLayer, path);
  setImage(els.resultLeafFallback, path);
  updateCombo();
}

// 如何根据 branch + leaf 组合选择 reference 图片：用 “枝干序号-叶片序号” 映射到 9 张 combo_branchXX_leafXX.png。
function updateCombo() {
  const referencePath = getReferencePath();
  const hasReference = state.referenceStatus.get(referencePath) === true;

  if (hasReference) {
    setImage(els.comboLayer, referencePath);
    setImage(els.resultCombo, referencePath);
    hideFallbackLayers();
  } else {
    console.warn(`组合参考图未找到，已使用枝干和叶片备用层：${referencePath}`);
    showFallbackLayers();
  }
}

function refreshChoiceButtons() {
  $$(".choice-button").forEach((button) => {
    const type = button.dataset.type;
    const index = Number(button.dataset.index);
    button.classList.toggle("is-active", state[type] === index);
  });
}

function selectAsset(type, index) {
  if (type === "container") updateContainer(index);
  if (type === "branch") updateBranch(index);
  if (type === "leaf") updateLeaf(index);
  refreshChoiceButtons();
}

function createChoiceButton(type, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-button";
  button.dataset.type = type;
  button.dataset.index = String(index);
  button.textContent = `${type === "container" ? "器" : type === "branch" ? "枝" : "叶"} ${padIndex(index)}`;
  button.addEventListener("click", () => selectAsset(type, index));
  return button;
}

function renderChoiceButtons() {
  for (let index = 1; index <= 3; index += 1) {
    els.containerOptions.append(createChoiceButton("container", index));
    els.branchOptions.append(createChoiceButton("branch", index));
    els.leafOptions.append(createChoiceButton("leaf", index));
  }
}

function switchPanel(panelId) {
  $$(".tab-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panel === panelId);
  });
  $$(".asset-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === panelId);
  });
}

function switchTuneLayer(layerName) {
  state.activeTuneLayer = layerName;
  $$(".layer-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.layer === layerName);
  });
  updateTuneControls();
}

function updateCurrentTuneValue(key, value) {
  state.tuning[state.activeTuneLayer][key] = Number(value);
  applyTuning();
}

function preloadImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ path, ok: true });
    img.onerror = () => {
      console.warn(`图片加载失败，请检查相对路径和文件名：${path}`);
      resolve({ path, ok: false });
    };
    img.src = path;
  });
}

async function preloadAssets() {
  const paths = [
    ...ASSETS.containers,
    ...ASSETS.branches,
    ...ASSETS.leaves,
    ...Object.values(ASSETS.references),
  ];

  const results = await Promise.all(paths.map(preloadImage));
  results.forEach(({ path, ok }) => {
    if (path.startsWith("assets/reference/")) {
      state.referenceStatus.set(path, ok);
    }
  });

  const missingBase = results.filter(({ path, ok }) => !ok && !path.startsWith("assets/reference/")).length;
  const missingReference = results.filter(({ path, ok }) => !ok && path.startsWith("assets/reference/")).length;

  if (missingBase > 0) {
    setCameraMessage(`有 ${missingBase} 张基础素材未找到，请检查 assets 下的文件名。`, "error");
  } else if (missingReference > 0) {
    setCameraMessage("基础素材已加载；部分组合参考图未找到，当前会使用枝干和叶片备用层。");
  }

  updateCombo();
}

// 如何调用摄像头：GitHub Pages 提供 HTTPS，手机浏览器可通过 getUserMedia 请求权限；本地请用 localhost 测试。
async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setCameraMessage("当前浏览器暂不支持摄像头功能，请使用手机 Chrome 或 Safari 打开。", "error");
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
    els.video.srcObject = stream;
    els.cameraFallback.style.display = "none";
    setCameraMessage("摄像头已开启，选择素材完成你的苏派盆景吧。", "success");
    return true;
  } catch (error) {
    console.warn("摄像头权限或启动失败：", error);
    setCameraMessage("请允许摄像头权限，才能体验 AR 盆景拼装。", "error");
    return false;
  }
}

function resetGame() {
  updateContainer(1);
  updateBranch(1);
  updateLeaf(1);
  state.tuning.container = { x: 0, y: 0, scale: 100 };
  state.tuning.combo = { x: 0, y: 0, scale: 100 };
  state.activeTuneLayer = "container";
  switchTuneLayer("container");
  applyTuning();
  refreshChoiceButtons();
}

// 如何部署到 GitHub Pages：项目只依赖相对路径、index.html、style.css、script.js 和 assets 文件夹，可部署在仓库子路径。
function bindEvents() {
  els.startExperienceButton.addEventListener("click", async () => {
    showPage("gamePage");
    await startCamera();
  });

  els.backHomeButton.addEventListener("click", () => showPage("homePage"));
  els.finishButton.addEventListener("click", () => showPage("resultPage"));
  els.remixButton.addEventListener("click", () => showPage("gamePage"));
  els.resultHomeButton.addEventListener("click", () => showPage("homePage"));

  $$(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchPanel(button.dataset.panel));
  });

  $$(".layer-button").forEach((button) => {
    button.addEventListener("click", () => switchTuneLayer(button.dataset.layer));
  });

  els.tuneX.addEventListener("input", (event) => updateCurrentTuneValue("x", event.target.value));
  els.tuneY.addEventListener("input", (event) => updateCurrentTuneValue("y", event.target.value));
  els.tuneScale.addEventListener("input", (event) => updateCurrentTuneValue("scale", event.target.value));
}

function init() {
  renderChoiceButtons();
  bindEvents();
  resetGame();
  preloadAssets();
}

init();
