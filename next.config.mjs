/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  allowedDevOrigins: [
        "http://10.132.96.129:3000",
        "http://192.168.1.5:3000",
        "http://localhost:3000",
        "10.132.96.129"
    ],
  reactCompiler: true,
};

export default nextConfig;
  