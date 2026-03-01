/**
 * AI 챗봇 엔진
 * 질문 분석, 법령 검색, 답변 생성
 */

class Chatbot {
    constructor(knowledgeBase) {
        this.kb = knowledgeBase;
    }

    /**
     * 질문 처리 및 답변 생성
     */
    async processQuestion(question) {
        // 1. FAQ 먼저 확인
        const faqResult = this.kb.searchFAQ(question);
        if (faqResult) {
            return this.formatFAQAnswer(faqResult);
        }

        // 2. 키워드 기반 법령 검색
        const articles = this.kb.search(question);
        
        if (articles.length === 0) {
            return this.generateNoResultAnswer(question);
        }

        return this.generateAnswer(question, articles);
    }

    /**
     * FAQ 답변 포맷팅
     */
    formatFAQAnswer(faq) {
        return {
            type: 'faq',
            answer: faq.answer,
            articles: faq.related.map(article => {
                // 관련 조항 찾기
                for (const category of Object.values(this.kb.laws)) {
                    const found = category.find(a => a.article === article);
                    if (found) return found;
                }
                return null;
            }).filter(Boolean),
            confidence: 'high'
        };
    }

    /**
     * 답변 생성
     */
    generateAnswer(question, articles) {
        const primaryArticle = articles[0];
        const category = primaryArticle.category;

        // 답변 텍스트 생성
        let answer = this.generateAnswerText(question, primaryArticle, category);

        return {
            type: 'search',
            answer: answer,
            articles: articles,
            category: category,
            confidence: articles.length > 2 ? 'high' : 'medium'
        };
    }

