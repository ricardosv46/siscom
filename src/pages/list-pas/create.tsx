import { CreateProcessForm } from '@components/forms/processes/CreateProcessForm'
import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { useSelectedProcess } from '@store/selectedProcess'

const CreateProcess = () => {
  const { selectedProcess } = useSelectedProcess()
  const num_expediente = selectedProcess?.num_expediente ? `- Exp. ${selectedProcess?.num_expediente}` : ''

  const headerName = `${selectedProcess?.name} - R.G. ${selectedProcess?.resolution_number} ${num_expediente}`

  return (
    <DashboardLayout>
      <Card title={headerName} className="text-sm text-gray-600">
        <CreateProcessForm />
      </Card>
    </DashboardLayout>
  )
}

export default CreateProcess
