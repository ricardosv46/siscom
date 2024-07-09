import { Modal } from 'antd'
import axios from 'axios'
import Router from 'next/router'

export const apiService = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/`
})

export const authService = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/`
})

apiService.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['x-access-tokens'] = token
  }
  return config
})

apiService.interceptors.response.use(
  function (response) {
    if (response.data) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('electoralProcess')
        localStorage.removeItem('selectedProcess')
        localStorage.removeItem('filters')
        Modal.destroyAll()
        Router.push('/auth/login')
        return Promise.reject(response)
      } else {
        return response
      }
    }

    return Promise.reject(response)
  },
  function (error) {
    if (error.code === 'ERR_NETWORK') {
      const instance = Modal.info({
        content: error.message,
        centered: true,
        async onOk() {
          instance.destroy()
        }
      })

      return Promise.reject({ data: { message: error.message } })
    }

    if (error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('electoralProcess')
      localStorage.removeItem('selectedProcess')
      localStorage.removeItem('filters')
      Modal.destroyAll()
      Router.push('/auth/login')
      return Promise.reject(error.response)
    }
    if (error.response.status === 413) {
      const instance = Modal.info({
        width: 500,

        bodyStyle: { padding: '35px 30px 35px 30px' },
        content: 'El archivo es muy grande',
        centered: true,
        async onOk() {
          instance.destroy()
        }
      })

      return Promise.reject(error.response)
    }
    if (error.response.status === 200) {
      return Promise.reject(error.response)
    } else {
      const instance = Modal.info({
        width: 500,

        bodyStyle: { padding: '35px 30px 35px 30px' },
        content: error?.response?.data?.data?.document ? error?.response?.data?.data?.document[0] : error?.response?.data?.message,
        centered: true,
        async onOk() {
          instance.destroy()
        }
      })

      return Promise.reject(error.response)
    }
  }
)

export default apiService
