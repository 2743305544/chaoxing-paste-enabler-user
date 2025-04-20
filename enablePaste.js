// 学习通作业粘贴限制解除js
(function() {
    window.editorPaste = function(o, html) {
        console.log("粘贴拦截已解除");
        return true;
    };
    
    function enablePasteForAll() {
        // 找到所有可能的编辑区域
        const editors = document.querySelectorAll('textarea, [contenteditable="true"], iframe');
        editors.forEach(function(editor) {
            // 移除所有粘贴事件监听器
            editor.onpaste = null;
            editor.addEventListener('paste', function(e) {
                e.stopPropagation();
            }, true);
        });
        
        // 处理iframe中的编辑器
        document.querySelectorAll('iframe').forEach(function(iframe) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeEditors = iframeDoc.querySelectorAll('textarea, [contenteditable="true"]');
                
                iframeEditors.forEach(function(editor) {
                    editor.onpaste = null;
                    editor.addEventListener('paste', function(e) {
                        e.stopPropagation();
                    }, true);
                });
            } catch(e) {
                console.log('无法访问iframe内容:', e);
            }
        });
        
        // 处理UEditor编辑器
        if (window.UE) {
            for (let key in window.UE.instants) {
                const editor = window.UE.instants[key];
                if (editor) {
                    editor.removeListener('beforepaste');
                    editor.options.pasteFilter = false;
                }
            }
        }
        
        console.log('✅ 已解除所有编辑区域的粘贴限制');
    }
    
    // 覆盖jQuery的toast方法，防止显示"只能录入不能粘贴"提示
    if (window.$ && $.toast) {
        const originalToast = $.toast;
        $.toast = function(options) {
            if (options && options.content && options.content.includes("只能录入不能粘贴")) {
                console.log("已拦截粘贴限制提示");
                return;
            }
            return originalToast.apply(this, arguments);
        };
    }
    
    // 创建一个通知提示用户脚本已启用
    function showNotification() {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.textContent = '✅ 粘贴功能已启用！';
        
        document.body.appendChild(notification);
        
        // 3秒后自动消失
        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // 定期检查并启用粘贴功能，以防页面动态加载编辑器
    function setupPasteEnabler() {
        // 立即执行一次
        enablePasteForAll();
        showNotification();
        // 每秒检查一次，确保新加载的编辑器也能粘贴
        setInterval(enablePasteForAll, 1000);
    }
    // 如果页面已加载完成，立即执行
    if (document.readyState === 'complete') {
        setupPasteEnabler();
    } else {
        // 否则等待页面加载完成
        window.addEventListener('load', setupPasteEnabler);
    }
})();
