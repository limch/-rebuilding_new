/**
 * 메인 애플리케이션
 * UI 제어 및 사용자 상호작용 처리
 */

class App {
    constructor() {
        this.currentChatId = null;
        this.chatHistory = [];
        this.messages = [];
        
        this.initElements();
        this.initEventListeners();
        this.loadChatHistory();
        this.loadTheme();
        this.handleURLParams();
    }

    /**
     * DOM 요소 초기화
     */
    initElements() {
        // 버튼
        this.newChatBtn = document.getElementById('new-chat-btn');
        this.historyBtn = document.getElementById('history-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.sendBtn = document.getElementById('send-btn');
        this.closeSidebarBtn = document.getElementById('close-sidebar');
        this.clearHistoryBtn = document.getElementById('clear-history-btn');

        // 입력
        this.messageInput = document.getElementById('message-input');

        // 컨테이너
        this.sidebar = document.getElementById('sidebar');
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.chatMessages = document.getElementById('chat-messages');
        this.historyList = document.getElementById('history-list');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.toast = document.getElementById('toast');

        // 퀵 질문 버튼
        this.questionCards = document.querySelectorAll('.question-card');
    }

    /**
     * 이벤트 리스너 설정
     */
    initEventListeners() {
        // 새 대화
        this.newChatBtn.addEventListener('click', () => this.startNewChat());

        // 사이드바 토글
        this.historyBtn.addEventListener('click', () => this.toggleSidebar());
        this.closeSidebarBtn.addEventListener('click', () => this.toggleSidebar());

        // 테마 토글
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // 메시지 전송
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 입력 검증
        this.messageInput.addEventListener('input', () => {
            this.validateInput();
            this.autoResizeTextarea();
        });

        // 히스토리 삭제
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // 퀵 질문
        this.questionCards.forEach(card => {
            card.addEventListener('click', () => {
                const question = card.dataset.question;
                this.messageInput.value = question;
                this.validateInput();
                this.sendMessage();
            });
        });

        // 사이드바 외부 클릭
        document.addEventListener('click', (e) => {
            if (this.sidebar.classList.contains('active') &&
                !this.sidebar.contains(e.target) &&
                e.target !== this.historyBtn) {
                this.toggleSidebar();
            }
        });
    }

    /**
     * URL 파라미터 처리
     */
    handleURLParams() {
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        
        if (action === 'new') {
            this.startNewChat();
        } else if (action === 'history') {
            this.toggleSidebar();
        }
    }

    /**
     * 새 대화 시작
     */
    startNewChat() {
        this.currentChatId = this.generateId();
        this.messages = [];
        this.chatMessages.innerHTML = '';
        this.hideWelcomeScreen();
        this.showToast('새 대화를 시작합니다', 'success');
    }

    /**
     * 메시지 전송
     */
    async sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;

        // 대화 시작 확인
        if (!this.currentChatId) {
            this.startNewChat();
        }

        // 사용자 메시지 추가
        this.addMessage('user', text);
        this.messageInput.value = '';
        this.validateInput();
        this.autoResizeTextarea();

        // 로딩 표시
        this.showLoading();

        try {
            // 챗봇 처리
            const response = await chatbot.processQuestion(text);
            
            // 약간의 딜레이로 자연스러움 연출
            await this.delay(800);
            
            // 봇 응답 추가
            this.addMessage('bot', response.answer, response.articles, response.confidence);
            
            // 히스토리 저장
            this.saveChat();
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('bot', '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.', [], 'none');
            this.showToast('오류가 발생했습니다', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 메시지 추가
     */
    addMessage(role, text, articles = [], confidence = null) {
        const message = {
            id: this.generateId(),
            role,
            text,
            articles,
            confidence,
            timestamp: new Date()
        };

        this.messages.push(message);

        const messageEl = this.createMessageElement(message);
        this.chatMessages.appendChild(messageEl);
        this.scrollToBottom();
    }

    /**
     * 메시지 요소 생성
     */
    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message ${message.role}`;
        div.innerHTML = `
            <div class="message-content">
                ${message.role === 'bot' ? `
                    <div class="message-header">
                        <i class="fas fa-robot"></i>
                        <span>법령 AI</span>
                    </div>
                ` : ''}
                <div class="message-text">${this.formatText(message.text)}</div>
                ${message.articles && message.articles.length > 0 ? this.createArticlesHTML(message.articles) : ''}
                ${message.confidence ? this.createConfidenceBadge(message.confidence) : ''}
                <div class="message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        `;
        return div;
    }

    /**
     * 법령 조항 HTML 생성
     */
    createArticlesHTML(articles) {
        if (!articles || articles.length === 0) return '';

        return `
            <div class="law-reference">
                <div class="law-reference-title">
                    <i class="fas fa-book"></i>
                    관련 법령 조항
                </div>
                ${articles.map(article => `
                    <div class="law-article">
                        <div class="law-article-number">${article.article} ${article.title || ''}</div>
                        <div class="law-article-content">${article.content}</div>
                    </div>
                `).join('')}
                <a href="https://www.law.go.kr/법령/도시및주거환경정비법" 
                   target="_blank" 
                   class="law-link">
                    <i class="fas fa-external-link-alt"></i>
                    법령 원문 보기
                </a>
            </div>
        `;
    }

    /**
     * 신뢰도 배지 생성
     */
    createConfidenceBadge(confidence) {
        const badge = chatbot.getConfidenceBadge(confidence);
        return `
            <div style="margin-top: 0.5rem; display: inline-flex; align-items: center; gap: 0.25rem; 
                        padding: 0.25rem 0.5rem; background: ${badge.color}22; 
                        color: ${badge.color}; border-radius: 4px; font-size: 0.75rem;">
                <i class="fas ${badge.icon}"></i>
                <span>${badge.text}</span>
            </div>
        `;
    }

    /**
     * 텍스트 포맷팅
     */
    formatText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '<span style="color: var(--primary-color);">•</span>');
    }

