
import React from 'react';
import { Switch, Space, Button } from 'antd';
import 'antd/dist/antd.css';
import './index.css';


interface ModifyNavProps {
  ajaxToolsSwitchOn: boolean;
  ajaxToolsExpandAll: boolean;

  onGroupAdd: () => void;
  onPageHeadersOpen: () => void;
  updateAjaxToolsSwitchOn: (value: boolean) => void;
  updateAjaxToolsExpandAll: (value: boolean) => void;
}

/** 导航栏 */
const ModifyNav = (props: ModifyNavProps) => {

  const { ajaxToolsSwitchOn, ajaxToolsExpandAll, onGroupAdd, onPageHeadersOpen, updateAjaxToolsSwitchOn, updateAjaxToolsExpandAll } = props;

  return (
    <nav className="ajax-tools-iframe-action">
      <Space>
        <Button size="small" type="primary" onClick={onGroupAdd}>Add Group</Button>
        <Button size="small" onClick={onPageHeadersOpen}>Page Headers</Button>
      </Space>
      <div>
        <Switch
          style={{ marginRight: '8px' }}
          defaultChecked
          checkedChildren="Expand All"
          unCheckedChildren="Collapse All"
          checked={ajaxToolsExpandAll}
          onChange={(value) => {
            if(!chrome.storage) return;
            updateAjaxToolsExpandAll(value);
            chrome.storage.local.set({ ajaxToolsExpandAll: value });
          }}
        />
        <Switch
          defaultChecked
          checkedChildren="Turn on"
          unCheckedChildren="Turn off"
          checked={ajaxToolsSwitchOn}
          onChange={(value) => {
            if(!chrome.storage) return;
            updateAjaxToolsSwitchOn(value);
            chrome.storage.local.set({ ajaxToolsSwitchOn: value });
          }}
        />
      </div>
    </nav>
  );
};

export default ModifyNav;
