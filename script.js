document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const aiButtons = document.querySelectorAll('.ai-button');

    // 页面加载后将光标聚焦到输入框
    searchInput.focus();

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

            // 如果搜索框有内容，拼接查询参数
            const finalUrl = type === 'search' && query ? `${url}${encodeURIComponent(query)}` : url;

            // 打开链接页面
            const newWindow = window.open(finalUrl, "_blank");

            // 检查目标页面是否弹出登录注册提示框
            newWindow.onload = function () {
                try {
                    // 判断是否存在登录注册提示框
                    const loginPrompt = newWindow.document.querySelector('.login-prompt'); // 假设登录提示框的类名为 "login-prompt"
                    if (loginPrompt) {
                        console.log("目标页面弹出了登录注册提示框，等待用户操作...");
                        return; // 不做任何操作，等待用户处理登录注册
                    }

                    // 如果没有弹出登录注册界面，尝试将搜索框内容粘贴到聊天输入框
                    const chatInput = newWindow.document.querySelector('.chat-input'); // 假设聊天输入框的类名为 "chat-input"
                    if (chatInput) {
                        chatInput.value = query; // 将搜索框内容粘贴到聊天输入框
                        console.log("搜索框内容已粘贴到目标页面的聊天输入框。");
                    } else {
                        console.log("目标页面没有找到聊天输入框。");
                    }
                } catch (error) {
                    console.error("无法访问目标页面内容，可能受到跨域限制。", error);
                }
            };
        });
    });
});

// 语言切换功能
const translations = {
    zh: {
        title: "特斯拉AI导航",
        header: "特斯拉 AI 导航",
        "search-placeholder": "请在此输入您的问题...",
        "tab-china": "中国",
        "tab-usa": "美国",
        "button-deepseek": "DeepSeek",
        "button-metaso": "MetaSo",
        "button-kimi": "Kimi AI",
        "button-tongyi": "通义千问",
        "button-doubao": "豆包",
        "button-gemini": "Google Gemini",
        "button-perplexity": "Perplexity AI",
        "button-chatgpt": "OpenAI ChatGPT",
        "button-claude": "Anthropic Claude",
        "button-grok": "Grok"
    },
    en: {
        title: "Tesla AI Navigation",
        header: "Tesla AI Navigation",
        "search-placeholder": "Enter your question here...",
        "tab-china": "China",
        "tab-usa": "USA",
        "button-deepseek": "DeepSeek",
        "button-metaso": "MetaSo",
        "button-kimi": "Kimi AI",
        "button-tongyi": "Tongyi Qianwen",
        "button-doubao": "Doubao",
        "button-gemini": "Google Gemini",
        "button-perplexity": "Perplexity AI",
        "button-chatgpt": "OpenAI ChatGPT",
        "button-claude": "Anthropic Claude",
        "button-grok": "Grok"
    }
};

function switchLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
            // 更新输入框的 placeholder 属性
            el.setAttribute("placeholder", translations[lang][key]);
        } else {
            el.textContent = translations[lang][key];
        }
    });

    // 更新 HTML 的 lang 属性
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-lang", lang);

    // 单独处理 data-i18n-placeholder 的元素
    const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
    placeholderElements.forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.setAttribute("placeholder", translations[lang][key]);
    });
}

// Tab 切换功能
function openTab(evt, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.style.display = 'none');

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(tabName).style.display = 'grid';
    evt.currentTarget.classList.add('active');

    // 切换语言
    if (tabName === "USA") {
        switchLanguage("en");
    } else if (tabName === "China") {
        switchLanguage("zh");
    }
}