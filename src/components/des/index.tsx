import { Button, Row, Col, Input, Radio, message } from 'antd';
import CryptoJS from 'crypto-js';
import { useState } from 'react';

const { TextArea } = Input;

interface Iprops {
  type: 'AES' | 'DES';
}
const Des = (props: Iprops) => {
  const { type } = props;

  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState('');
  const [cipher, setCipher] = useState('');
  const [mode, setMode] = useState('ECB');
  const [result, setResult] = useState('');

  const getEncrypt = () => {
    if (type === 'AES') {
      return CryptoJS.AES;
    } else {
      return CryptoJS.DES;
    }
  };

  const getMode = () => {
    if (mode === 'ECB') {
      return {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      };
    }
    if (mode === 'CBC') {
      return {
        iv: CryptoJS.enc.Utf8.parse('hello,world'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      };
    }
  };

  const encryptDES = () => {
    const keyHex = CryptoJS.enc.Utf8.parse(cipher);
    let encrypt = CryptoJS.DES.encrypt(value, keyHex, getMode());
    setResult(encrypt.toString());
  };

  const decryptDES = () => {
    const keyHex = CryptoJS.enc.Utf8.parse(cipher);
    let decrypted = CryptoJS.DES.decrypt(value, keyHex, getMode());
    setResult(decrypted.toString(CryptoJS.enc.Utf8));
  };

  const encryptAES = () => {
    if (cipher.length === 16) {
      const keyHex = CryptoJS.enc.Utf8.parse(cipher);
      let encrypted = CryptoJS.AES.encrypt(value, keyHex, getMode());
      setResult(encrypted.toString());
    } else {
      messageApi.open({
        type: 'error',
        content: '请输入16位的密钥',
      });
    }
  };

  const decryptAES = () => {
    if (cipher.length === 16) {
      const keyHex = CryptoJS.enc.Utf8.parse(cipher);
      let decrypted = CryptoJS.AES.decrypt(value, keyHex, getMode());
      console.log(decrypted.toString(CryptoJS.enc.Utf8));
      setResult(decrypted.toString(CryptoJS.enc.Utf8));
    } else {
      messageApi.open({
        type: 'error',
        content: '请输入16位的密钥',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={4}>内容</Col>
        <Col span={12}>
          <TextArea
            value={value}
            onChange={(res) => {
              setValue(res.target.value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={4}>密钥</Col>
        <Col span={12}>
          <Input
            value={cipher}
            onChange={(res) => {
              setCipher(res.target.value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={4}>类型</Col>
        <Col span={12}>
          <Radio.Group
            onChange={(res) => {
              setMode(res.target.value);
            }}
            value={mode}
          >
            <Radio value={'ECB'}>ECB</Radio>
            <Radio value={'CBC'}>CBC</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <Button onClick={type === 'AES' ? encryptAES : encryptDES}>加密</Button>
      <Button onClick={type === 'AES' ? decryptAES : decryptDES}>解密</Button>
      <div>{result}</div>
    </>
  );
};
export default Des;
