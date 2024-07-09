import { BarChartOutlined, FileSearchOutlined, HomeOutlined, KeyOutlined } from '@ant-design/icons'

export const menuSelect = [{ id: 1, key: '/processes', icon: <KeyOutlined />, label: 'Procesos' }]

export const menuAdmin = [
  { id: 1, key: '/processes', icon: <KeyOutlined />, label: 'Procesos' },
  { id: 2, key: '/', icon: <HomeOutlined />, label: 'Inicio' },
  { id: 3, key: '/list-pas', icon: <FileSearchOutlined />, label: 'Listado de PAS' },
  { id: 4, key: '/register-pay', icon: <FileSearchOutlined />, label: 'Registro de Pago' },
  { id: 5, key: '/stats-op', icon: <BarChartOutlined />, label: 'Estadística OP' },
  { id: 6, key: '/stats-candidate', icon: <BarChartOutlined />, label: 'Estadística Candidato' }
]