    /**
     * 답변 텍스트 생성
     */
    generateAnswerText(question, article, category) {
        const templates = {
            '조합설립': () => {
                if (question.includes('동의율') || question.includes('동의')) {
                    return `조합설립을 위해서는 **토지등소유자의 3/4 이상** 및 **토지면적의 1/2 이상 토지소유자의 동의**가 필요합니다.\n\n동의는 반드시 **서면**으로 받아야 하며, 동의서에는 정비사업의 종류, 명칭, 정비구역 위치 및 면적, 추진위원회 구성내용 등이 포함되어야 합니다.`;
                }
                return `${article.content}\n\n조합설립은 토지등소유자가 정비사업을 시행하기 위해 구성하는 단체로, 시장·군수등의 인가를 받아야 합니다.`;
            },
            '조합원자격': () => {
                if (question.includes('투기과열') || question.includes('전매') || question.includes('양도')) {
                    return `**투기과열지구 내 조합원 지위 양도 제한:**\n\n원칙적으로 조합설립인가 이후(재개발은 관리처분계획인가 이후) 건축물·토지를 양수한 자는 조합원이 될 수 없습니다.\n\n**예외사유:**\n✓ 10년 보유·5년 거주 1주택자\n✓ 상속·이혼으로 취득\n✓ 세대전원 해외이주(2년 이상)\n✓ 근무·질병·취학으로 이주\n✓ 사업지연(3년 이상 착공 지연 등)`;
                }
                return article.content;
            },
            '분양권전매': () => {
                if (question.includes('1+1') || question.includes('2주택') || question.includes('2채')) {
                    return `**1+1 분양(2주택 공급) 조건:**\n\n종전 토지·건축물 가격 범위 또는 종전 주택 전용면적 범위에서 2주택을 공급받을 수 있습니다.\n\n**단, 필수 조건:**\n• 2주택 중 1주택은 **60㎡(약 18평) 이하**여야 함\n• 60㎡ 이하 주택은 이전고시일로부터 **3년간 전매 금지**\n\n**예시:** 50평 토지 소유자가 32평 아파트 2채를 받는 것은 불가능합니다. 32평 1채 + 18평 이하 1채는 가능합니다.`;
                }
                if (question.includes('투기과열') || question.includes('제한')) {
                    return `**투기과열지구 분양권 전매 제한:**\n\n• 재건축: 조합설립인가 후 ~ 소유권이전등기일\n• 재개발: 관리처분계획인가 후 ~ 소유권이전등기일\n\n위 기간 동안 조합원 지위의 매매·증여 등이 금지됩니다.\n\n**예외:** 10년 보유·5년 거주 1주택자, 상속·이혼, 해외이주, 근무·질병·취학 이주 등`;
                }
                return article.content;
            },
            '안전진단': () => {
                return `**재건축 안전진단 절차:**\n\n1. **신청:** 건축물·부속토지 소유자 10분의 1 이상 동의\n2. **진단 실시:** 시장·군수등이 재건축진단기관에 의뢰\n3. **심사 항목:**\n   • 주거환경 적합성\n   • 구조안전성\n   • 건축마감 상태\n   • 설비노후도\n4. **적정성 검토:** 국토안전관리원 또는 한국건설기술연구원\n\n**참고:** 재개발사업은 안전진단이 필요 없습니다.`;
            },
            '분담금': () => {
                if (question.includes('계산') || question.includes('어떻게') || question.includes('방법')) {
                    return `**분담금 계산 공식:**\n\n1️⃣ **비례율 계산**\n   비례율 = (총 분양가액 - 총 사업비) ÷ 종전자산 총 평가액 × 100%\n\n2️⃣ **권리가액 계산**\n   권리가액 = 종전 감정평가액 × 비례율\n\n3️⃣ **분담금 계산**\n   분담금 = 조합원 분양가 - 권리가액\n\n**포인트:**\n• 비례율이 높을수록 분담금 감소\n• 비례율 100% 이상 = 사업성 양호\n• 비례율 100% 미만 = 추가분담금 발생`;
                }
                return `**분담금이란?**\n\n조합원이 새로 공급받는 주택의 분양가에서 종전 자산의 권리가액을 뺀 금액입니다.\n\n분담금 = 조합원 분양가 - 권리가액\n\n비례율이 높을수록 권리가액이 증가하여 분담금이 감소합니다.`;
            },
            '관리처분': () => {
                if (question.includes('기간') || question.includes('언제') || question.includes('통지')) {
                    return `**관리처분 주요 일정:**\n\n1. **분양신청 통지:** 사업시행계획인가 고시일로부터 120일 이내\n2. **분양신청 기간:** 통지일로부터 30일 이상 ~ 60일 이내\n3. **관리처분계획 인가:** 분양신청 종료 후 작성·인가\n\n**중요:** 분양신청 기간 내 미신청 시 현금청산 대상자가 되어 조합원 지위를 상실합니다.`;
                }
                if (question.includes('2주택') || question.includes('2채') || question.includes('1세대')) {
                    return `**관리처분계획 수립기준:**\n\n**원칙:** 1세대 1주택\n\n**예외:** 종전자산가격 또는 종전주택 전용면적 범위에서 2주택 공급 가능\n• 단, 1주택은 **60㎡ 이하**\n• 60㎡ 이하 주택은 3년간 전매 금지\n\n공급주택의 규모와 층수는 균형 있게 배분되어야 합니다.`;
                }
                return article.content;
            },
            '현금청산': () => {
                if (question.includes('기준') || question.includes('대상') || question.includes('누구')) {
                    return `**현금청산 대상자:**\n\n분양신청기간 내에 **분양신청을 하지 않은 자**는 종료일 다음날 자동으로 현금청산대상자가 됩니다.\n\n**결과:**\n• 조합원 지위 상실\n• 종전 자산에 대한 현금 보상\n• 신축 아파트 입주권 상실\n\n**절차:**\n1. 사업시행자와 90일 이내 협의\n2. 협의 불성립 → 수용재결 또는 매도청구소송`;
                }
                if (question.includes('계산') || question.includes('얼마')) {
                    return `**청산금 계산:**\n\n청산금 = |분양받은 대지·건축물 가격 - 종전 대지·건축물 가격 - 정비사업비|\n\n• 양(+) → 조합원이 추가 납부\n• 음(-) → 조합원에게 환급\n\n청산금은 현금으로 지급하거나 징수합니다.`;
                }
                return article.content;
            },
            '사업절차': () => {
                return `**재건축·재개발 사업 절차:**\n\n1️⃣ **기본계획 수립**\n2️⃣ **안전진단** (재건축만)\n3️⃣ **정비계획 수립·구역지정**\n4️⃣ **조합설립**\n5️⃣ **사업시행계획인가**\n6️⃣ **분양신청**\n7️⃣ **관리처분계획**\n8️⃣ **이주·철거·착공**\n9️⃣ **준공·입주**\n\n전체 소요기간: 약 7~10년 (지역·사업 규모에 따라 상이)`;
            }
        };

        const generator = templates[category];
        if (generator) {
            return generator();
        }

        return article.content;
    }

    /**
     * 검색 결과 없음 답변
     */
    generateNoResultAnswer(question) {
        return {
            type: 'no_result',
            answer: `죄송합니다. "${question}"에 대한 정확한 법령 정보를 찾지 못했습니다.\n\n다음과 같이 질문을 수정해보시겠어요?\n\n**추천 질문:**\n• 조합설립 동의율은 얼마인가요?\n• 투기과열지구 분양권 전매 가능한가요?\n• 안전진단 절차는 어떻게 되나요?\n• 추가 분담금 계산 방법을 알려주세요\n• 현금청산 대상자 기준은?\n\n또는 **법령 조항 번호**(예: 제35조, 제76조)로 직접 검색하실 수도 있습니다.`,
            articles: [],
            confidence: 'none'
        };
    }

    /**
     * 답변 신뢰도 배지 생성
     */
    getConfidenceBadge(confidence) {
        const badges = {
            high: { text: '높은 신뢰도', color: '#10b981', icon: 'fa-check-circle' },
            medium: { text: '중간 신뢰도', color: '#f59e0b', icon: 'fa-info-circle' },
            low: { text: '낮은 신뢰도', color: '#ef4444', icon: 'fa-exclamation-circle' },
            none: { text: '검색 실패', color: '#94a3b8', icon: 'fa-times-circle' }
        };
        return badges[confidence] || badges.low;
    }
}

// 전역 챗봇 인스턴스 생성
const chatbot = new Chatbot(knowledgeBase);
