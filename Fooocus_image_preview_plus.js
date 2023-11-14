// ==UserScript==
// @name         Fooocus image preview plus(图像预览增强)
// @version      1.0
// @license      GPL-3.0
// @description  使用空格键或鼠标中键放大图像,再次操作退出放大模式.另外在放大模式下实现:1,键盘左右箭头切换图片, 2,鼠标滚轮缩放图片,双击左键重置居中缩放.3,按住鼠标左键拖放移动图片查看细节等功能.
// @match        http://127.0.0.1:7860/*
// @match        http://127.0.0.1:7861/*
// @author       Candy3333(糖果)
// ==/UserScript==

(function() {
    'use strict';

    let images = [];
    let currentIndex = -1;
    let overlay = createOverlay();
    let hoveredElement = null;
    let zoomFactor = 1; // 初始化缩放因子
    let isDragging = false;
    let dragStartX, dragStartY;
    let imgPosX = 0, imgPosY = 0;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    document.addEventListener('mouseover', function(e) {
        if (e.target.dataset.testid === 'detailed-image') {
            hoveredElement = e.target;
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target === hoveredElement) {
            hoveredElement = null;
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.style.display === 'block') { // 按 ESC 退出放大模式
            e.preventDefault();
            overlay.style.display = 'none';
            resetImageTransform();
        } else if (e.key === ' ' && hoveredElement && overlay.style.display !== 'block') {
            e.preventDefault();
            toggleFullscreen();
        } else if (e.key === ' ' && overlay.style.display === 'block') {
            e.preventDefault();
            overlay.style.display = 'none';
            resetImageTransform();
        } else if (overlay.style.display === 'block') {
            if (e.key === 'ArrowRight') {
                navigateImages(1);
            } else if (e.key === 'ArrowLeft') {
                navigateImages(-1);
            }
        }
    });

    document.addEventListener('mousedown', function(e) {
        if (e.target.dataset.testid === 'detailed-image' && e.button === 1) { // 中键点击图片
            e.preventDefault();
            hoveredElement = e.target;
            toggleFullscreen();
        }
    });

    overlay.addEventListener('mousedown', function(e) {
        if (e.button === 1) { // 中键点击悬浮层
            e.preventDefault();
            if (overlay.style.display === 'block') {
                overlay.style.display = 'none';
                resetImageTransform();
            }
        } else if (overlay.style.display === 'block' && e.button === 0) { // 左键点击悬浮层
            e.preventDefault();
            isDragging = true;
            overlay.style.cursor = 'grabbing';
            dragStartX = e.clientX - imgPosX;
            dragStartY = e.clientY - imgPosY;
        }
    });

    window.addEventListener('mousemove', function(e) {
        if (isDragging) {
            imgPosX = e.clientX - dragStartX;
            imgPosY = e.clientY - dragStartY;
            applyImageTransform();
        }
    });

    window.addEventListener('mouseup', function(e) {
        if (e.button === 0) {
            isDragging = false;
            overlay.style.cursor = 'grab';
        }
    });

    overlay.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (overlay.style.display === 'block') {
            const rect = overlay.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - (windowWidth / 2);
            const mouseY = e.clientY - rect.top - (windowHeight / 2);
            const zoomDelta = e.deltaY < 0 ? 1.05 : 0.95; // 细化缩放幅度
            const newZoomFactor = Math.min(Math.max(zoomFactor * zoomDelta, 0.2), 3); // 限制缩放范围在20%至300%
            imgPosX -= mouseX * (newZoomFactor - zoomFactor);
            imgPosY -= mouseY * (newZoomFactor - zoomFactor);
            zoomFactor = newZoomFactor;
            applyImageTransform();
        }
    });

    overlay.addEventListener('dblclick', function(e) {
        if (overlay.style.display === 'block') {
            resetImageTransform();
        }
    });

    function applyImageTransform() {
        let img = overlay.querySelector('img');
        if (img) {
            img.style.transform = `translate(${imgPosX}px, ${imgPosY}px) scale(${zoomFactor})`;
            img.style.transformOrigin = 'center'; // 设置变换原点为中心
        }
    }

    function resetImageTransform() {
        zoomFactor = 1;
        imgPosX = 0;
        imgPosY = 0;
        applyImageTransform();
    }

    let observer = new MutationObserver(updateImageList);
    observer.observe(document.body, { childList: true, subtree: true });

    function updateImageList() {
        images = Array.from(document.querySelectorAll('[data-testid="detailed-image"]'));
    }

    function toggleFullscreen() {
        updateImageList();
        currentIndex = images.indexOf(hoveredElement);
        if (currentIndex === -1) return;

        overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
        updateOverlayImage();
        resetImageTransform();
        overlay.style.cursor = overlay.style.display === 'block' ? 'grab' : '';
    }

    function navigateImages(direction) {
        currentIndex += direction;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }
        updateOverlayImage();
    }

    function updateOverlayImage() {
        let imgSrc = images[currentIndex].src;
        let img = overlay.querySelector('img');
        img.src = imgSrc;
        img.onload = function() {
            centerImage(img);
            applyImageTransform();
        };
    }

    function centerImage(img) {
        img.style.maxWidth = `${img.naturalWidth}px`;
        img.style.maxHeight = `${img.naturalHeight}px`;
        img.style.position = 'absolute';
        img.style.left = `${(windowWidth - img.naturalWidth) / 2}px`;
        img.style.top = `${(windowHeight - img.naturalHeight) / 2}px`;
        img.style.transformOrigin = 'center'; // 设置变换原点为中心
    }

    function createOverlay() {
        let overlayDiv = document.createElement('div');
        overlayDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.8);display:none;z-index:10000;';
        let img = document.createElement('img');
        overlayDiv.appendChild(img);
        document.body.appendChild(overlayDiv);
        return overlayDiv;
    }
})();
