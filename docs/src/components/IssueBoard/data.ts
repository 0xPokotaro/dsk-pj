export type Status = 'not-started' | 'in-progress' | 'done';

export type Task = {
  id: string;
  group: string;
  title: string;
  status: Status;
  question?: string;
  background?: string[];
  answer?: string;
  link?: {href: string; label: string};
};

export const initialTasks: Task[] = [
  {
    id: 'fsa-explanation',
    group: 'プロジェクト全体の課題',
    title: '金融庁への説明',
    status: 'not-started',
    question: '金融庁への事前相談をどのルート・タイミングで進めるか',
    background: [
      '関係者全社合意、大阪府 府県戦略調整局・徴税対策課・システムグループ、Startale、SBI VCトレード、新生信託銀行を得てから金融庁へ説明する順序で合意済み',
      '新生信託銀行、信託事業者を通じて財務局経由でコンタクトする想定。説明時はUnyteも同席見込み',
      '着手前フェーズ、約2ヶ月内での頭出し完了を目指すが、SBI VCトレード側のAPI対応状況次第でずれ込む可能性あり',
    ],
    answer: '未回答。関係者全社の合意形成待ち',
    link: {href: '/docs/development-plan/financial-agency-explanation', label: '詳細ページを見る'},
  },
  {
    id: 'vct-meeting-schedule',
    group: 'プロジェクト全体の課題',
    title: 'SBI VCトレードとの打ち合わせ日程調整',
    status: 'not-started',
    question: 'SBI VCトレード（中村様・大山様）との打ち合わせをいつ設定するか',
    background: [
      '以前は水道局案件として共有していたが、案件が徴税対策課の自動車税案件に変わったため、ゼロベースで再共有する温度感で臨む想定',
      '目的は、①案件移管の状況共有、②JPYSCの換金フロー等のスキーム再相談の2点',
      '担当は松枝さんが日程調整を行う',
    ],
    answer: '未回答。日程調整中',
  },
  {
    id: 'startale-sepolia',
    group: 'Startale確認事項',
    title: 'ミニアプリからSepoliaテストネットへの接続対応状況',
    status: 'not-started',
    question: 'ミニアプリからSepoliaテストネットへの接続対応は完了しているか',
    background: [
      '現在Startale社内レビュー中で、対応自体は大きな改修ではないが遅延している',
      '9/30定例後に桜木さんが社内タップアップ予定',
    ],
    answer: '未回答。Startale側の社内対応待ち',
  },
  {
    id: 'startale-test-env',
    group: 'Startale確認事項',
    title: '検証フェーズ用のStartaleテスト環境、テストドメイン等の有無',
    status: 'not-started',
    question: '検証フェーズ用のテスト環境、テストドメイン等は用意されているか',
    background: [
      'テスト環境がない場合、本番環境上で送金先を限定するなどの方法も検討対象',
      '実証時に近い形で検証できるほど、徴税対策課への説明がしやすくなる',
    ],
    answer: '未回答。Startale側で確認中',
  },
  {
    id: 'startale-store-review',
    group: 'Startale確認事項',
    title: 'ミニアプリのストア審査プロセス',
    status: 'done',
    question: 'ミニアプリをストアに登録する際の審査プロセスはあるか',
    background: ['弊社テックメンバーから、審査なしで公開できる場合のリスクについて懸念が共有されている'],
    answer: '基本的にはデベロッパーが自由に公開できる仕組みとのこと',
  },
  {
    id: 'startale-phishing',
    group: 'Startale確認事項',
    title: 'フィッシングアプリ対策',
    status: 'not-started',
    question: '悪意あるフェイクアプリがミニアプリとして登録され、JPYSCの送金先が詐取されるリスクへの対策はあるか',
    background: ['払込表アプリの提供開始後、類似のフェイクアプリが登録される懸念が弊社テックメンバーから挙がっている'],
    answer: '未回答。Startale側で確認予定',
  },
];

export const groupOrder = ['プロジェクト全体の課題', '増田の課題', 'Startale確認事項'];

export const statusOrder: Status[] = ['not-started', 'in-progress', 'done'];

export const statusLabel: Record<Status, string> = {
  'not-started': '未着手',
  'in-progress': '進行中',
  done: '完了',
};

export const STORAGE_KEY = 'dsk-issue-board-v5';
