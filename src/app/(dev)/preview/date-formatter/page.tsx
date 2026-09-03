import { notFound } from 'next/navigation';
import FormattedDate from '@/components/ui/DateFormatter';

// PR ドキュメント用のキャプチャを撮るためだけのページ。本番では出さない。
export default function DateFormatterPreview() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const now = Date.now();
  const cases = [
    { label: '30 分前の投稿', at: new Date(now - 30 * 60 * 1000) },
    { label: '3 時間前の投稿', at: new Date(now - 3 * 60 * 60 * 1000) },
    { label: '2 日前の投稿', at: new Date(now - 2 * 24 * 60 * 60 * 1000) },
    { label: '30 日前の投稿', at: new Date(now - 30 * 24 * 60 * 60 * 1000) },
  ];

  return (
    <main style={{ padding: '32px', fontFamily: 'sans-serif', background: '#fff' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: '15px' }}>
        <thead>
          <tr>
            <th style={cell}>入力</th>
            <th style={cell}>変更前</th>
            <th style={cell}>変更後</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(({ label, at }) => (
            <tr key={label}>
              <td style={cell}>{label}</td>
              <td style={{ ...cell, color: '#888' }}>
                {at.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
              </td>
              <td style={cell}>
                <FormattedDate date={at.toISOString()} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const cell = {
  border: '1px solid #ddd',
  padding: '10px 16px',
  textAlign: 'left' as const,
};
