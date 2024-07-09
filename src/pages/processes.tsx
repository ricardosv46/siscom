import { ProcesesForm } from '@components/forms/processes/ProcesesForm'
import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import React from 'react'

const Processes = () => {
  return (
    <DashboardLayout>
      <Card title="Seleccionar proceso a revisar:">
        <ProcesesForm />
      </Card>
    </DashboardLayout>
  )
}

export default Processes
