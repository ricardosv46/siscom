import { Access, Certificate, Clients, Listpas, Process, User } from "@framework/types"
import { NotificationPlacement } from "antd/lib/notification"
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer } from "react"

interface notification{
  title:string,
  description:string,
  placement?:NotificationPlacement
}

export interface State{
  displayModal:boolean
  modalView:MODAL_VIEWS
  users:User[]
  clients:Clients[]
  process:Process[]
  access:Access[]
  certificates:Certificate[]
  listpas:Listpas[]
  useAvatar:string
  displayNotification:boolean
  notification:notification
  editID:string
}

const initialState:State = {
  displayModal:false,
  modalView: "LOGIN_VIEW",
  users:[],
  certificates:[],
  clients:[],
  process:[],
  access:[],
  listpas:[],
  useAvatar:'',
  displayNotification:false,
  notification: {
    title:'',
    description:'',
    placement:'bottomRight'
  },
  editID: ''
}
type MODAL_VIEWS = 'SIGNUP_VIEW' | 'LOGIN_VIEW' | 'USER_VIEW' | 'CLIENT_VIEW' | 'PROCESS_VIEW' | 'ACCESS_VIEW'  | 'LISTADOPAS_VIEW'
type Action = 
| { type:'OPEN_MODAL' } | { type:'CLOSE_MODAL' } | { type:'SET_MODAL_VIEW', view:MODAL_VIEWS } 
| { type:'SET_USER_AVATAR', value:string } 
| { type:'ADD_USER', value:User[] } | { type:'ADD_A_USER', value:User } | { type:'REMOVE_USER', value:number } 
| { type:'ADD_CERTIFICATES', value:Certificate[] }
| { type:'ADD_CLIENT', value:Clients[] } | { type:'ADD_A_CLIENT', value:Clients } | { type:'REMOVE_CLIENT', value:number }
| { type:'ADD_PROCESS', value:Process[] } | { type:'REMOVE_PROCESS', value:number }
| { type:'ADD_ACCESS', value:Access[] } | { type:'REMOVE_ACCESS', value:number }
| { type:'OPEN_NOTIFICATION' } | { type:'CLOSE_NOTIFICATION' } | { type:'SET_NOTIFICATION', value:notification }
| { type: 'EDIT_ID', value:string }

export const UIContext = createContext<State | any>(initialState)

UIContext.displayName = 'UIContext'

function uiReducer(state: State, action: Action){
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        displayModal:true
      }    
    case 'CLOSE_MODAL':
      return {
        ...state,
        displayModal:false
      }    
    case 'SET_MODAL_VIEW': 
      return {
        ...state,
        modalView: action.view,
      }
    case 'SET_USER_AVATAR': 
      return {
        ...state,
        useAvatar: action.value,
      }
    case 'ADD_USER':
      return {
        ...state,
        users: action.value
      }
    case 'ADD_A_USER':
      return{
        ...state,
        users: state.users.concat(action.value)
      }
    case 'REMOVE_USER':      
      return{
        ...state,
        users: state.users.filter(item => item.id !== action.value)
      }
    case 'ADD_CERTIFICATES':
      return {
        ...state,
        certificates: action.value
      }
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: action.value
      }
    case 'ADD_A_CLIENT':
      return {
        ...state,
        clients: state.clients.concat(action.value)
      }
    case 'REMOVE_CLIENT':      
      return{
        ...state,
        clients: state.clients.filter(item => item.id !== action.value)
      }
    case 'ADD_PROCESS':
      return {
        ...state,
        process: action.value
      }
    case 'REMOVE_PROCESS':      
      return{
        ...state,
        process: state.process.filter(item => item.id !== action.value)
      }
    case 'ADD_ACCESS':
      return {
        ...state,
        access: action.value
      }
    case 'REMOVE_ACCESS':      
      return{
        ...state,
        access: state.access.filter(item => item.id !== action.value)
      }
    case 'OPEN_NOTIFICATION':
      return{
        ...state,
        displayNotification:true
      }
    case 'CLOSE_NOTIFICATION':
      return{
        ...state,
        displayNotification:false
      }
    case 'SET_NOTIFICATION':
      return{
        ...state,
        notification: action.value
      }
    case 'EDIT_ID':
      return {
        ...state,
        editID: action.value
      }
  }
}

