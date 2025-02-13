// 获取元素
const image1Input = document.getElementById('image1');
const image2Input = document.getElementById('image2');
const swapButton = document.getElementById('swapButton');
const dragDropArea = document.getElementById('dragDropArea');
const preview1Canvas = document.getElementById('preview1');
const preview2Canvas = document.getElementById('preview2');
const modal = document.getElementById('modal');
const modalCanvas = document.getElementById('modalCanvas');
const closeModal = document.querySelector('.close');

// 所有混合模式的画布
const blendModeCanvases = {
    darken: document.getElementById('darken'),
    multiply: document.getElementById('multiply'),
    'color-burn': document.getElementById('color-burn'),
    'linear-burn': document.getElementById('linear-burn'),
    'darker-color': document.getElementById('darker-color'),
    lighten: document.getElementById('lighten'),
    screen: document.getElementById('screen'),
    'color-dodge': document.getElementById('color-dodge'),
    'linear-dodge': document.getElementById('linear-dodge'),
    'lighter-color': document.getElementById('lighter-color'),
    overlay: document.getElementById('overlay'),
    'soft-light': document.getElementById('soft-light'),
    'hard-light': document.getElementById('hard-light'),
    'vivid-light': document.getElementById('vivid-light'),
    'linear-light': document.getElementById('linear-light'),
    'pin-light': document.getElementById('pin-light'),
    'hard-mix': document.getElementById('hard-mix'),
    difference: document.getElementById('difference'),
    exclusion: document.getElementById('exclusion'),
    subtract: document.getElementById('subtract'),
    divide: document.getElementById('divide'),
    hue: document.getElementById('hue'),
    saturation: document.getElementById('saturation'),
    color: document.getElementById('color'),
    luminosity: document.getElementById('luminosity'),
};

// 混合模式的中文名称
const blendModeNames = {
    darken: '变暗',
    multiply: '正片叠底',
    'color-burn': '颜色加深',
    'linear-burn': '线性加深',
    'darker-color': '深色',
    lighten: '变亮',
    screen: '滤色',
    'color-dodge': '颜色减淡',
    'linear-dodge': '线性减淡',
    'lighter-color': '浅色',
    overlay: '叠加',
    'soft-light': '柔光',
    'hard-light': '强光',
    'vivid-light': '亮光',
    'linear-light': '线性光',
    'pin-light': '点光',
    'hard-mix': '实色混合',
    difference: '差值',
    exclusion: '排除',
    subtract: '减去',
    divide: '划分',
    hue: '色相',
    saturation: '饱和度',
    color: '颜色',
    luminosity: '明度',
};

let image1, image2;

// 加载图片
function loadImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            callback(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 绘制图片到画布（保持比例）
function drawImageToCanvas(canvas, image) {
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // 计算缩放比例
    const scale = Math.min(containerWidth / image.width, containerHeight / image.height);
    const width = image.width * scale;
    const height = image.height * scale;

    // 设置画布大小
    canvas.width = width;
    canvas.height = height;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制图片
    ctx.drawImage(image, 0, 0, width, height);
}

// 绘制混合效果
function drawBlendMode(canvas, mode) {
    const ctx = canvas.getContext('2d');
    const width = Math.max(image1.width, image2.width);
    const height = Math.max(image1.height, image2.height);

    // 设置画布大小
    canvas.width = width;
    canvas.height = height;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制第一张图片
    ctx.drawImage(image1, 0, 0, width, height);

    // 设置混合模式
    ctx.globalCompositeOperation = mode;

    // 绘制第二张图片
    ctx.drawImage(image2, 0, 0, width, height);
}

// 重新渲染所有效果
function renderAllEffects() {
    if (image1 && image2) {
        // 更新预览
        drawImageToCanvas(preview1Canvas, image1);
        drawImageToCanvas(preview2Canvas, image2);

        // 更新混合模式效果
        for (const [mode, canvas] of Object.entries(blendModeCanvases)) {
            drawBlendMode(canvas, mode.replace('-', ''));
        }
    }
}

// 生成范例图
function createExampleImages() {
    // 范例图 1：黑白渐变
    const canvas1 = document.createElement('canvas');
    canvas1.width = 200;
    canvas1.height = 200;
    const ctx1 = canvas1.getContext('2d');
    const gradient1 = ctx1.createLinearGradient(0, 0, 200, 0);
    gradient1.addColorStop(0, 'black');
    gradient1.addColorStop(1, 'white');
    ctx1.fillStyle = gradient1;
    ctx1.fillRect(0, 0, 200, 200);

    // 范例图 2：彩色字母
    const canvas2 = document.createElement('canvas');
    canvas2.width = 200;
    canvas2.height = 200;
    const ctx2 = canvas2.getContext('2d');
    ctx2.fillStyle = 'red';
    ctx2.font = '100px Arial';
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';
    ctx2.fillText('A', 100, 100);

    // 将范例图转换为 Image 对象
    const image1 = new Image();
    image1.src = canvas1.toDataURL();
    const image2 = new Image();
    image2.src = canvas2.toDataURL();

    // 加载范例图
    image1.onload = () => {
        image2.onload = () => {
            window.image1 = image1;
            window.image2 = image2;
            renderAllEffects();
        };
    };
}

// 页面加载时生成范例图
window.onload = () => {
    createExampleImages();
};

// 监听文件输入变化
image1Input.addEventListener('change', () => {
    loadImage(image1Input.files[0], (img) => {
        image1 = img;
        renderAllEffects();
    });
});

image2Input.addEventListener('change', () => {
    loadImage(image2Input.files[0], (img) => {
        image2 = img;
        renderAllEffects();
    });
});

// 调换图片顺序
swapButton.addEventListener('click', () => {
    if (image1 && image2) {
        [image1, image2] = [image2, image1];
        renderAllEffects();
    } else {
        alert('请先加载两张图片！');
    }
});

// 拖入图片
dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('dragover');
});

dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('dragover');
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length === 2) {
        loadImage(files[0], (img) => {
            image1 = img;
            loadImage(files[1], (img) => {
                image2 = img;
                renderAllEffects();
            });
        });
    } else {
        alert('请拖入两张图片！');
    }
});

// 粘贴图片
document.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    let imageCount = 0;

    for (const item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            loadImage(file, (img) => {
                if (imageCount === 0) {
                    image1 = img;
                    imageCount++;
                } else if (imageCount === 1) {
                    image2 = img;
                    renderAllEffects();
                }
            });
        }
    }
});
// 获取模态框切换按钮
const swapModalButton = document.getElementById('swapModalButton');
const modalTitle = document.getElementById('modalTitle');

let currentMode = '';

// 点击效果图放大
for (const [mode, canvas] of Object.entries(blendModeCanvases)) {
    canvas.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalCanvas.width = canvas.width;
        modalCanvas.height = canvas.height;
        const ctx = modalCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0);

        // 显示当前模式名称
        currentMode = mode;
        modalTitle.textContent = `当前模式：${blendModeNames[mode]}`;
    });
}

// 切换模态框中的图层顺序
swapModalButton.addEventListener('click', () => {
    if (image1 && image2) {
        [image1, image2] = [image2, image1];
        drawBlendMode(modalCanvas, currentMode.replace('-', ''));
    }
});

// 关闭模态框
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

