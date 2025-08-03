interface AgentTicketPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AgentTicketPage({ params }: AgentTicketPageProps) {
  const { id } = await params
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Agent - Ticket #{id}</h1>
      <p>Agent view of ticket details and management tools.</p>
    </div>
  )
}
