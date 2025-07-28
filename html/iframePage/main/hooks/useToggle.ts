import { useState } from 'react';

export const useToggle = () => {
  const [ajaxToolsSwitchOn, setAjaxToolsSwitchOn] = useState(true); // 默认开启
  const [ajaxToolsExpandAll, setAjaxToolsExpandAll] = useState(false); // 默认开启
  
  return {
    ajaxToolsSwitchOn, 
    ajaxToolsExpandAll,
    setAjaxToolsSwitchOn,
    setAjaxToolsExpandAll
  };
};