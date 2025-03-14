export const ANALYZE_PDF_STOCK_REPORT_PROMPT = `
<information>
  <current_date>{{TODAY}}</current_date>
  <text>
    {{PDF_EXTRACTED_TEXT}}
  </text>
</information>

I'll give you text of stock report which is extracted from pdf file.
Follow the policy and instruction.

policy:
- Try not to use exact number but use percentage or trend.
- Take time to understand the context. 
- Consider whether this information could be helpful for investment before summarizing it.
- Answer in korean.

instructions:
1. Figure out what company is up to and what they are expecting.
2. base on current_date, distinguish expectation and past data from text.
3. figure out target price from text. (Do not display the currency, just leave the numbers.)
4. figure out current price from text. (Do not display the currency, just leave the numbers.)
5. figure currency from text (USD, HKD, CAD, EUR, GBP, KRW, JPY)
6. figure out position from text. (BUY, SELL, HOLD)
7. Give your opinion whether to buy or not in field 'analysis.position' (BUY, SELL, HOLD)
8. Base on information above, assess this stock's target price in 6 months.
9. Give reason why you assessed that way in instruction 7-8. 

<example>
{
  "expectation": ["25 년 매출액 1,239 억원(YoY +77.1%), 영업이익 130 억원(YoY +95.4%, OPM10.5%)을 전망"],
  "past": [
    "PECVD 및 드라이클리닝 장비 외 BSD(BacksideDeposition), Low-K PECVD 장비를 개발 중. 두 신규 장비 모두 외산 장비 대체이며, 고객사 퀄은 이미 마무리, 내년부터 본격적인 매출 기여가 가능할 것으로 판단",
    "삼성전자는 DDR5 전환 및 레거시 디램 노출도 축소 목적,SK하이닉스는 HBM 생산 확대를 위한 목적. 이 과정에서 동사의 디램수주 규모도 올해 대비 증가함에 따라 매출액 2,662억원(+22% YoY),영업이익 411억원(+93% YoY)으로 성장 전망"
    "디램에서 증가하고 있는 수주액을 고려하면 인식 전환 필요. 현 주가는 내년 실적 기준 P/E 8.X 수준으로 바닥권에 형성되어 있어 부담없는 수준",
    "최근 3년간 영업이익(YoY) 꾸준히 10% 성장",
    "3Q2024 영업이익 87억달러(+2.1%), 순이익 61억달러(+3.7%)"
  ],
  "targetPrice": 100.2,
  "currentPrice": 88,
  "currency": "USD",
  "position": "BUY",
  "analysis": {
    "position": "HOLD",
    "targetPrice": 97",
    "reason: "단기적으로는 주가 하방압력이 있지만, 4Q23 실적과 당분기 자사주 매입·소각으로 향후 주가 상승 예상."
  }  
}
</example>
`;
