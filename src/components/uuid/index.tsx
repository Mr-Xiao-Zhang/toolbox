import { Button, Checkbox, Form, Input, InputNumber, message, Radio, Table } from 'antd';
import { useState } from 'react';
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import copy from 'copy-to-clipboard';
import { zyhToString } from '../../utils/util';

interface IForm {
  type: string;
  count: number;
  result: string;
  name?: string;
  namespace?: string;
}

const rules = [{ required: true, message: '不能为空!' }];
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 5 },
};

const initialValues: IForm = { type: 'v4', count: 1, result: 'uppercase' };

const Uuid = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [type, setType] = useState('v4');
  const [uuids, setUuids] = useState<string[]>([]);
  const [option, setOption] = useState(false);

  const columns = [
    {
      title: 'UUID',
      dataIndex: 'uuid',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record: { uuid: string }) => (
        <Button
          onClick={() => {
            copy(record.uuid);
          }}
        >
          复制
        </Button>
      ),
    },
  ];

  const onChange = (value) => {
    setType(value.target.value);
  };

  const generatorUuid = (form: IForm) => {
    const { type, name, namespace, count, result } = form;
    const uuids: string[] = [];
    for (let index = 0; index < count; index++) {
      let uuid;
      if (type === 'v4') {
        uuid = uuidv4();
      }
      if (type === 'v1') {
        uuid = uuidv1();
      }
      type === 'v4' && uuidv4();
      if (type === 'v5') {
        try {
          uuid = uuidv5(name as string, namespace as string);
        } catch (error) {
          messageApi.open({
            type: 'error',
            content: 'error',
          });
        }
      }
      if (option) {
        uuid = uuid?.replaceAll('-', '');
      }
      if (result === 'uppercase') {
        uuid = uuid?.toUpperCase();
      }
      uuid && uuids.push(zyhToString(uuid));
    }
    setUuids(uuids);
  };

  return (
    <>
      {contextHolder}
      <Form form={form} {...layout} labelAlign="left" onFinish={generatorUuid} initialValues={initialValues}>
        <Form.Item label="生成类型" name="type">
          <Radio.Group buttonStyle="solid" onChange={onChange}>
            <Radio.Button value="v4">v4</Radio.Button>
            <Radio.Button value="v1">v1</Radio.Button>
            <Radio.Button value="v5">v5</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {type === 'v5' && (
          <Form.Item label="名字" name="name" rules={rules}>
            <Input placeholder="name" />
          </Form.Item>
        )}
        {type === 'v5' && (
          <Form.Item label="命名空间" name="namespace" rules={rules}>
            <Input placeholder="namespace" />
          </Form.Item>
        )}
        <Form.Item label="生成数量" name="count">
          <InputNumber min={1} max={100} />
        </Form.Item>
        <Form.Item label="生成结果" name="result">
          <Radio.Group>
            <Radio value={'uppercase'}>大写</Radio>
            <Radio value={'lowercase'}>小写</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="选项">
          <Checkbox
            checked={option}
            onChange={(res) => {
              setOption(res.target.checked);
            }}
          >
            去掉中划线
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            生成UUID
          </Button>
        </Form.Item>
      </Form>
      {uuids.length > 0 && (
        <Table
          columns={columns}
          dataSource={uuids?.map((item) => {
            return { uuid: item, key: item };
          })}
          pagination={false}
        />
      )}
    </>
  );
};

export default Uuid;
