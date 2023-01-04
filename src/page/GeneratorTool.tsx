import { Tabs } from 'antd';
import QrCode from '../components/qrCode';
import Uuid from '../components/uuid';

const GeneratorTool = () => {
  const items = [
    { label: 'UUID生成器', key: 'item-1', children: <Uuid /> },
    { label: '二维码生成器', key: 'item-2', children: <QrCode /> },
  ];

  return (
    <>
      <Tabs items={items} />
    </>
  );
};

export default GeneratorTool;
