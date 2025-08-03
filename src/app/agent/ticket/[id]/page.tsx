interface AgentTicketPageProps {
  params: {
    id: string
  }
}

export default function AgentTicketPage({ params }: AgentTicketPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Agent - Ticket #{params.id}</h1>
      <p>Agent view of ticket details and management tools.</p>
    </div>
  )
}
