/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/connect',
        destination: 'http://127.0.0.1:5000/connect',
      },
      {
        source: '/settings',
        destination: 'http://127.0.0.1:5000/settings',
      },
      {
        source: '/get_state',
        destination: 'http://127.0.0.1:5000/get_state',
      },
      {
        source: '/new_genome',
        destination: 'http://127.0.0.1:5000/new_genome',
      },
      {
        source: '/run_frame',
        destination: 'http://127.0.0.1:5000/run_frame',
      },
      {
        source: '/test',
        destination: 'http://127.0.0.1:5000/test',
      },
      {
        source: '/update_cars',
        destination: 'http://127.0.0.1:5000/update_cars',
      },
      {
        source: '/update_population',
        destination: 'http://127.0.0.1:5000/update_population',
      },
      {
        source: '/stop',
        destination: 'http://127.0.0.1:5000/stop',
      },
      {
        source: '/reset',
        destination: 'http://127.0.0.1:5000/reset',
      },
      {
        source: '/count',
        destination: 'http://127.0.0.1:5000/count',
      },
    ];
  },
};

export default nextConfig;
