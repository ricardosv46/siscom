
interface IProps {
    id: string
}
const StoreProcessElectoralStorageService = ({ id }: IProps) => {
    if (id) {
        return localStorage.setItem('IdSelectedProcess', id.toString())
    }
}

const GetProcessElectoralStorageService = async () => {
    return await localStorage.getItem('IdSelectedProcess')
}

const RemoveProcessElectoralStorageService = () => {
    localStorage.removeItem('IdSelectedProcess')
}

export { StoreProcessElectoralStorageService, GetProcessElectoralStorageService, RemoveProcessElectoralStorageService }
