/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    codigo_acceso: [
      {type:'production', name:'Producción'},
      {type:'simulacrum', name:'Simulacro'},
      {type:'test', name:'Prueba'},
      {type:'qa', name:'Calidad'},
      {type:'developing', name:'Desarrollo'},
    ],
  },
}

module.exports = nextConfig
