/**
 * Service Worker 등록
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration.scope);
                
                // 업데이트 확인
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // 새 버전 사용 가능
                            if (confirm('새로운 버전이 있습니다. 업데이트하시겠습니까?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// PWA 설치 프롬프트
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // 설치 배너 표시 (옵션)
    showInstallBanner();
});

function showInstallBanner() {
    // 이미 설치되었거나 배너를 닫은 경우 표시하지 않음
    if (localStorage.getItem('installBannerDismissed') === 'true') return;
    
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        max-width: 90%;
        animation: slideUp 0.3s ease;
    `;
    
    banner.innerHTML = `
        <i class="fas fa-download" style="font-size: 1.5rem; color: #1e40af;"></i>
        <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 0.25rem;">앱 설치</div>
            <div style="font-size: 0.875rem; color: #64748b;">
                홈 화면에 추가하여 편리하게 사용하세요
            </div>
        </div>
        <button id="install-btn" style="
            background: #1e40af;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        ">설치</button>
        <button id="dismiss-btn" style="
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-size: 1.25rem;
            padding: 0.5rem;
        ">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(banner);
    
    // 설치 버튼 클릭
    document.getElementById('install-btn').addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        
        deferredPrompt = null;
        banner.remove();
    });
    
    // 닫기 버튼 클릭
    document.getElementById('dismiss-btn').addEventListener('click', () => {
        localStorage.setItem('installBannerDismissed', 'true');
        banner.remove();
    });
}

// 설치 완료
window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
});

// 온라인/오프라인 상태 감지
window.addEventListener('online', () => {
    console.log('Back online');
    if (app && app.showToast) {
        app.showToast('인터넷에 연결되었습니다', 'success');
    }
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    if (app && app.showToast) {
        app.showToast('오프라인 모드입니다', 'warning');
    }
});
