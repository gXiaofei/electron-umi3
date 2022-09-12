import { initialStateType } from '@/app';
import Avatar from '@/components/Avatar';
import Notice from '@/components/NoticeIcon';
import { useModel } from 'umi';
import { Space, Switch } from 'antd';
import { useState } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import styles from './index.less';
import { switcherTheme } from '@/themes/themeSwitcher';
import themeMap from '@/themes/theme';

const RightContent = () => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { switcher, currentTheme, status, themes } = useThemeSwitcher();

    /** 切换暗黑主题 */
    const toggleTheme = (isChecked: boolean) => {
        setIsDarkMode(isChecked);
        setInitialState({
            ...initialState,
            theme: isChecked ? 'dark' : 'light',
        } as initialStateType);
        switcher({ theme: isChecked ? themes.dark : themes.light });

        switcherTheme({
            watch: true,
            onlyLegacy: true,
            variables: themeMap[isChecked ? themes.dark : themes.light],
        });
    };

    return (
        <div className={styles.rightContent} id="rightContent">
            <Space>
                <Notice />
                <Avatar />
                <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    checkedChildren={'🌛'}
                    unCheckedChildren={'🌞'}
                />
            </Space>
        </div>
    );
};

export default RightContent;
