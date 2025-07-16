document.addEventListener('DOMContentLoaded', function() {

    const searchInput = document.getElementById('search-input');
    const voiceButton = document.getElementById('voice-button');
    const aiButtons = document.querySelectorAll('.ai-button');

    // 语音识别功能
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.interimResults = false;

        voiceButton.addEventListener('click', () => {
            try {
                recognition.start();
                voiceButton.textContent = '听取中…';
                voiceButton.style.backgroundColor = '#ff453a';
            } catch(e) {
                alert('语音识别服务可能正忙，请稍后再试。');
            }
        });

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            searchInput.value = speechResult;
        };

        recognition.onend = () => {
            voiceButton.textContent = '🎤';
            voiceButton.style.backgroundColor = '#007aff';
        };

        recognition.onerror = (event) => {
            alert(`语音识别错误: ${event.error}`);
            voiceButton.textContent = '🎤';
            voiceButton.style.backgroundColor = '#007aff';
        };

    } else {
        voiceButton.disabled = true;
        voiceButton.textContent = '🚫';
        alert('抱歉，此浏览器不支持语音识别。');
    }

    // AI 按钮点击事件
    aiButtons.forEach(button => {
        button.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (!query) {
                alert('请输入您的问题！');
                return;
            }

            const url = button.dataset.url;
            const type = button.dataset.type;

            if (type === 'search') {
                // 对于搜索类型，直接拼接URL并跳转
                const searchUrl = url + encodeURIComponent(query);
                window.open(searchUrl, '_blank');
            } else if (type === 'chat') {
                // 对于对话类型，复制到剪贴板并打开主页
                navigator.clipboard.writeText(query).then(() => {
                    alert('问题已复制！将在新页面打开，请长按输入框粘贴。');
                    window.open(url, '_blank');
                }).catch(err => {
                    alert('复制失败，可能浏览器不支持或未授权。');
                    window.open(url, '_blank'); // 即使复制失败也打开页面
                });
            }
        });
    });
});

// Tab 切换功能
function openTab(evt, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.style.display = 'none');

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(tabName).style.display = 'grid'; // 使用 grid 布局
    evt.currentTarget.classList.add('active');
}
function setRealViewportHeight() {
    // 检查 window.visualViewport 是否存在
    if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
    }
}

// 页面加载时设置一次
window.addEventListener('load', setRealViewportHeight);

// 当可视区域（比如键盘弹起或收起时）变化时，重新设置
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setRealViewportHeight);
}