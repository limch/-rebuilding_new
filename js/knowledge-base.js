/**
 * 재건축·재개발 법령 지식베이스
 * Hub 파일 데이터를 기반으로 구축된 법령 지식베이스
 */

class KnowledgeBase {
    constructor() {
        this.laws = this.initializeLaws();
        this.keywords = this.buildKeywordIndex();
    }

    /**
     * 법령 데이터 초기화
     */
    initializeLaws() {
        return {
            "조합설립": [
                {
                    article: "제35조",
                    title: "조합설립인가 등",
                    content: "토지등소유자는 정비사업을 시행하기 위하여 토지등소유자로 구성된 조합을 설립할 수 있다. 조합을 설립하려는 경우에는 토지등소유자의 3/4 이상 및 토지면적의 1/2 이상의 토지소유자의 동의를 받아 시장·군수등의 인가를 받아야 한다.",
                    keywords: ["조합", "설립", "인가", "동의율", "3/4", "1/2"]
                },
                {
                    article: "제36조",
                    title: "토지등소유자의 동의방법",
                    content: "조합설립 동의는 토지등소유자가 서면으로 하여야 하며, 동의서에는 정비사업의 종류·명칭·정비구역 위치·면적·추진위원회 구성내용 등이 포함되어야 한다.",
                    keywords: ["동의", "서면", "동의서", "추진위원회"]
                },
                {
                    article: "제31조",
                    title: "조합설립추진위원회",
                    content: "토지등소유자는 조합을 설립하기 위하여 조합설립추진위원회를 구성할 수 있다. 추진위원회는 시장·군수등의 승인을 받아야 한다.",
                    keywords: ["추진위원회", "승인"]
                }
            ],
            "조합원자격": [
                {
                    article: "제39조",
                    title: "조합원의 자격 등",
                    content: "재건축사업의 조합원은 재건축사업에 동의한 토지등소유자로 한다. 투기과열지구 내에서는 조합설립인가 이후 건축물 또는 토지를 양수한 자는 조합원이 될 수 없다. 단, 상속·이혼으로 취득한 경우, 10년 보유·5년 거주 1주택자의 경우는 예외로 인정된다.",
                    keywords: ["조합원", "자격", "투기과열지구", "양도제한", "예외"]
                },
                {
                    article: "시행령 제37조",
                    title: "조합원 지위양도 제한 예외",
                    content: "투기과열지구에서도 다음의 경우 조합원 지위 양도 가능: ① 10년 보유·5년 거주 1주택자 ② 상속·이혼 ③ 세대전원 해외이주(2년 이상) ④ 근무·질병·취학으로 이주 ⑤ 사업지연(3년 이상 착공 지연)",
                    keywords: ["예외", "10년", "5년", "상속", "이혼", "해외이주"]
                }
            ],
            "분양권전매": [
                {
                    article: "제76조 제1항 제7호 라목",
                    title: "1+1 분양 전매제한",
                    content: "종전 토지·건축물 가격 범위 또는 종전 주택 전용면적 범위에서 2주택을 공급할 수 있고, 이 중 1주택은 주거전용면적을 60제곱미터 이하로 한다. 다만, 60제곱미터 이하로 공급받은 1주택은 제86조제2항에 따른 이전고시일 다음 날부터 3년이 지나기 전에는 주택을 전매하거나 전매를 알선할 수 없다.",
                    keywords: ["1+1", "2주택", "60㎡", "전매제한", "3년"]
                },
                {
                    article: "시행령 제37조",
                    title: "투기과열지구 조합원 지위 양도 제한",
                    content: "투기과열지구 내 재건축은 조합설립인가 후부터, 재개발은 관리처분계획인가 후부터 소유권이전등기일까지 조합원 지위의 매매·증여 등 권리변동이 금지된다. 예외사유가 인정되는 경우에만 양도 가능.",
                    keywords: ["투기과열지구", "전매", "금지", "재건축", "재개발", "조합설립인가", "관리처분"]
                }
            ],
            "안전진단": [
                {
                    article: "제12조",
                    title: "재건축사업을 위한 재건축진단",
                    content: "시장·군수등은 재건축진단을 실시하여야 한다. 건축물 및 부속토지 소유자 10분의 1 이상의 동의를 받아 재건축진단 실시를 요청할 수 있다. 재건축진단은 주거환경 적합성, 구조안전성, 건축마감, 설비노후도 등을 심사한다.",
                    keywords: ["안전진단", "재건축진단", "10분의 1", "구조안전", "설비노후"]
                },
                {
                    article: "제13조",
                    title: "재건축진단 결과의 적정성 검토",
                    content: "시·도지사는 국토안전관리원 또는 한국건설기술연구원에 재건축진단 결과의 적정성 검토를 의뢰할 수 있다. 검토결과에 따라 시정요구 등 조치를 요청할 수 있다.",
                    keywords: ["적정성검토", "국토안전관리원", "한국건설기술연구원"]
                }
            ],
            "분담금": [
                {
                    article: "비례율 계산식",
                    title: "비례율 계산 공식",
                    content: "비례율 = (총 분양가액 - 총 사업비) ÷ 종전자산 총 평가액 × 100%",
                    keywords: ["비례율", "계산", "총분양가액", "사업비", "종전자산"]
                },
                {
                    article: "권리가액 계산식",
                    title: "권리가액 계산 공식",
                    content: "권리가액 = 종전 감정평가액 × 비례율",
                    keywords: ["권리가액", "감정평가액", "비례율"]
                },
                {
                    article: "분담금 계산식",
                    title: "분담금 계산 공식",
                    content: "분담금 = 조합원 분양가 - 권리가액. 비례율이 높을수록 권리가액이 증가하여 분담금이 감소한다. 비례율 100% 이상이면 사업성이 좋다고 평가된다.",
                    keywords: ["분담금", "조합원분양가", "권리가액", "추가분담금"]
                }
            ],
            "관리처분": [
                {
                    article: "제72조",
                    title: "분양공고 및 분양신청",
                    content: "사업시행자는 사업시행계획인가 고시일로부터 120일 이내에 토지등소유자에게 분양신청을 통지해야 한다. 분양신청기간은 통지일로부터 30일 이상 60일 이내로 해야 한다.",
                    keywords: ["분양공고", "분양신청", "120일", "30일", "60일"]
                },
                {
                    article: "제74조",
                    title: "관리처분계획의 인가",
                    content: "사업시행자는 분양신청 종료 후 관리처분계획을 작성하여 시장·군수등의 인가를 받아야 한다. 관리처분계획에는 분양설계, 분양대상자별 종전 토지·건축물 명세 및 가격, 분양예정 건축물 명세 등이 포함되어야 한다.",
                    keywords: ["관리처분계획", "인가", "분양설계", "명세"]
                },
                {
                    article: "제76조",
                    title: "관리처분계획의 수립기준",
                    content: "1세대 1주택 원칙. 예외적으로 종전자산가격 또는 종전주택 전용면적 범위에서 2주택 공급 가능 (단, 1주택은 60㎡ 이하). 공급주택의 규모·층수는 균형 있게 배분되도록 해야 한다.",
                    keywords: ["1세대1주택", "2주택", "60㎡", "공급기준"]
                }
            ],
            "현금청산": [
                {
                    article: "제73조",
                    title: "분양신청을 하지 않은 자 등에 대한 조치",
                    content: "분양신청기간 내에 분양신청을 하지 않은 자는 종료일 다음날 현금청산대상자가 되며 조합원 지위를 상실한다. 사업시행자는 90일 이내 협의 후 협의 불성립 시 수용재결 또는 매도청구소송 제기 가능.",
                    keywords: ["현금청산", "분양미신청", "조합원지위상실", "협의", "수용재결"]
                },
                {
                    article: "제72조 제4항·제5항",
                    title: "재분양신청 기회",
                    content: "사업시행계획인가 변경으로 세대수·주택규모가 달라지는 경우 재분양절차를 거칠 수 있다. 정관 규정 또는 총회 의결이 있는 경우 현금청산대상자에게 재분양신청 기회를 부여할 수 있다.",
                    keywords: ["재분양", "사업시행계획변경", "총회의결"]
                },
                {
                    article: "제89조",
                    title: "청산금",
                    content: "청산금 = |분양받은 대지·건축물 가격 - 종전 대지·건축물 가격 - 정비사업비|. 양(+)이면 추가 납부, 음(-)이면 환급. 청산금은 현금으로 지급하거나 징수한다.",
                    keywords: ["청산금", "계산", "환급", "징수"]
                }
            ],
            "사업절차": [
                {
                    article: "사업절차",
                    title: "재건축·재개발 추진 절차",
                    content: "1단계: 기본계획 수립 → 2단계: 안전진단(재건축만) → 3단계: 정비계획 수립·구역지정 → 4단계: 조합설립 → 5단계: 사업시행계획인가 → 6단계: 분양신청 → 7단계: 관리처분계획 → 8단계: 이주·철거·착공 → 9단계: 준공·입주",
                    keywords: ["사업절차", "단계", "기본계획", "안전진단", "조합설립", "관리처분"]
                }
            ]
        };
    }

