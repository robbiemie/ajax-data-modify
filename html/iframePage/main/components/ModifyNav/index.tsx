
import React, { useEffect, useState } from 'react';
import { Switch, Space, Button } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import { AjaxDataListObject } from '../../../common/value';


interface ModifyNavProps {
  ajaxDataList: AjaxDataListObject[];
  ajaxToolsSwitchOn: boolean;

  onGroupAdd: () => void;
  onImportClick: () => void;
  updateAjaxToolsSwitchOn: (value: boolean) => void;
}

/** 导航栏 */
const ModifyNav = (props: ModifyNavProps) => {

  const { onGroupAdd, ajaxToolsSwitchOn, updateAjaxToolsSwitchOn } = props;

  return (
    <nav className="ajax-tools-iframe-action">
      <Space>
        <Button size="small" type="primary" onClick={onGroupAdd}>Add Group</Button>
      </Space>
      <div>
        <Switch
          style={{ marginRight: '8px' }}
          defaultChecked
          checkedChildren="Expand All"
          unCheckedChildren="Collapse All"
          checked={ajaxToolsSwitchOn}
          onChange={(value) => {
            if(!chrome.storage) return;
            updateAjaxToolsSwitchOn(value);
            chrome.storage.local.set({ ajaxToolsSwitchOn: value });
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
