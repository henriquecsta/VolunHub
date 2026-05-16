const toneClassNames = {
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-mist-300 bg-white/80 text-slate-600',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

function ProjectSubscriptionFeedback({
  errorMessage,
  isAuthenticated,
  isChecking,
  isSubmitting,
  isVolunteer,
  projectStatus,
  subscription,
  successMessage,
}) {
  const feedback = getFeedback({
    errorMessage,
    isAuthenticated,
    isChecking,
    isSubmitting,
    isVolunteer,
    projectStatus,
    subscription,
    successMessage,
  });

  if (!feedback) {
    return null;
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClassNames[feedback.tone]}`}>
      <p className="text-sm font-semibold text-ink-900">{feedback.title}</p>
      <p className="mt-1 text-sm">{feedback.description}</p>
    </div>
  );
}

function getFeedback({
  errorMessage,
  isAuthenticated,
  isChecking,
  isSubmitting,
  isVolunteer,
  projectStatus,
  subscription,
  successMessage,
}) {
  if (!isAuthenticated) {
    return {
      tone: 'info',
      title: 'Entre para participar',
      description: 'Use uma conta de voluntario para enviar sua inscricao neste projeto.',
    };
  }

  if (!isVolunteer) {
    return null;
  }

  if (projectStatus !== 'ATIVO') {
    return {
      tone: 'warning',
      title: 'Inscricoes indisponiveis',
      description: 'Este projeto nao esta aceitando novas inscricoes no momento.',
    };
  }

  if (errorMessage) {
    return {
      tone: 'error',
      title: 'Nao foi possivel concluir a inscricao',
      description: errorMessage,
    };
  }

  if (isSubmitting) {
    return {
      tone: 'info',
      title: 'Enviando inscricao',
      description: 'Estamos registrando sua participacao com seguranca.',
    };
  }

  if (isChecking) {
    return {
      tone: 'info',
      title: 'Verificando sua inscricao',
      description: 'Estamos conferindo se voce ja participa deste projeto.',
    };
  }

  if (subscription) {
    return {
      tone: 'success',
      title: successMessage ? 'Inscricao enviada' : 'Voce ja esta inscrito',
      description: successMessage || `Status atual: ${subscription.statusLabel}.`,
    };
  }

  return null;
}

export default ProjectSubscriptionFeedback;
