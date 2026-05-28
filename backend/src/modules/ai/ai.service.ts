import { Injectable } from '@nestjs/common'

@Injectable()
export class AiService {
  chat(message: string, ticker: string) {
    const lower = message.toLowerCase()
    let reply = `Based on demo analysis for ${ticker}, pre-earnings signals remain constructive. Monitor hiring velocity and news sentiment ahead of earnings.`

    if (lower.includes('risk')) {
      reply = `Top risks for ${ticker}:\n\n1. Valuation sensitivity around earnings\n2. Competitive pressure in core markets\n3. Macro demand slowdown\n\nThis is demo AI output — not financial advice.`
    } else if (lower.includes('buy') || lower.includes('invest') || lower.includes('position')) {
      reply = `${ticker} demo score suggests cautious optimism. Hiring and sentiment are supportive, but always validate with your own research before investing.`
    } else if (lower.includes('compare') || lower.includes(' vs ') || lower.includes('versus')) {
      reply = `In demo mode, ${ticker} leads peers on composite pre-earnings score. Compare hiring velocity and institutional flow for confirmation.`
    } else if (lower.includes('earnings')) {
      reply = `For ${ticker}, watch revenue guidance, margin trends, and any supply-chain commentary on the next earnings call. Demo signals currently lean positive.`
    }

    return {
      reply,
      model: 'marketpulse-demo-v1',
      demoMode: true,
      ticker,
      timestamp: new Date().toISOString(),
    }
  }
}
