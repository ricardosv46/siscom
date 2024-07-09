import { Pay } from '@interfaces/payment'
import dayjs from 'dayjs'

interface TranckingCardProps {
  keyId: number
  isEvenNumber: boolean
  item: Pay
}

export const RegisterPayCard = ({ item, isEvenNumber, keyId }: TranckingCardProps) => {
  const { amount, bank, created_at, date, fees, payment_date, payment_method, receipt_number } = item

  return (
    <div className={`${isEvenNumber ? '' : 'flex-row-reverse'} mb-8 flex  justify-between items-center w-full right-timeline`}>
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 w-8 h-8 bg-gray-800 rounded-full shadow-xl">
        {isEvenNumber && <img src={`/images/icons/${keyId <= 1 ? 'add' : 'flag'}.png`} />}
        {!isEvenNumber && <img src={`/images/icons/${keyId <= 1 ? 'new' : 'flag'}.png`} />}
      </div>

      <div
        className={`${'bg-white'}
            relative order-1 border-t-4 border-brown  rounded-lg shadow-xl w-5/12 px-6 py-4 `}>
        {isEvenNumber && (
          <div className="flex justify-start w-full">
            <div className="relative">
              <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-10 max-w-[150px]">
                <span className="text-xl text-gray-400 ">◄</span>
              </div>
            </div>
          </div>
        )}

        {!isEvenNumber && (
          <div className="flex justify-end w-full mx-11">
            <div className="relative">
              <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-78 max-w-[150px]">
                <span className="text-xl text-gray-400 ">►</span>
              </div>
            </div>
          </div>
        )}
        <h3 className="font-bold text-gray-500 ">
          Tipo Registro: <span className="uppercase">{payment_method}</span>
        </h3>
        <h3 className="font-bold text-gray-500 ">Fecha: {dayjs(payment_date).format('DD MMM YYYY')}</h3>
        {amount && <h3 className="font-bold text-gray-500">Monto Abonado: S/. {amount}</h3>}
        {fees && <h3 className="font-bold text-gray-500">Cuotas: {fees}</h3>}
        {bank && <h3 className="font-bold text-gray-500">Banco: {bank}</h3>}
        {receipt_number && <h3 className="font-bold text-gray-500">Número de operación: {receipt_number}</h3>}

        {created_at && <h3 className="font-bold text-gray-500 ">Fecha de Actualización: {dayjs(created_at).format('DD MMM YYYY')} </h3>}
      </div>
    </div>
  )
}
