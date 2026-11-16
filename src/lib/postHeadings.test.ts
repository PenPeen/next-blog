import { splitByHeadings } from './postHeadings'

describe('splitByHeadings', () => {
  it('見出しが無い本文は、文章 1 つだけを返すこと', () => {
    expect(splitByHeadings('テスト内容')).toEqual([
      { type: 'text', text: 'テスト内容' },
    ])
  })

  it('見出しと文章を出現順に分け、見出しに連番の id を振ること', () => {
    const content = ['前置き', '# はじめに', '本文1', '## 詳細', '本文2'].join('\n')

    expect(splitByHeadings(content)).toEqual([
      { type: 'text', text: '前置き' },
      { type: 'heading', id: 'heading-1', level: 1, text: 'はじめに' },
      { type: 'text', text: '本文1' },
      { type: 'heading', id: 'heading-2', level: 2, text: '詳細' },
      { type: 'text', text: '本文2' },
    ])
  })

  it('# が 4 個以上の行と、# の後に空白が無い行は見出しにしないこと', () => {
    const content = ['#### 深い見出し', '#タグ'].join('\n')

    expect(splitByHeadings(content)).toEqual([
      { type: 'text', text: '#### 深い見出し\n#タグ' },
    ])
  })

  it('空の本文は空の配列を返すこと', () => {
    expect(splitByHeadings('')).toEqual([])
  })
})
