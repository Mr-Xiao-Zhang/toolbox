import { Link, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import React, { Suspense } from 'react';
import GeneratorTool from './page/GeneratorTool';

const JsonTool = React.lazy(() => import('./components/json'));
const EncryptionTool = React.lazy(() => import('./page/EncryptionTool'));

let menuList = [
  {
    key: 'JSONTool',
    name: 'JSON工具',
    path: '/',
  },
  {
    key: 'generatorTool',
    name: '生成工具',
    path: '/generatorTool',
  },
  {
    key: 'encryptionTool',
    name: '加密&解密',
    path: '/encryptionTool',
  },
];

function App() {
  return (
    <Router>
      <div>
        {menuList.map((item) => {
          return (
            <Link key={item.key} to={item.path} onClick={() => {}}>
              {item.name}
            </Link>
          );
        })}
      </div>
      <Suspense fallback={<h4>正在拼命加载中...</h4>}>
        <Routes>
          <Route key="JSONTool" path="/" element={<JsonTool />} />
          <Route key="generatorTool" path="/generatorTool" element={<GeneratorTool />} />
          <Route key="encryptionTool" path="/encryptionTool" element={<EncryptionTool />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
