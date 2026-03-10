import { RouterProvider } from 'react-router';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import router from './routes';

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#0d9488',
          colorLink: '#0d9488',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Menu: {
            itemSelectedBg: 'rgba(13,148,136,0.08)',
            itemSelectedColor: '#0d9488',
            itemHoverBg: '#f8fafc',
            itemHoverColor: '#0d9488',
          },
          Layout: {
            siderBg: '#ffffff',
            headerBg: '#ffffff',
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
