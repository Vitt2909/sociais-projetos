import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('./RifaDashboard'), { ssr: false });

export default Dashboard;
