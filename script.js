const projects = {
  ejina: {
    type: "remoteVideo",
    title: "《额济纳·一眼千年》",
    embedUrl: "",
    videoUrl: "https://portfolio-2026-1438272750.cos.ap-nanjing.myqcloud.com/%E9%A2%9D%E6%B5%8E%E7%BA%B3.mp4",
    backupUrl: ""
  },
  uma: {
    type: "iframe",
    title: "赛马娘 MAD",
    embedUrl: "https://player.bilibili.com/player.html?bvid=BV1R8jt65ELG&page=1",
    videoUrl: "",
    backupUrl: "https://www.bilibili.com/video/BV1R8jt65ELG/"
  },
  umaAeTv: {
    type: "localVideo",
    title: "电视记忆窗口",
    videoUrl: "assets/uma-ae-tv.mp4",
    poster: "assets/uma-ae-tv.jpg",
    missingMessage: "视频片段待替换"
  },
  umaAeEyeSpeedline: {
    type: "localVideo",
    title: "眼部光效与速度线强化",
    videoUrl: "assets/uma-ae-eye-speedline.mp4",
    poster: "assets/uma-ae-eye-speedline.jpg",
    missingMessage: "视频片段待替换"
  },
  aeMg: {
    type: "localVideo",
    title: "AE MG 公益广告练习",
    videoUrl: "assets/ae-mg-ocean.mp4",
    missingMessage: "视频文件待替换"
  },
  maya: {
    type: "localVideo",
    title: "Maya 跳跃平台动画练习",
    videoUrl: "assets/maya-jump.mp4",
    missingMessage: "视频文件待替换"
  },
  h5: {
    type: "qr",
    title: "大广赛 H5 交互作品",
    qrUrl: "assets/h5-qr.jpg",
    linkUrl: "https://5.u.h5mc.com/c/62rf/e8hc/index.html"
  },
  renpy: {
    type: "image",
    title: "Ren’Py 文字冒险游戏",
    imageUrl: "assets/renpy-cover.jpg",
    alt: "Ren’Py 文字冒险游戏截图"
  }
};

const modal = document.querySelector("#media-modal");
const modalTitle = document.querySelector("#modal-title");
const modalBody = document.querySelector("#modal-body");
const toast = document.querySelector("#toast");
let lastFocusedElement = null;
let toastTimer = null;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

function createPlaceholderMessage(title, message) {
  const wrapper = document.createElement("div");
  wrapper.className = "modal-message";

  const mark = document.createElement("span");
  mark.className = "modal-message-mark";
  mark.textContent = "◇";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const copy = document.createElement("p");
  copy.textContent = message;

  wrapper.append(mark, heading, copy);
  return wrapper;
}

