import dynamic from 'next/dynamic';

const RifaDashboard = dynamic(() => import('../dashboard/rifas/RifaDashboard'), { ssr: false });

export default function RifasPage() {
  return <RifaDashboard />;
}
