/**
 * Created by daniel on 7/21/17.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Hello } from './components/Hello';

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById('example'),
);