    /**
     * 키워드 인덱스 구축
     */
    buildKeywordIndex() {
        const index = new Map();
        
        Object.entries(this.laws).forEach(([category, articles]) => {
            articles.forEach(article => {
                article.keywords.forEach(keyword => {
                    if (!index.has(keyword)) {
                        index.set(keyword, []);
                    }
                    index.get(keyword).push({
                        category,
                        ...article
                    });
                });
            });
        });

        return index;
    }

    /**
     * 질문에서 키워드 추출
     */
    extractKeywords(question) {
        const keywords = new Set();
        const questionLower = question.toLowerCase();

        // 키워드 인덱스에서 매칭
        for (const [keyword] of this.keywords) {
            if (questionLower.includes(keyword.toLowerCase())) {
                keywords.add(keyword);
            }
        }

        return Array.from(keywords);
    }

    /**
     * 질문 분석 및 관련 조항 검색
     */
    search(question) {
        const keywords = this.extractKeywords(question);
        const results = new Map();

        // 키워드로 조항 검색
        keywords.forEach(keyword => {
            const articles = this.keywords.get(keyword);
            if (articles) {
                articles.forEach(article => {
                    const key = article.article;
                    if (!results.has(key)) {
                        results.set(key, { ...article, score: 0 });
                    }
                    results.get(key).score += 1;
                });
            }
        });

        // 점수순 정렬
        const sortedResults = Array.from(results.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return sortedResults;
    }

    /**
     * 카테고리로 조항 가져오기
     */
    getByCategory(category) {
        return this.laws[category] || [];
    }

    /**
     * FAQ 검색
     */
    searchFAQ(question) {
        const faqs = [
            {
                question: "조합설립 동의율은?",
                answer: "토지등소유자의 3/4 이상 및 토지면적의 1/2 이상 토지소유자의 동의가 필요합니다 (도시정비법 제35조).",
                related: ["제35조", "제36조"]
            },
            {
                question: "투기과열지구 분양권 전매 가능한가요?",
                answer: "원칙적으로 금지됩니다. 재건축은 조합설립인가 후, 재개발은 관리처분계획인가 후부터 소유권이전등기일까지 전매 제한. 예외: 10년 보유·5년 거주 1주택자, 상속·이혼, 해외이주 등",
                related: ["제39조", "시행령 제37조"]
            },
            {
                question: "50평 토지로 32평 아파트 2채 받을 수 있나요?",
                answer: "불가능합니다. 도시정비법 제76조에 따라 2주택 공급 시 1채는 60㎡(약 18평) 이하여야 합니다. 32평 2채는 법적으로 불가능하며, 32평 1채 + 18평 이하 1채 조합은 가능합니다.",
                related: ["제76조"]
            },
            {
                question: "안전진단은 누가 요청하나요?",
                answer: "건축물 및 부속토지 소유자 10분의 1 이상의 동의를 받아 시장·군수등에게 재건축진단 실시를 요청할 수 있습니다 (제12조).",
                related: ["제12조", "제13조"]
            },
            {
                question: "비례율이란 무엇인가요?",
                answer: "비례율 = (총 분양가액 - 총 사업비) ÷ 종전자산 총 평가액 × 100%. 비례율이 높을수록 조합원 권리가액이 증가하여 분담금이 감소합니다. 일반적으로 100% 이상이면 사업성이 좋다고 평가됩니다.",
                related: ["비례율 계산식", "권리가액 계산식"]
            },
            {
                question: "현금청산 대상자는 누구인가요?",
                answer: "분양신청기간 내에 분양신청을 하지 않은 자는 종료일 다음날 현금청산대상자가 되며 조합원 지위를 상실합니다 (제73조).",
                related: ["제73조"]
            },
            {
                question: "분양신청 기간은 언제인가요?",
                answer: "사업시행계획인가 고시일로부터 120일 이내에 통지되며, 통지일로부터 30일 이상 60일 이내의 기간으로 정해집니다 (제72조).",
                related: ["제72조"]
            }
        ];

        const questionLower = question.toLowerCase();
        return faqs.find(faq => 
            questionLower.includes(faq.question.toLowerCase()) ||
            faq.question.toLowerCase().includes(questionLower)
        );
    }
}

// 전역 인스턴스 생성
const knowledgeBase = new KnowledgeBase();
