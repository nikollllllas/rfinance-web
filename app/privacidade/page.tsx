export const metadata = { title: "Política de Privacidade — RFinance" }

const DPO_NAME = "Nikollas Ohta"
const DPO_EMAIL = "nikollasmatsuoohta@gmail.com"

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-12 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold">Política de Privacidade</h1>
      <p className="text-muted-foreground">Versão 2026-10-01</p>
      <h2 className="text-lg font-medium">Dados que coletamos</h2>
      <p>Nome, e-mail, senha (armazenada apenas como hash) e os lançamentos financeiros, categorias e orçamentos que você cadastra.</p>
      <h2 className="text-lg font-medium">Para que usamos</h2>
      <p>Exclusivamente para prestar o serviço de controle financeiro pessoal: autenticação, exibição dos seus dados e envio de e-mails de recuperação de senha. Não vendemos nem compartilhamos seus dados para publicidade.</p>
      <h2 className="text-lg font-medium">Com quem compartilhamos</h2>
      <p>Provedores de infraestrutura necessários para operar o serviço: hospedagem (Vercel, Render), banco de dados e envio de e-mail (Resend).</p>
      <h2 className="text-lg font-medium">Por quanto tempo</h2>
      <p>Enquanto sua conta existir. Ao excluir a conta, todos os seus dados financeiros são apagados imediatamente. Registros de segurança (data de login e ações administrativas, sem conteúdo financeiro) são mantidos por até 6 meses para prevenção a fraudes.</p>
      <h2 className="text-lg font-medium">Seus direitos (LGPD, art. 18)</h2>
      <p>Você pode acessar, corrigir e excluir seus dados a qualquer momento pelo próprio app (menu do usuário → Minha conta → Excluir minha conta), além de revogar este consentimento. Para outras solicitações, fale com o encarregado: {DPO_NAME} (<a href={`mailto:${DPO_EMAIL}`} className="underline underline-offset-4">{DPO_EMAIL}</a>).</p>
    </main>
  )
}