function openModal(projectKey) {
  const project = projects[projectKey];
  if (!project) return;

  lastFocusedElement = document.activeElement;
  modalTitle.textContent = project.title;
  modalBody.replaceChildren();

  if (project.type === "iframe") {
    renderIframeProject(project);
  } else if (project.type === "localVideo" || project.type === "remoteVideo") {
    renderLocalVideo(project);
  } else if (project.type === "qr") {
    renderQrProject(project);
  } else if (project.type === "image") {
    renderImageProject(project);
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function renderIframeProject(project) {
  if (!project.embedUrl.trim()) {
    modalBody.append(createPlaceholderMessage("视频链接待替换", "请在 script.js 的 projects 配置中填写 embedUrl。"));
    return;
  }

  const media = document.createElement("div");
  media.className = "modal-media";

  const iframe = document.createElement("iframe");
  iframe.src = project.embedUrl;
  iframe.title = `${project.title} 视频播放器`;
  iframe.allow = "fullscreen; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.loading = "eager";

  media.append(iframe);
  modalBody.append(media);
}

function renderLocalVideo(project) {
  const missingMessage = project.missingMessage
    || (project.type === "remoteVideo" ? "播放链接待替换" : "视频文件待替换");
  const loadErrorDetail = project.type === "remoteVideo"
    ? "当前远程视频无法加载，请检查链接或云存储访问权限。"
    : "当前视频不存在或无法加载，请替换 assets 中的对应文件。";

  if (!project.videoUrl.trim()) {
    const hint = project.type === "remoteVideo"
      ? "请在 script.js 的 projects 配置中填写远程 MP4 播放链接。"
      : "请在 script.js 的 projects 配置中填写本地视频路径。";
    modalBody.append(createPlaceholderMessage(missingMessage, hint));
    return;
  }

  const media = document.createElement("div");
  media.className = "modal-media";

  const video = document.createElement("video");
  video.controls = true;
  video.preload = "none";
  video.playsInline = true;
  video.setAttribute("aria-label", `${project.title} 视频`);
  if (project.poster) video.poster = project.poster;

  const source = document.createElement("source");
  source.addEventListener("error", () => {
    media.replaceChildren(createPlaceholderMessage(missingMessage, loadErrorDetail));
  }, { once: true });
  source.src = project.videoUrl;
  source.type = "video/mp4";
  video.append(source);

  video.addEventListener("error", () => {
    media.replaceChildren(createPlaceholderMessage(missingMessage, loadErrorDetail));
  }, { once: true });

  media.append(video);
  modalBody.append(media);
  video.load();
}

function renderQrProject(project) {
  const preview = document.createElement("div");
  preview.className = "qr-preview";

  const imageWrap = document.createElement("div");
  imageWrap.className = "qr-image-wrap";
  const placeholder = document.createElement("div");
  placeholder.className = "media-placeholder media-placeholder-blue";
  placeholder.innerHTML = "<strong>二维码待替换</strong>";
  imageWrap.append(placeholder);

  if (project.qrUrl.trim()) {
    const image = document.createElement("img");
    image.alt = "H5 交互作品二维码";
    image.addEventListener("error", () => {
      image.hidden = true;
      image.remove();
    }, { once: true });
    image.src = project.qrUrl;
    imageWrap.append(image);
  }

  const copy = document.createElement("div");
  copy.className = "qr-copy";
  const heading = document.createElement("h3");
  heading.textContent = "扫码预览 H5 交互作品";
  const description = document.createElement("p");
  description.textContent = "请使用手机扫描左侧二维码，或通过下方按钮打开 H5 页面。";
  const linkButton = document.createElement("button");
  linkButton.className = "button button-primary button-primary-blue";
  linkButton.type = "button";
  linkButton.textContent = "打开 H5 链接";
  linkButton.addEventListener("click", () => {
    if (!project.linkUrl.trim()) {
      showToast("链接待替换");
      return;
    }
    window.open(project.linkUrl, "_blank", "noopener,noreferrer");
  });

  copy.append(heading, description, linkButton);
  preview.append(imageWrap, copy);
  modalBody.append(preview);
}

function renderImageProject(project) {
  const preview = document.createElement("div");
  preview.className = "modal-image-preview";

  if (!project.imageUrl || !project.imageUrl.trim()) {
    preview.append(createPlaceholderMessage("截图待替换", "请在 script.js 的 projects 配置中填写图片路径。"));
    modalBody.append(preview);
    return;
  }

  const image = document.createElement("img");
  image.alt = project.alt || project.title;
  image.addEventListener("error", () => {
    preview.replaceChildren(createPlaceholderMessage("截图待替换", "当前图片不存在或无法加载，请替换 assets 中的对应文件。"));
  }, { once: true });
  image.src = project.imageUrl;
  preview.append(image);
  modalBody.append(preview);
}

function closeModal() {
  if (!modal.classList.contains("is-open")) return;

  const video = modalBody.querySelector("video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.querySelectorAll("source").forEach((source) => source.removeAttribute("src"));
    video.load();
  }

  const iframe = modalBody.querySelector("iframe");
  if (iframe) iframe.src = "about:blank";

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalBody.replaceChildren();

  if (lastFocusedElement) lastFocusedElement.focus();
}

function openBackup(projectKey) {
  const project = projects[projectKey];
  if (!project || !project.backupUrl || !project.backupUrl.trim()) {
    showToast("备用链接待替换");
    return;
  }
  window.open(project.backupUrl, "_blank", "noopener,noreferrer");
}

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    const action = actionButton.dataset.action;
    const projectKey = actionButton.dataset.project;
    if (action === "play") openModal(projectKey);
    if (action === "backup") openBackup(projectKey);
  }

  if (event.target.closest("[data-close-modal]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

document.querySelectorAll("img[data-fallback]").forEach((image) => {
  image.addEventListener("error", () => {
    image.hidden = true;
    image.remove();
  }, { once: true });
});

document.querySelectorAll("[data-backup-link]").forEach((link) => {
  const project = projects[link.dataset.project];
  link.hidden = !(project && project.backupUrl && project.backupUrl.trim());
});
