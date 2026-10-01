import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function IssueBoard(): ReactNode {
  return (
    <BrowserOnly>
      {() => {
        const Board = require('./Board').default;
        return <Board />;
      }}
    </BrowserOnly>
  );
}
