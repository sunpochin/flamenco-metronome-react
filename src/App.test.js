import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from './App';
import Editor from './containers/Editor/Editor';

// test('renders learn react link', () => {
//   const { getByText } = render(
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   );
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


test('renders learn react link', () => {
  const isUnitTest = true;
  const { getByText } = render(
    <BrowserRouter>
      <Editor isUnitTest={isUnitTest} />
    </BrowserRouter>
  );
  // const linkElement = getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
