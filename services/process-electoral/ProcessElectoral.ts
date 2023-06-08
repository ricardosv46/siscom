
interface IProps {
    id: string
}
const StoreProcessElectoralStorageService = ({ id }: IProps) => {
    if (id) {
        return localStorage.setItem('IdSelectedProcess', id.toString())
    }
}

const GetProcessElectoralStorageService = () => {
    return localStorage.getItem('IdSelectedProcess')
}

const RemoveProcessElectoralStorageService = () => {
    localStorage.removeItem('IdSelectedProcess')
}

export { StoreProcessElectoralStorageService, GetProcessElectoralStorageService, RemoveProcessElectoralStorageService }
