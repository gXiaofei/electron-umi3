import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { initialStateType } from '@/app';
import { useModel, useLocation } from 'umi';
import { Button } from 'antd';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import Header from './header';
import styles from './layout.less';
import Sider from './sider';
import useTheme from '@/hooks/useTheme';
import isElectron from 'is-electron';
import { initTheme } from '@/themes/themeSwitcher';
import routes, { routeType } from '../../config/routes';

const themes = {
    dark: 'styles/dark-theme.css',
    light: 'styles/light-theme.css',
};

interface IProps {
    children: ReactElement;
}

export default (props: IProps) => {
    const { children } = props;
    const { initialState, setInitialState } = useModel('@@initialState');
    const [collapsed, setCollapsed] = useState(false);
    const [menuRender, setMenuRender] = useState(false);
    const { themeName } = useTheme();
    const { pathname } = useLocation();
    const currentRouteProps = useRef<routeType>({});

    const findCurrentRouteProps = (pathname: string, routes: routeType[]) => {
        for (let i = 0; i < routes.length; i++) {
            if (pathname === routes[i].path) {
                currentRouteProps.current = routes[i];
                break;
            }

            if (routes[i] && Array.isArray(routes[i].routes)) {
                findCurrentRouteProps(
                    pathname,
                    routes[i].routes as routeType[],
                );
            }
        }
    };

    useEffect(() => {
        /** 根据路由menuRender属性来设置显示header和sider */
        findCurrentRouteProps(pathname, routes);

        if (currentRouteProps.current) {
            if (currentRouteProps.current.menuRender === undefined) {
                if (!menuRender) setMenuRender(true);
            } else {
                if (currentRouteProps.current.menuRender !== menuRender)
                    setMenuRender(currentRouteProps.current.menuRender);
            }
        }
    }, [pathname, menuRender]);

    useEffect(() => {
        // mac 跟随系统设置主题色
        if (!isElectron()) {
            setInitialState({
                ...initialState,
                theme: themeName,
            } as initialStateType);
        }
    }, [themeName]);

    useEffect(() => {
        initTheme();
    }, []);

    useEffect(() => {
        // width 小于等于 1000 自动收起
        const resizeFn = () => {
            if (window.innerWidth <= 1000) {
                if (!collapsed) {
                    setCollapsed(true);
                }
            }
        };
        resizeFn();
        window.addEventListener('resize', resizeFn);
        return () => {
            window.removeEventListener('resize', resizeFn);
        };
    }, []);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <ThemeSwitcherProvider
            themeMap={themes}
            defaultTheme={initialState?.theme}
        >
            <div className={styles.container}>
                {menuRender ? (
                    <>
                        <Header />
                        <div className={styles.content}>
                            <Sider collapsed={collapsed} />
                            <div className={styles.pageContainer}>
                                <Button
                                    type="primary"
                                    className={styles.collapsedBtn}
                                    onClick={toggleCollapsed}
                                >
                                    {collapsed ? (
                                        <RightOutlined />
                                    ) : (
                                        <LeftOutlined />
                                    )}
                                </Button>
                                {children}
                            </div>
                        </div>
                    </>
                ) : (
                    children
                )}
            </div>
        </ThemeSwitcherProvider>
    );
};
