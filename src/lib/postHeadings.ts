export type PostBlock =
  | { type: 'heading'; id: string; level: number; text: string }
  | { type: 'text'; text: string }

export type PostHeading = Extract<PostBlock, { type: 'heading' }>

const HEADING_LINE = /^(#{1,3})\s+(.+)$/

/**
 * 記事本文を、見出しとそれ以外の文章に分ける。
 * 行頭が `#` 1〜3 個と空白で始まる行を見出しとして扱い、出現順に `heading-1` からの id を振る。
 */
export function splitByHeadings(content: string): PostBlock[] {
  const blocks: PostBlock[] = []
  let headingCount = 0
  let textLines: string[] = []

  const pushText = () => {
    const text = textLines.join('\n').trim()
    if (text) blocks.push({ type: 'text', text })
    textLines = []
  }

  for (const line of content.split('\n')) {
    const match = line.trim().match(HEADING_LINE)
    if (!match) {
      textLines.push(line)
      continue
    }
    pushText()
    headingCount += 1
    blocks.push({
      type: 'heading',
      id: `heading-${headingCount}`,
      level: match[1].length,
      text: match[2].trim(),
    })
  }
  pushText()

  return blocks
}
