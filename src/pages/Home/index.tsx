import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from 'umi';
import styles from './index.less';

const HomePage: React.FC = () => {
    const { name } = useModel('global');
    return (
        <div className={styles.container}>
            <Guide name={trim(name)} />
        </div>
    );
};

export default HomePage;
