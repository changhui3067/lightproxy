import { Menu, Icon } from 'antd';

import { remote } from 'electron';
import React from 'react';
import logger from 'electron-log';
import path from 'path';

// const handleHomepage = () => remote.shell.openExternal('https://lightproxy.org?from=desktop');
// const handleIssue = () => remote.shell.openExternal('https://github.com/alibaba/lightproxy/issues');
// const handleGithub = () => remote.shell.openExternal('https://github.com/alibaba/lightproxy');
const handleUsingDocument = () => remote.shell.openExternal('http://confluence.corp.imdada.cn/pages/viewpage.action?pageId=26613023')
const handleShowLogs = () => {
    const logFile = logger.transports.file.file as string;
    const logDirectory = path.dirname(logFile);
    remote.shell.openItem(logDirectory);
};

export function getHelperMenus(t: Function) {
    return [
        // <Menu.Item key="home" onClick={handleHomepage}>
        //     <Icon type="home" />
        //     {t('Home Page & Document')}
        // </Menu.Item>,
        // <Menu.Item key="issue" onClick={handleIssue}>
        //     <Icon type="bug" />
        //     {t('Report issue')}
        // </Menu.Item>,
        // <Menu.Item key="github" onClick={handleGithub}>
        //     <Icon type="github" />
        //     {t('Github')}
        // </Menu.Item>,
        <Menu.Item key="usingDocument" onClick={handleUsingDocument}>
            <Icon type="file-text" />
            {t('Using Document')}
        </Menu.Item>,
        <Menu.Item key="log" onClick={handleShowLogs}>
            <Icon type="file-text" />
            {t('Show logs')}
        </Menu.Item>,
    ];
}
