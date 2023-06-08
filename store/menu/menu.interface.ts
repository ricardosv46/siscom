export interface IMenuStore {
    IdSelectedProcess: string,
    changeStateSelectedProcess:(id: string) => void
    getStateSelectedProcess:() => void
}