interface UIProviderProps {
  children?: ReactNode
  pageProps:any
}

export const UIProvider:FC<UIProviderProps> = ({pageProps,children,...props}) => {
  const [state, dispatch] = useReducer(uiReducer, initialState)
  const { users, clients, process, access, certificates } = pageProps
  useEffect(()=>{
    if(users){
      addUsers(users)
    }
    if(clients){
      addClients(clients)
    }
    if(process){
      addProcess(process)
    }
    if(access){
      addAccess(access)
    }
  },[pageProps])
  
  const openModal = useCallback(
    () => dispatch({ type:'OPEN_MODAL' }),
    [dispatch]
  )
  const closeModal = useCallback(
    () => dispatch({ type: 'CLOSE_MODAL' }),
    [dispatch]
  )
  const setModalView = useCallback(
    (view: MODAL_VIEWS) => dispatch({ type: 'SET_MODAL_VIEW', view }),
    [dispatch]
  )
  const setUserAvatar = useCallback(
    (value: string) => dispatch({ type: 'SET_USER_AVATAR', value }),
    [dispatch]
  )
  const addUsers = useCallback(
    (data:User[])=> dispatch({ type:'ADD_USER', value:data }),
    [users]
  )
  const addAUser = useCallback(
    (data:User)=> dispatch({ type:'ADD_A_USER', value:data }),
    [users]
  )
  const removeUser = useCallback(
    (value:number)=> dispatch({ type:'REMOVE_USER', value }),
    [dispatch]
  )
  const addCertificates = useCallback(
    (data:Certificate[]) => dispatch({ type:'ADD_CERTIFICATES', value:data}),
    [certificates]
  )
  const addClients = useCallback(
    (data:any)=> dispatch({ type:'ADD_CLIENT', value:data }),
    [clients]
  )
  const addAClients = useCallback(
    (data:Clients) => dispatch({ type: 'ADD_A_CLIENT', value: data}),
    [clients]
  )
  const removeClient = useCallback(
    (value:number)=> dispatch({ type:'REMOVE_CLIENT', value }),
    [dispatch]
  )
  const addProcess = useCallback(
    (data:any)=> dispatch({ type:'ADD_PROCESS', value:data }),
    [process]
  )
  const removeProcess = useCallback(
    (value:number)=> dispatch({ type:'REMOVE_PROCESS', value }),
    [dispatch]
  )
  const addAccess = useCallback(
    (data:any)=> dispatch({ type:'ADD_ACCESS', value:data }),
    [access]
  )
  const removeAccess = useCallback(
    (value:number)=> dispatch({ type:'REMOVE_ACCESS', value }),
    [dispatch]
  )
  const openNotification = useCallback(
    () => dispatch({ type:'OPEN_NOTIFICATION' }),
    [dispatch]
  )
  const closeNotification = useCallback(
    () => dispatch({ type:'CLOSE_NOTIFICATION' }),
    [dispatch]
  )
  const setNotification = useCallback(
    (value: notification) => dispatch({ type: 'SET_NOTIFICATION', value }),
    [dispatch]
  )
  const setEditId = useCallback(
    (value:string) => dispatch({ type: 'EDIT_ID', value}),
    [dispatch]
  )
  const valueUi = useMemo( () => ({
    ...state,
    openModal,
    closeModal,
    setModalView,
    setUserAvatar,
    addUsers,
    addAUser,
    removeUser,
    addCertificates,
    addClients,
    addAClients,
    removeClient,
    openNotification,
    closeNotification,
    setNotification,
    addProcess,
    removeProcess,
    addAccess,
    removeAccess,
    setEditId
  }),[state])

  return <UIContext.Provider value={valueUi} {...props}>{children}</UIContext.Provider>
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`)
  }
  return context
}

interface ManagedUIContextProps {
  children?: ReactNode,
  pageProps:any
}
export const ManagedUIContext: FC<ManagedUIContextProps> = ({ pageProps, children }) => {
  return (
    <UIProvider pageProps={pageProps}>
      {children}
    </UIProvider>
  )
}
