import { Tabs } from 'antd';
import Des from '../components/des';

const EncryptionTool = () => {
  const items = [
    { label: 'DES加密解密', key: 'item-1', children: <Des type='DES' /> },
    { label: 'AES加密解密', key: 'item-2', children: <Des type='AES' />  },
  ];

  return (
    <>
      <Tabs items={items} />
    </>
  );
};
export default EncryptionTool;
