import { PlusOutlined } from '@ant-design/icons';
import { Col, Input, Popover, Radio, Row, Slider, Switch, Upload } from 'antd';
import { SketchPicker } from 'react-color';
import { ErrorCorrectionLevel, qrcanvas } from 'qrcanvas';
import { useEffect, useState } from 'react';
import styles from './index.module.less';

const { TextArea } = Input;

interface IOption {
  data: string;
  cellSize: number;
  padding?: number;
  logoImg?: CanvasImageSource;
  backImg?: CanvasImageSource;
  effectType?: string;
  effectValue?: number;
  Background?: string;
  Foreground?: string;
  colorOut?: string;
  colorIn?: string;
  correctLevel?: ErrorCorrectionLevel;
}

const initValue: IOption = {
  data: '',
  cellSize: 8,
  padding: 0,
  effectValue: 1,
  Foreground: '#000000',
  colorOut: '#000000',
  colorIn: '#000000',
  correctLevel: 'L',
};

const themes = {
  default: {
    Foreground: '#000000',
    Background: '#ffffff',
    colorOut: '#000000',
    colorIn: '#000000',
  },
  light: {
    Foreground: '#0d86ff',
    Background: '#ffffff',
    colorOut: '#ff8080',
    colorIn: '#0059b3',
  },
  dark: {
    Foreground: '#4169e1',
    Background: '#ffffff',
    colorOut: '#cd5c5c',
    colorIn: '#191970',
  },
};

