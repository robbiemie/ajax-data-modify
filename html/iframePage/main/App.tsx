import React, { useRef } from 'react';
import ModifyDataModal from './components/ModifyDataModal';
import 'antd/dist/antd.css';
import './App.css';
import Footer from './components/Footer';
import ModifyNav from './components/ModifyNav';

import RenderWrapper from './components/RenderWrapper';
import { useToggle } from './hooks/useToggle';
import { useRegistry } from './hooks/useRegistry';
import { usePageHeaders } from './hooks/usePageHeaders';
import { CollapseList } from './components/CollapseList';
import { CollapseHeader } from './components/CollapseHeader';
import PageHeadersModal from './components/PageHeadersModal';
import GlobalControlDock, { GlobalSwitchItem } from './components/GlobalControlDock';

function App() {
  const modifyDataModalRef = useRef<any>({});

  const {
    ajaxToolsSwitchOn,
    ajaxToolsExpandAll,

    setAjaxToolsSwitchOn,
    setAjaxToolsExpandAll,
    updateAjaxToolsSwitchOn,
  } = useToggle();

  const {
    isRegistry,
    ajaxDataList,
    ajaxToolsSkin,

    onGroupAdd,
    onGroupMove,
    onImportClick,
    setIsRegistry,
    onGroupDelete,
    setAjaxDataList,
    onInterfaceMove,
    setAjaxToolsSkin,
    onCollapseChange,
    onGroupOpenChange,
    onInterfaceListAdd,
    onInterfaceListSave,
    onInterfaceListDelete,
    onInterfaceListChange,
    onGroupSummaryTextChange
  } = useRegistry();
  const {
    visible: pageHeadersVisible,
    enabled: pageHeadersEnabled,
    quickEnabled: pageHeadersQuickEnabled,
    quickToggling: pageHeadersQuickToggling,
    pageOrigin,
    headerPairs,
    setVisible: setPageHeadersVisible,
    setEnabled: setPageHeadersEnabled,
    addHeaderPair,
    removeHeaderPair,
    updateHeaderPair,
    openModal: openPageHeadersModal,
    save: savePageHeaders,
    toggleQuickEnabled: togglePageHeadersQuickEnabled,
  } = usePageHeaders();

  if (chrome.storage && chrome.runtime && !isRegistry) {
    setIsRegistry(true);
    console.log('ajax interceptor iframe 已开启监听 🟢');
    chrome.storage.local.get(
      ['ajaxDataList', 'ajaxToolsSwitchOn', 'ajaxToolsSkin', 'ajaxToolsExpandAll'],
      (result) => {
        const {
          ajaxDataList = [],
          ajaxToolsSwitchOn = true,
          ajaxToolsSkin = 'light',
          ajaxToolsExpandAll
        } = result;
        console.log('ajax interceptor iframe 本地结果值 🟩', result);
        if (ajaxDataList.length > 0) {
          setAjaxDataList(ajaxDataList);
        }
        setAjaxToolsSwitchOn(ajaxToolsSwitchOn);
        setAjaxToolsSkin(ajaxToolsSkin);
        setAjaxToolsExpandAll(ajaxToolsExpandAll);
      }
    );
  }

  const updateAjaxToolsExpandAll = (value: boolean) => {
    for(let index = 0 ;index < ajaxDataList.length; index++) {
      const item = ajaxDataList[index] || {};
      const { interfaceList = [] } = item;
      const activeKeys = interfaceList.map(item => item.key);
      if(!value) {
        onCollapseChange(index, []);
      } else {
        onCollapseChange(index, activeKeys || []);
      }
    }
    setAjaxToolsExpandAll(value);
  };

  const globalSwitchItems: GlobalSwitchItem[] = [
    {
      key: 'global-switch',
      label: 'Global Interceptor',
      checked: ajaxToolsSwitchOn,
      checkedText: 'On',
      uncheckedText: 'Off',
      onChange: (value) => {
        if(!chrome.storage) return;
        updateAjaxToolsSwitchOn(value);
        chrome.storage.local.set({ ajaxToolsSwitchOn: value });
      }
    },
    {
      key: 'page-header-switch',
      label: 'Current Page Header',
      checked: pageHeadersQuickEnabled,
      loading: pageHeadersQuickToggling,
      checkedText: 'On',
      uncheckedText: 'Off',
      onChange: (value) => {
        void togglePageHeadersQuickEnabled(value);
      }
    }
  ];

  return (
    <div
      className="ajax-tools-iframe-container"
      style={{
        filter: ajaxToolsSkin === 'dark' ? 'invert(1)' : undefined
      }}
    >
      <GlobalControlDock items={globalSwitchItems} />
      <ModifyNav
        ajaxToolsExpandAll={ajaxToolsExpandAll}
        updateAjaxToolsExpandAll={updateAjaxToolsExpandAll}
        onGroupAdd={onGroupAdd}
        onPageHeadersOpen={openPageHeadersModal}
      />

      <RenderWrapper
        ajaxDataList={ajaxDataList}
        onGroupAdd={onGroupAdd}
        onImportClick={onImportClick}
      >
        <main
          className="ajax-tools-iframe-body"
          style={{ filter: ajaxToolsSwitchOn ? undefined : 'opacity(0.5)' }}
        >
          {ajaxDataList.map((item, index) => {
            const { summaryText, headerClass, interfaceList = [], collapseActiveKeys = [] } = item;
            const groupOpen = !!interfaceList.find((v) => v.open);
            const fold = collapseActiveKeys.length < 1;
            return (
              <div key={index}>
                <CollapseHeader
                  fold={fold}
                  index={index}
                  groupOpen={groupOpen}
                  headerClass={headerClass}
                  ajaxDataList={ajaxDataList}
                  summaryText={summaryText}
                  interfaceList={interfaceList}
                  onGroupDelete={onGroupDelete}
                  onGroupMove={onGroupMove}
                  onCollapseChange={onCollapseChange}
                  onGroupOpenChange={onGroupOpenChange}
                  onGroupSummaryTextChange={onGroupSummaryTextChange}
                />
                <CollapseList
                  fold={fold}
                  index={index}
                  ajaxDataList={ajaxDataList}
                  interfaceList={interfaceList}
                  modifyDataModalRef={modifyDataModalRef}
                  collapseActiveKeys={collapseActiveKeys}
                  onInterfaceMove={onInterfaceMove}
                  onInterfaceListAdd={onInterfaceListAdd}
                  onCollapseChange={onCollapseChange}
                  onInterfaceListDelete={onInterfaceListDelete}
                  onInterfaceListChange={onInterfaceListChange}
                />
              </div>
            );
          })}
        </main>
      </RenderWrapper>
      <Footer />
      <ModifyDataModal ref={modifyDataModalRef} onSave={onInterfaceListSave} />
      <PageHeadersModal
        visible={pageHeadersVisible}
        enabled={pageHeadersEnabled}
        pageOrigin={pageOrigin}
        headerPairs={headerPairs}
        setVisible={setPageHeadersVisible}
        setEnabled={setPageHeadersEnabled}
        addHeaderPair={addHeaderPair}
        removeHeaderPair={removeHeaderPair}
        updateHeaderPair={updateHeaderPair}
        onSave={savePageHeaders}
      />
    </div>
  );
}

export default App;
