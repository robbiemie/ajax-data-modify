import { Modal, Tabs, Input, Card, Space, Select } from 'antd';
import React, { ForwardedRef, useImperativeHandle, useRef, useState } from 'react';
import MonacoEditor from '../MonacoEditor';
import { HTTP_METHOD_MAP } from '../../common/value';

import './index.css';

export interface ModifyDataModalOnSaveProps {
  groupIndex: number,
  interfaceIndex: number,
  replacementMethod: string,
  replacementUrl: string,
  headersEditorValue: string,
  responseEditorValue:string,
  language: string
}
interface ModifyDataModalProps {
  onSave: (
    { groupIndex, interfaceIndex, replacementMethod, replacementUrl, headersEditorValue, responseEditorValue, language } : ModifyDataModalOnSaveProps
  ) => void;
}
interface OpenModalProps {
  groupIndex: number,
  interfaceIndex: number,
  activeTab: string;
  request: string;
  replacementMethod: string;
  replacementUrl: string;
  headersText: string;
  responseLanguage: string;
  responseText: string;
}

const Wrapper = React.memo((props: { children: any }) => {
  return <div style={{ height: 'calc(100vh - 260px)', overflow: 'auto' }}>
    {props.children}
  </div>;
});

const ModifyDataModal = (
  props: ModifyDataModalProps,
  ref: ForwardedRef<{ openModal: (props: OpenModalProps)=>void }>
) => {
  const monacoEditorHeadersRef = useRef<any>({});
  const monacoEditorResponseRef = useRef<any>({});

  const { onSave = () => {} } = props;
  const [visible, setVisible] = useState(false);
  const [groupIndex, setGroupIndex] = useState(0);
  const [interfaceIndex, setInterfaceIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Response');
  const [request, setRequest] = useState(''); // matched url
  const [replacementMethod, setReplacementMethod] = useState('');
  const [replacementUrl, setReplacementUrl] = useState('');
  const [headersText, setHeadersText] = useState('');
  const [responseLanguage, setResponseLanguage] = useState('json');
  const [responseText, setResponseText] = useState('');

  useImperativeHandle(ref, () => ({
    openModal
  }));

  const openModal = (
    { groupIndex, interfaceIndex, activeTab, request, replacementMethod, replacementUrl, headersText, responseLanguage, responseText } : OpenModalProps
  ) => {
    setGroupIndex(groupIndex);
    setInterfaceIndex(interfaceIndex);
    setActiveTab(activeTab);
    setRequest(request);
    // modify ⬇️
    setReplacementMethod(replacementMethod);
    setReplacementUrl(replacementUrl);
    setHeadersText(headersText);
    setResponseLanguage(responseLanguage);
    setResponseText(responseText);
    setVisible(true);
  };

  const handleOk = () => {
    const { editorInstance:headersEditorInstance } = monacoEditorHeadersRef.current;
    const { editorInstance:responseEditorInstance } = monacoEditorResponseRef.current;
    const headersEditorValue = headersEditorInstance?.getValue();
    const responseEditorValue = responseEditorInstance?.getValue();
    const language = responseEditorInstance?.getModel()?.getLanguageId();
    onSave({ groupIndex, interfaceIndex, replacementMethod, replacementUrl, headersEditorValue, responseEditorValue, language });
    setVisible(false);
  };

  return <>
    <Modal
      centered
      title={<span style={{ fontSize: 12 }}>Matched URL：{request}</span>}
      width={'98%'}
      open={visible}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      okText="Save"
      cancelText="Cancel"
      bodyStyle={{
        padding: 12
      }}
    >
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        size="small"
        onChange={(v) => setActiveTab(v)}
        items={[
          {
            label: `Request`,
            key: 'Request',
            children: <Wrapper>
              <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                <Card title="Replacement Request URL" type="inner" size="small">
                  <Space.Compact style={{ width: '100%' }}>
                    <Select
                      dropdownMatchSelectWidth={false}
                      value={replacementMethod}
                      onChange={(value) => setReplacementMethod(value)}
                    >
                      <Select.Option value="">*(any)</Select.Option>
                      { HTTP_METHOD_MAP.map((method) => <Select.Option key={method} value={method}>{method}</Select.Option>) }
                    </Select>
                    <Input
                      value={replacementUrl}
                      placeholder="Please enter the URL you want to replace with."
                      onChange={(e) => setReplacementUrl(e.target.value)}
                    />
                  </Space.Compact>
                </Card>
                <Card title="Request Headers" type="inner" size="small">
                  <MonacoEditor
                    ref={monacoEditorHeadersRef}
                    language={'json'}
                    languageSelectOptions={['json']}
                    text={headersText}
                    editorHeight={'calc(100vh - 300px - 168px)'}
                  />
                </Card>
              </Space>
            </Wrapper>,
          },
          // {
          //   label: `Request Payload`,
          //   key: 'RequestPayload',
          //   children: <MonacoEditor
          //     ref={monacoEditorHeadersRef}
          //     language={'json'}
          //     languageSelectOptions={['json']}
          //     text={headersText}
          //   />,
          // },
          {
            label: `Response`,
            key: 'Response',
            children: <MonacoEditor
              ref={monacoEditorResponseRef}
              language={responseLanguage}
              text={responseText}
            />,
          },
        ]}
      />
    </Modal>
  </>;
};

export default React.memo(React.forwardRef(ModifyDataModal));