    /**
     * 시간 포맷팅
     */
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (seconds < 60) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        
        return date.toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * 대화 저장
     */
    saveChat() {
        if (!this.messages.length) return;

        const existingIndex = this.chatHistory.findIndex(c => c.id === this.currentChatId);
        const chat = {
            id: this.currentChatId,
            title: this.messages.find(m => m.role === 'user')?.text.slice(0, 50) || '새 대화',
            messages: this.messages,
            lastUpdate: new Date()
        };

        if (existingIndex >= 0) {
            this.chatHistory[existingIndex] = chat;
        } else {
            this.chatHistory.unshift(chat);
        }

        // 최대 50개 대화만 저장
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(0, 50);
        }

        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        this.renderChatHistory();
    }

    /**
     * 대화 히스토리 로드
     */
    loadChatHistory() {
        const stored = localStorage.getItem('chatHistory');
        if (stored) {
            this.chatHistory = JSON.parse(stored);
            this.renderChatHistory();
        }
    }

    /**
     * 대화 히스토리 렌더링
     */
    renderChatHistory() {
        if (!this.chatHistory.length) {
            this.historyList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-tertiary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p>대화 히스토리가 없습니다</p>
                </div>
            `;
            return;
        }

        this.historyList.innerHTML = this.chatHistory.map(chat => `
            <div class="history-item" data-chat-id="${chat.id}">
                <div class="history-item-title">${chat.title}</div>
                <div class="history-item-date">${this.formatTime(new Date(chat.lastUpdate))}</div>
            </div>
        `).join('');

        // 히스토리 항목 클릭 이벤트
        this.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const chatId = item.dataset.chatId;
                this.loadChat(chatId);
                this.toggleSidebar();
            });
        });
    }

    /**
     * 대화 불러오기
     */
    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        this.messages = chat.messages;
        this.chatMessages.innerHTML = '';

        chat.messages.forEach(msg => {
            const messageEl = this.createMessageElement(msg);
            this.chatMessages.appendChild(messageEl);
        });

        this.hideWelcomeScreen();
        this.scrollToBottom();
    }

    /**
     * 히스토리 전체 삭제
     */
    clearHistory() {
        if (!confirm('모든 대화 히스토리를 삭제하시겠습니까?')) return;

        this.chatHistory = [];
        localStorage.removeItem('chatHistory');
        this.renderChatHistory();
        this.showToast('히스토리가 삭제되었습니다', 'success');
    }

    /**
     * 사이드바 토글
     */
    toggleSidebar() {
        this.sidebar.classList.toggle('active');
    }

    /**
     * 테마 토글
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = this.themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    /**
     * 테마 로드
     */
    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        const icon = this.themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    /**
     * 웰컴 스크린 숨기기
     */
    hideWelcomeScreen() {
        this.welcomeScreen.style.display = 'none';
        this.chatMessages.classList.add('active');
    }

    /**
     * 입력 검증
     */
    validateInput() {
        const hasValue = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasValue;
    }

    /**
     * Textarea 자동 크기 조절
     */
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
    }

    /**
     * 스크롤 하단으로
     */
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    /**
     * 로딩 표시
     */
    showLoading() {
        this.loadingOverlay.classList.remove('hidden');
    }

    /**
     * 로딩 숨기기
     */
    hideLoading() {
        this.loadingOverlay.classList.add('hidden');
    }

    /**
     * Toast 표시
     */
    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    /**
     * 딜레이 유틸리티
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * ID 생성
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// 앱 초기화
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});