const QrCode = () => {
  const [option, setOption] = useState<IOption>(initValue);
  const [enableColor, setEnableColor] = useState(false);

  const {
    data,
    cellSize,
    padding,
    logoImg,
    backImg,
    effectType,
    effectValue,
    Background,
    Foreground,
    colorOut,
    colorIn,
    correctLevel,
  } = option;

  useEffect(() => {
    creatQr();
  }, [option, enableColor]);

  function creatQr() {
    let backgroundArr = [];
    Background && backgroundArr.push(Background);
    effectType === 'spot' && backImg && backgroundArr.push(backImg);
    const param = {
      data,
      cellSize,
      padding,
      correctLevel,
      logo: { image: logoImg },
      effect: { type: effectType, value: effectValue },
      background: backgroundArr,
    };
    const colorObj = enableColor
      ? {
          foreground: [
            // foreground color
            { style: Foreground },
            // outer squares of the positioner
            { row: 0, rows: 7, col: 0, cols: 7, style: colorOut },
            { row: -7, rows: 7, col: 0, cols: 7, style: colorOut },
            { row: 0, rows: 7, col: -7, cols: 7, style: colorOut },
            // inner squares of the positioner
            { row: 2, rows: 3, col: 2, cols: 3, style: colorIn },
            { row: -5, rows: 3, col: 2, cols: 3, style: colorIn },
            { row: 2, rows: 3, col: -5, cols: 3, style: colorIn },
          ],
        }
      : {};

    const canvas = qrcanvas({ ...param, ...colorObj });
    const qrBox = document.getElementById('QRBox') as HTMLElement;
    qrBox.innerHTML = '';
    qrBox?.append(canvas);
  }
  const changeEffect = (res) => {
    const value = res.target.value;
    if (value === 'none') {
      setOption({ ...option, effectType: undefined });
    } else {
      setOption({ ...option, effectType: value });
    }
  };

  const changeCorrectLevel = (res) => {
    const value = res.target.value;
    setOption({ ...option, correctLevel: value });
  };

  const changeTheme = (res) => {
    const value = res.target.value;
    if (value === 'default') {
      setOption({ ...option, ...themes.default });
    }
    if (value === 'light') {
      setOption({ ...option, ...themes.light });
    }
    if (value === 'dark') {
      setOption({ ...option, ...themes.dark });
    }
  };

  const creatImg = (file: Blob, type: string) => {
    let reader = new FileReader();
    let img = document.createElement('img');
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        img.src = e.target?.result as string;
        type === 'Logo' ? setOption({ ...option, logoImg: img }) : setOption({ ...option, backImg: img });
      };
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const colorList = [
    {
      name: 'Background',
      color: Background,
      setColor: (color: string) => {
        setOption({ ...option, Background: color });
      },
    },
    {
      name: 'Foreground',
      color: Foreground,
      setColor: (color: string) => {
        setOption({ ...option, Foreground: color });
      },
    },
    {
      name: 'Outside-border',
      color: colorOut,
      setColor: (color: string) => {
        setOption({ ...option, colorOut: color });
      },
    },
    {
      name: 'Inside-border',
      color: colorIn,
      setColor: (color: string) => {
        setOption({ ...option, colorIn: color });
      },
    },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.control}>
        <Row>
          <Col span={4}>内容</Col>
          <Col span={12}>
            <TextArea
              value={option.data}
              onChange={(res) => {
                setOption({ ...option, data: res.target.value });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>大小</Col>
          <Col span={12}>
            <Slider
              min={2}
              max={25}
              value={option.cellSize}
              onChange={(res) => {
                setOption({ ...option, cellSize: res });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>边距</Col>
          <Col span={12}>
            <Slider
              max={10}
              value={option.padding}
              onChange={(res) => {
                setOption({ ...option, padding: res });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>纠错级别</Col>
          <Col span={12}>
            <Radio.Group onChange={changeCorrectLevel} defaultValue="L">
              <Radio value={'L'}>7%</Radio>
              <Radio value={'M'}>15%</Radio>
              <Radio value={'Q'}>25%</Radio>
              <Radio value={'H'}>30%</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col span={4}>样式</Col>
          <Col span={12}>
            <Radio.Group onChange={changeEffect} defaultValue="none">
              <Radio value={'none'}>none</Radio>
              <Radio value={'fusion'}>fusion</Radio>
              <Radio value={'round'}>round</Radio>
              <Radio value={'spot'}>spot</Radio>
            </Radio.Group>
            {effectType && (
              <Slider
                min={0}
                max={1}
                defaultValue={1}
                step={0.1}
                onChange={(res) => {
                  setOption({ ...option, effectValue: res });
                }}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col span={4}>颜色</Col>
          <Col>
            <Row>
              <Switch
                onChange={(res) => {
                  setEnableColor(res);
                }}
              />
              {enableColor && (
                <Radio.Group onChange={changeTheme} defaultValue="default">
                  <Radio value={'default'}>default</Radio>
                  <Radio value={'light'}>light</Radio>
                  <Radio value={'dark'}>dark</Radio>
                </Radio.Group>
              )}
            </Row>
            {enableColor &&
              colorList.map((item) => {
                return (
                  <Row key={item.name}>
                    <div>{item.name}</div>
                    <Popover
                      content={
                        <SketchPicker
                          color={item.color}
                          onChange={(res) => {
                            item.setColor(res.hex);
                          }}
                        />
                      }
                    >
                      <div className={styles.colorBox} style={{ background: item.color }} />
                    </Popover>
                  </Row>
                );
              })}
          </Col>
        </Row>
        <Row>
          <Col span={4}>Logo</Col>
          <Col span={12}>
            <Upload
              name="avatar"
              listType="picture-card"
              maxCount={1}
              beforeUpload={(file) => {
                creatImg(file, 'Logo');
              }}
              onRemove={() => {
                setOption({ ...option, logoImg: undefined });
              }}
            >
              {uploadButton}
            </Upload>
          </Col>
        </Row>
        {effectType === 'spot' && (
          <Row>
            <Col span={4}>背景Logo</Col>
            <Col span={12}>
              <Upload
                name="avatar"
                listType="picture-card"
                maxCount={1}
                beforeUpload={(file) => {
                  creatImg(file, 'backImg');
                }}
                onRemove={() => {
                  setOption({ ...option, backImg: undefined });
                }}
              >
                {uploadButton}
              </Upload>
            </Col>
          </Row>
        )}
      </div>

      <div id="QRBox" className={styles.qrBox}></div>
    </div>
  );
};

export default QrCode;
